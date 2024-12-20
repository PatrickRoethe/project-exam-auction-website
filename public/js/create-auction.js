const API_URL = "https://v2.api.noroff.dev"; // Base URL

// Hent access token og API key fra localStorage
const accessToken = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");

// Sjekk autentisering
if (!accessToken || !apiKey) {
  alert("You need to log in to create an auction.");
  window.location.href = "login.html";
}

// Håndter innsending av auksjonsskjemaet
document
  .getElementById("createAuctionForm")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Hent verdier fra skjema
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value;
    const mediaInput = document.getElementById("media").value.trim();

    // Konverter media til en array (1 URL per linje)
    const media = mediaInput
      ? mediaInput.split("\n").map((url) => ({ url: url.trim(), alt: title }))
      : [];

    // Valider deadline-dato
    const endsAt = new Date(date).toISOString();
    if (new Date(endsAt) <= new Date()) {
      alert("Deadline must be a future date.");
      return;
    }

    try {
      // Send POST-request til API
      const response = await fetch(`${API_URL}/auction/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          title,
          description,
          endsAt,
          media,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errors?.[0]?.message || "Failed to create auction."
        );
      }

      // Vis suksessmelding
      alert("Auction created successfully!");
      window.location.href = "profile.html"; // Naviger til profilsiden
    } catch (error) {
      console.error("Error creating auction:", error.message);
      alert(`Error: ${error.message}`);
    }
  });
