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

// Backwards-compatible object export (some hooks/components import `accountService`)
export const accountService = {
  getMyAccounts: getUserAccounts,
  getUserAccounts,
  getUserInfo,
};

// Effectuer un transfert entre comptes
export const transfer = async ({ from_account, to_account, amount, token }) => {
  const t = token || getAuthToken();
  const endpoints = [
    "/transfer",
    "/api/transfer",
    "http://127.0.0.1:8000/transfer",
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ from_account, to_account, amount }),
      });

      // Try to parse JSON safely; if parsing fails, use text fallback
      let data = null;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        // invalid or empty JSON
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`HTTP ${response.status} ${text || response.statusText}`);
        }
        throw new Error("Réponse vide ou non-JSON reçue du serveur");
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.detail || `Erreur ${response.status}`);
      }

      return data;
    } catch (err) {
      // If 404 or network error, try next endpoint
      lastError = err;
      // continue to next URL
    }
  }

  // If we reach here, all endpoints failed
  throw lastError || new Error("Erreur lors du transfert (endpoints épuisés)");
};

// Récupérer une transaction par account + id
export const getTransaction = async ({ user_account_number, transaction_id, token }) => {
  const t = token || getAuthToken();
  const url = `/transactions/${encodeURIComponent(user_account_number)}/${encodeURIComponent(transaction_id)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
  });

  // some endpoints might return empty body on 404 etc — handle safely
  const text = await response.text().catch(() => "");
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // non-JSON response
      if (!response.ok) throw new Error(`HTTP ${response.status} ${text}`);
      throw new Error("Réponse non-JSON reçue lors de la récupération de la transaction");
    }
  }
  if (!response.ok) throw new Error(data?.message || data?.detail || `HTTP ${response.status}`);
  return data;
};
