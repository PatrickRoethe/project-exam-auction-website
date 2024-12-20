const navbarContent = document.getElementById("navbarContent");

// Hent token og API-nøkkel fra localStorage
const accessToken = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");

// Funksjon for å sikre at brukeren er logget inn på beskyttede sider
function checkProtectedPage() {
  const protectedPages = [
    "create-auction.html",
    "profile.html",
    "edit-listing.html",
  ];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && (!accessToken || !apiKey)) {
    alert("You must be logged in to access this page.");
    window.location.href = "login.html";
  }
}

// Funksjon for å oppdatere hvilken side som er aktiv
function getActiveClass(page) {
  const currentPage = window.location.pathname.split("/").pop();
  return currentPage === page ? "active" : "";
}

function renderNavbar() {
  let navHTML = `
    <li class="nav-item">
      <a class="nav-link ${getActiveClass(
        "index.html"
      )}" href="index.html">Home</a>
    </li>
  `;

  if (accessToken && apiKey) {
    // Bruker er logget inn
    navHTML += `
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(
          "create-auction.html"
        )}" href="create-auction.html">Create Auction</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(
          "profile.html"
        )}" href="profile.html">Profile</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(
          "edit-listing.html"
        )}" href="edit-listing.html">Edit Listing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="logout" href="#">Logout</a>
      </li>
    `;
  } else {
    // Bruker er ikke logget inn
    navHTML += `
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(
          "login.html"
        )}" href="login.html">Login</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(
          "register.html"
        )}" href="register.html">Register</a>
      </li>
    `;
  }

  navbarContent.innerHTML = navHTML;

  // Logg ut funksjonalitet
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("apiKey");
      localStorage.removeItem("name");
      window.location.href = "index.html";
    });
  }
}

// Kjør funksjonene ved lasting
checkProtectedPage();
renderNavbar();
