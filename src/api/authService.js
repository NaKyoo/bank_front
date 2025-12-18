import { API_URL } from "./config"; 


export const signupRequest = async (credentials) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur inconnue");
  }

  return data;
};

export const loginRequest = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur inconnue");
  }

  localStorage.setItem("token", data.token);

  return data;
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};