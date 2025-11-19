export const signupRequest = async (credentials) => {
  const response = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.detail || "Erreur inconnue");
  return data;
};

export const loginRequest = async (credentials) => {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.detail || "Erreur inconnue");
  return data;
};
