import { getAuthToken } from "./authService";

export const accountService = {
  getMyAccounts: async () => {
    const token = getAuthToken();

    const response = await fetch(`api/users/me/accounts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Erreur lors de la récupération des comptes");
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
};
