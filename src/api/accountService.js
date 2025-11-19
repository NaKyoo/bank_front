// Service API pour gérer les comptes bancaires
// Responsabilité unique : communiquer avec le backend

/**
 * Récupère les informations de l'utilisateur connecté
 * @param {string} token - Le token JWT de l'utilisateur
 * @returns {Promise<Object>} Les données de l'utilisateur (nom, email)
 */
export const getUserInfo = async (token) => {
  const response = await fetch("/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.detail || "Erreur lors de la récupération des données utilisateur");
  return data;
};

/**
 * Récupère tous les comptes bancaires de l'utilisateur
 * @param {string} token - Le token JWT de l'utilisateur
 * @returns {Promise<Array>} Liste des comptes (account_number, balance, account_type, etc.)
 */
export const getUserAccounts = async (token) => {
  const response = await fetch("/api/users/me/accounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.detail || "Erreur lors de la récupération des comptes");
  return data;
};
