import { getAuthToken } from "./authService";

const ensureToken = (token) => token || getAuthToken();

const handleResponse = async (response) => {
  let text = null;
  try {
    text = await response.text();
  } catch {
    text = null;
  }

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      text ||
      `HTTP ${response.status} ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.response = data || text;
    throw error;
  }

  return data != null ? data : text;
};

export const getBeneficiaries = async (ownerAccountNumber, token) => {
  if (!ownerAccountNumber) return [];
  const headers = { "Content-Type": "application/json" };
  const resolvedToken = ensureToken(token);
  if (resolvedToken) headers.Authorization = `Bearer ${resolvedToken}`;

  const url = `/api/accounts/${encodeURIComponent(ownerAccountNumber)}/beneficiaries`;
  const response = await fetch(url, { method: "GET", headers });
  return handleResponse(response);
};

export const addBeneficiary = async (
  ownerAccountNumber,
  beneficiaryAccountNumber,
  beneficiaryName = null,
  token
) => {
  if (!ownerAccountNumber || !beneficiaryAccountNumber) {
    throw new Error("ownerAccountNumber and beneficiaryAccountNumber are required");
  }

  const headers = { "Content-Type": "application/json" };
  const resolvedToken = ensureToken(token);
  if (resolvedToken) headers.Authorization = `Bearer ${resolvedToken}`;

  const payload = { beneficiary_account_number: beneficiaryAccountNumber };
  if (beneficiaryName != null) payload.beneficiary_name = beneficiaryName;

  const url = `/api/accounts/${encodeURIComponent(ownerAccountNumber)}/beneficiaries`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export default { getBeneficiaries, addBeneficiary };
