import { getAuthToken } from "./authService";

// Helper to resolve token from parameter or from stored auth
const ensureToken = (token) => token || getAuthToken();

const handleResponse = async (response) => {
  if (response.status === 401) {
    const err = new Error("Unauthorized");
    err.code = "UNAUTHORIZED";
    throw err;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const msg = (data && (data.detail || data.message)) || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  return data;
};

export const getUserInfo = async (token) => {
  const t = ensureToken(token);
  const response = await fetch(`/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
  });

  return handleResponse(response);
};

export const getUserAccounts = async (token) => {
  const t = ensureToken(token);
  const response = await fetch(`/api/users/me/accounts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
  });

  return handleResponse(response);
};

export const openAccount = async ({ account_number, parent_account_number = null, initial_balance = 0 }, token) => {
  const t = ensureToken(token);
  const response = await fetch(`/api/accounts/open`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify({ account_number, parent_account_number, initial_balance }),
  });

  return handleResponse(response);
};

export const closeAccount = async (accountNumber, token) => {
  const t = ensureToken(token);
  const response = await fetch(`/api/accounts/${accountNumber}/close`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
  });

  return handleResponse(response);
};

export const archiveAccount = async (accountNumber, reason = "Clôture du compte", token) => {
  const t = ensureToken(token);
  const response = await fetch(`/api/accounts/${accountNumber}/archive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    },
    body: JSON.stringify({ reason }),
  });

  return handleResponse(response);
};

export default {
  getUserInfo,
  getUserAccounts,
  openAccount,
  closeAccount,
  archiveAccount,
};
