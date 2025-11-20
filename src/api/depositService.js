import { getAuthToken } from "./authService";

export const depositService = {
  depositToAccount: async (accountNumber, amount) => {
    const token = getAuthToken();

    const params = new URLSearchParams({
      account_number: accountNumber,
      deposit_amount: amount.toString(),
    });

    const response = await fetch(`/api/deposit?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erreur lors du dépôt.");
    }

    return await response.json();
  },
};
