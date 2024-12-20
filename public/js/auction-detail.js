const API_URL = "https://v2.api.noroff.dev/auction/listings";
const queryParams = new URLSearchParams(window.location.search);
const auctionId = queryParams.get("id");

// DOM-elementer
const auctionImage = document.getElementById("auctionImage");
const auctionTitle = document.getElementById("auctionTitle");
const auctionDescription = document.getElementById("auctionDescription");
const auctionEndsAt = document.getElementById("auctionEndsAt");
const currentBidsList = document.getElementById("bidsList");
const bidForm = document.getElementById("bidForm");
const bidInput = document.getElementById("bidAmount");

let highestBid = 0; // Lagre høyeste bud lokalt

// Hent detaljer for auksjonen
async function fetchAuctionDetails() {
  try {
    const response = await fetch(`${API_URL}/${auctionId}?_bids=true`);
    if (!response.ok) throw new Error("Failed to fetch auction details");

    const { data } = await response.json();

    // Oppdater bilde, tittel, beskrivelse og sluttid
    const imageUrl = data.media?.[0]?.url || "https://via.placeholder.com/600";
    auctionImage.src = imageUrl;
    auctionImage.alt = data.title || "Auction Item";

    auctionTitle.innerText = data.title || "No title available";
    auctionDescription.innerText =
      data.description || "No description available";
    auctionEndsAt.innerHTML = `<strong>Ends At:</strong> ${new Date(
      data.endsAt
    ).toLocaleString()}`;

    // Oppdater listen over bud
    currentBidsList.innerHTML = "";
    if (data.bids?.length > 0) {
      highestBid = Math.max(...data.bids.map((bid) => bid.amount));
      data.bids.forEach((bid) => {
        currentBidsList.innerHTML += `
          <li class="list-group-item">
            ${bid.bidder.name}: ${bid.amount} credits
          </li>`;
      });
    } else {
      highestBid = 0;
      currentBidsList.innerHTML =
        "<li class='list-group-item'>No bids yet.</li>";
    }

    console.log("Highest bid:", highestBid); // Debug: Sjekk høyeste bud
  } catch (error) {
    console.error("Error fetching auction details:", error);
    alert("Could not load auction details.");
  }
}

// Håndter plassering av nytt bud
bidForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bidAmount = parseInt(bidInput.value);
  let accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");

  // Sjekk token og API-nøkkel format
  if (!accessToken || !apiKey) {
    alert("You must be logged in to place a bid.");
    window.location.href = "login.html";
    return;
  }

  if (bidAmount <= highestBid) {
    alert(
      `Your bid must be higher than the current bid: ${highestBid} credits.`
    );
    return;
  }

  accessToken = accessToken.trim();

  try {
    const response = await fetch(`${API_URL}/${auctionId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey, // Legger til API-nøkkel
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    const responseData = await response.json();
    console.log("API Response:", responseData);

    if (!response.ok) {
      throw new Error(
        responseData.errors?.[0]?.message || "Failed to place bid"
      );
    }

    alert("Bid placed successfully!");
    fetchAuctionDetails(); // Oppdater budlisten
    bidForm.reset();
  } catch (error) {
    console.error("Error placing bid:", error);
    alert(`Failed to place bid: ${error.message}`);
  }
});

// Kjør funksjonen ved lasting av siden
fetchAuctionDetails();
