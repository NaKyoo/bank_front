import { getAuthToken } from "./authService";

// Service API pour gérer les comptes bancaires
// Responsabilité unique : communiquer avec le backend

const ensureToken = (token) => token || getAuthToken();

export const getUserInfo = async (token) => {
  const t = ensureToken(token);
  const response = await fetch("/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.detail || "Erreur lors de la récupération des données utilisateur");
  return data;
};

export const getUserAccounts = async (token) => {
  const t = ensureToken(token);
  const response = await fetch("/api/users/me/accounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.detail || "Erreur lors de la récupération des comptes");
  return data;
};
