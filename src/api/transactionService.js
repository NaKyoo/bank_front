export const getTransactions = async (accountNumber, token) => {
  if (!accountNumber) throw new Error("Numéro de compte manquant");

  const response = await fetch(`/api/accounts/${accountNumber}/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur lors de la récupération des transactions");
  }

  return Array.isArray(data) ? data : [];
};
