const API_URL = "https://v2.api.noroff.dev"; // Base URL

// Funksjon for registrering
export async function registerUser(name, email, password, avatarUrl = "") {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      avatar: { url: avatarUrl, alt: "User Avatar" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors[0]?.message || "Registration failed.");
  }
  return await response.json();
}

// Funksjon for innlogging
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors[0]?.message || "Login failed.");
  }
  return await response.json();
}
