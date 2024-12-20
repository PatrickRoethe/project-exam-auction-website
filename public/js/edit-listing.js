const API_URL = "https://v2.api.noroff.dev"; // Base URL
const accessToken = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const name = localStorage.getItem("name");

// Hent nødvendige data fra URL
const params = new URLSearchParams(window.location.search);
let listingId = params.get("id");

// Sjekk hvilken funksjon som skal kjøres
if (!listingId) {
  fetchUserListingsDropdown();
} else {
  fetchListingData(); // Rediger spesifikke oppføringer
  fetchUserListingsDropdown(); // Fyll dropdown med andre oppføringer
}

// Valider at input er en gyldig URL
function isValidURL(url) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$"
  );
  return urlPattern.test(url);
}

// Hent brukerens listings for dropdown
async function fetchUserListingsDropdown() {
  try {
    const response = await fetch(
      `${API_URL}/auction/profiles/${name}/listings`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch user listings");

    const { data } = await response.json();
    populateDropdown(data);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    alert("Failed to load listings. Please try again.");
  }
}

function populateDropdown(listings) {
  const dropdown = document.getElementById("listingDropdown");

  if (!listings.length) {
    dropdown.innerHTML = `<option disabled>No active listings found.</option>`;
    return;
  }

  // Legg til en default "Choose a listing" option
  let optionsHTML = `<option value="" disabled selected>-- Choose a listing --</option>`;

  // Legg til oppføringer i dropdown
  optionsHTML += listings
    .map(
      (listing) => `
      <option value="${listing.id}" ${
        listing.id === listingId ? "selected" : ""
      }>${listing.title}</option>`
    )
    .join("");

  dropdown.innerHTML = optionsHTML;

  // Event listener for dropdown
  dropdown.addEventListener("change", (e) => {
    listingId = e.target.value;
    fetchListingData();
  });
}

// Hent listing data for forhåndsutfylling
async function fetchListingData() {
  try {
    const response = await fetch(`${API_URL}/auction/listings/${listingId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch listing data");

    const { data } = await response.json();

    document.getElementById("editListingForm").style.display = "block";
    document.getElementById("title").value = data.title || "";
    document.getElementById("description").value = data.description || "";
    document.getElementById("media").value =
      data.media?.map((media) => media.url).join("\n") || "";
  } catch (error) {
    console.error("Error fetching listing data:", error);
    alert("Failed to load listing details.");
  }
}

// Oppdater listing med validering av URL-er
async function updateListing(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const mediaInput = document.getElementById("media").value.trim();

  // Valider media URL-er
  const mediaUrls = mediaInput
    ? mediaInput.split("\n").map((url) => {
        const trimmedUrl = url.trim();
        if (!isValidURL(trimmedUrl)) {
          alert(
            `Invalid URL: ${trimmedUrl}. Please provide a valid image URL.`
          );
          throw new Error("Invalid URL");
        }
        return { url: trimmedUrl, alt: "Listing Image" };
      })
    : [];

  try {
    const response = await fetch(`${API_URL}/auction/listings/${listingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({ title, description, media: mediaUrls }),
    });

    if (!response.ok) throw new Error("Failed to update listing");

    alert("Listing updated successfully!");
    window.location.href = "profile.html";
  } catch (error) {
    console.error("Error updating listing:", error);
    alert("Failed to update the listing. Please try again.");
  }
}

// Event listeners
document
  .getElementById("editListingForm")
  ?.addEventListener("submit", updateListing);
