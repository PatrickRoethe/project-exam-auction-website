const API_URL =
  "https://v2.api.noroff.dev/auction/listings?_active=true&_bids=true";

// Hent aktive auksjoner fra API
async function fetchListings(sortBy = "endingSoon", query = "") {
  try {
    let url = query
      ? `https://v2.api.noroff.dev/auction/listings/search?q=${query}`
      : API_URL;

    const response = await fetch(url);
    const { data } = await response.json();

    // Sorter dataene basert på valgt kriterium
    if (!query) {
      if (sortBy === "endingSoon") {
        data.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
      } else if (sortBy === "highestBids") {
        data.sort((a, b) => b._count.bids - a._count.bids);
      }
    }

    displayListings(data);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

// Oppdater HTML med auksjonsdata
function displayListings(listings) {
  const container = document.getElementById("auctionsContainer");
  container.innerHTML = ""; // Tøm eksisterende innhold

  if (listings.length === 0) {
    container.innerHTML = `<p class="text-center">No listings found.</p>`;
    return;
  }

  listings.forEach((listing) => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm mb-4">
          <img src="${
            listing.media[0]?.url || "https://via.placeholder.com/150"
          }" class="card-img-top" alt="${listing.title}">
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${
              listing.description || "No description available."
            }</p>
            <p><strong>Ends At:</strong> ${formatDate(listing.endsAt)}</p>
            <p><strong>Bids:</strong> ${listing._count.bids}</p>
            <a href="auction-detail.html?id=${
              listing.id
            }" class="btn btn-primary">Bid Now</a>
          </div>
        </div>
      </div>
    `;
  });
}

// Hjelpefunksjon for datoformattering
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

// Event Listeners for sortering og knapp-markering
const sortButtons = document.querySelectorAll(".btn-sort");

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sortButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const sortBy =
      button.id === "sortEndingSoon" ? "endingSoon" : "highestBids";
    fetchListings(sortBy);
  });
});

// Søkefunksjonalitet
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.trim();
  fetchListings("", query);
});

// Kjør funksjonen ved lasting av siden
fetchListings();
