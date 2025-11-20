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

  // handle 401 explicitly so callers can react (logout / refresh)
  if (response.status === 401) {
    const err = new Error("Unauthorized");
    err.code = "UNAUTHORIZED";
    throw err;
  }

    return data;
  },

  closeAccount: async (accountNumber) => {
    const token = getAuthToken();

    const response = await fetch(`api/accounts/${accountNumber}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Erreur lors de la clôture du compte ${accountNumber}`);
    }

    return data;
  },

  archiveAccount: async (accountNumber, reason = "Clôture du compte") => {
    const token = getAuthToken();

    const response = await fetch(`api/accounts/${accountNumber}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Erreur lors de l'archivage du compte ${accountNumber}`);
    }

    return data;
  },

  openAccount: async ({ account_number, parent_account_number, initial_balance = 0 }) => {
    const token = getAuthToken();
    const response = await fetch(`/api/accounts/open`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ account_number, parent_account_number, initial_balance }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Erreur lors de l'ouverture du compte");
    }
    return data;
  },
};
