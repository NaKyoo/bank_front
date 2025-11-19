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
};
