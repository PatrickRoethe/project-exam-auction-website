const API_URL = "https://v2.api.noroff.dev";

// Generer API Key
async function generateApiKey(accessToken) {
  try {
    const response = await fetch(`${API_URL}/auth/create-api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: "Auction House API Key" }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate API Key");
    }

    const result = await response.json();
    return result.data.key; // Returnerer API-nøkkelen
  } catch (error) {
    console.error("Error creating API Key:", error.message);
    throw error;
  }
}

// Registreringsfunksjon
export async function registerUser(name, email, password, avatarUrl = "") {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      avatar: avatarUrl ? { url: avatarUrl, alt: "User Avatar" } : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.message || "Registration failed.");
  }
  return await response.json();
}

// Innloggingsfunksjon
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Login failed.");
  }

  const accessToken = data.data.accessToken;
  const userName = data.data.name;

  // Lagre accessToken og name i localStorage
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("name", userName);

  console.log("Login successful. Generating API Key...");

  // Generer og lagre API Key
  try {
    const apiKey = await generateApiKey(accessToken);
    localStorage.setItem("apiKey", apiKey);
    console.log("API Key saved to localStorage:", apiKey);
  } catch (error) {
    console.error("Failed to generate API Key:", error.message);
    alert("Failed to generate API Key. Try again.");
  }

  return data;
}

// Håndter registreringsskjema
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.replace(/\s+/g, "_");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const avatar = document.getElementById("avatar").value;

    try {
      await registerUser(name, email, password, avatar);
      alert("Registration successful! Redirecting to login page.");
      window.location.href = "login.html";
    } catch (error) {
      if (error.message.includes("Profile already exists")) {
        alert("Profile already exists. Redirecting to login page.");
        window.location.href = "login.html";
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  });
}

// Håndter innloggingsskjema
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await loginUser(email, password);
      alert("Login successful! Redirecting to profile...");
      window.location.href = "profile.html";
    } catch (error) {
      console.error("Login error:", error.message);
      alert(`Error: ${error.message}`);
    }
  });
}
