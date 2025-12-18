import { API_URL } from "./config"; 


export const getTransactions = async (accountNumber, token) => {
  if (!accountNumber) throw new Error("Numéro de compte manquant");

  const response = await fetch(`${API_URL}/accounts/${accountNumber}/transactions`, {
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

export const getAllTransactions = async (token) => {

  const response = await fetch(`/api/users/me/transactions`, {
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


const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && (data.detail || data.message)) || `HTTP ${response.status}`);
  }
  return data;
};

export const transfer = async ({ from_account, to_account, amount, token }) => {
  const response = await fetch(`/api/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ from_account, to_account, amount }),
  });

  return handleResponse(response);
};

export const getTransaction = async ({ user_account_number, transaction_id, token }) => {
  if (!user_account_number || !transaction_id) throw new Error("Paramètres manquants pour getTransaction");
  const response = await fetch(`/api/transactions/${user_account_number}/${transaction_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return handleResponse(response);
};