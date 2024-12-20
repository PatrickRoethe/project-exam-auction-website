const API_URL = "https://v2.api.noroff.dev"; // Base URL

// Hent access token, API key og name
const accessToken = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const userName = localStorage.getItem("name");

// Sjekk autentisering
if (!accessToken || !apiKey || !userName) {
  alert("You need to log in first.");
  window.location.href = "login.html";
}

// Valider at input er en gyldig URL
function isValidURL(url) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)([\\w-]+\\.)+[\\w-]+(\\/\\S*)?$"
  );
  return urlPattern.test(url);
}

// Hent brukerprofil
async function fetchProfile() {
  try {
    const response = await fetch(
      `${API_URL}/auction/profiles/${userName}?_=${new Date().getTime()}`, // Forhindrer caching
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch profile");

    const { data } = await response.json();

    document.getElementById("email").textContent = data.email || "N/A";
    document.getElementById("credits").textContent = data.credits || "0";
    document.getElementById("avatarImage").src =
      data.avatar?.url || "https://via.placeholder.com/150"; // Standard bilde
  } catch (error) {
    console.error("Error fetching profile:", error);
    alert("Error loading profile.");
  }
}

// Oppdater avatar
async function updateAvatar(newAvatarUrl) {
  if (!isValidURL(newAvatarUrl)) {
    alert("Please enter a valid URL for the avatar.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auction/profiles/${userName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({
        avatar: { url: newAvatarUrl, alt: "User Avatar" },
      }),
    });

    const result = await response.json();
    console.log("PUT Response:", result);

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Failed to update avatar");
    }

    // Hent ny profil etter oppdatering for å sikre at endringen er lagret
    await fetchProfile();
    alert("Avatar updated successfully!");
  } catch (error) {
    console.error("Error updating avatar:", error);
    alert(`Failed to update avatar: ${error.message}`);
  }
}

// Hent brukerens egne auksjoner
async function fetchUserListings() {
  try {
    const response = await fetch(
      `${API_URL}/auction/profiles/${userName}/listings`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch listings");

    const { data } = await response.json();
    const listingsContainer = document.getElementById("userListings");

    listingsContainer.innerHTML = data.length
      ? data
          .map(
            (listing) =>
              `<li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>${listing.title}</strong> - Ends at: ${new Date(
                listing.endsAt
              ).toLocaleString()}
                <button class="btn btn-danger btn-sm delete-btn" data-id="${
                  listing.id
                }">Delete</button>
              </li>`
          )
          .join("")
      : "<li class='list-group-item'>You have no active listings.</li>";

    // Event listener for Delete-knappene
    listingsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const listingId = e.target.dataset.id;
        deleteListing(listingId);
      }
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

// Slett en auksjon
async function deleteListing(listingId) {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    const response = await fetch(`${API_URL}/auction/listings/${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (response.status === 204) {
      alert("Listing deleted successfully!");
      fetchUserListings();
    } else {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || "Failed to delete listing");
    }
  } catch (error) {
    console.error("Error deleting listing:", error);
    alert(`Error deleting listing: ${error.message}`);
  }
}

// Hent brukerens buds
async function fetchUserBids() {
  try {
    const response = await fetch(`${API_URL}/auction/listings?_bids=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch bids");

    const { data } = await response.json();
    const userBidsContainer = document.getElementById("userBids");
    const userBids = data.filter((listing) =>
      listing.bids.some((bid) => bid.bidder.name === userName)
    );

    userBidsContainer.innerHTML = userBids.length
      ? userBids
          .map(
            (bid) =>
              `<li class="list-group-item">
                <strong>${bid.title}</strong> - Your Bid: ${
                bid.bids.find((b) => b.bidder.name === userName).amount
              } credits
              </li>`
          )
          .join("")
      : "<li class='list-group-item'>You have not placed any bids.</li>";
  } catch (error) {
    console.error("Error fetching bids:", error);
  }
}

// Kjør funksjoner ved lasting
fetchProfile();
fetchUserListings();
fetchUserBids();

document.getElementById("avatarForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const avatarURL = document.getElementById("avatarURL").value.trim();
  if (avatarURL) updateAvatar(avatarURL);
});
