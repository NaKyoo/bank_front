import { getAuthToken } from "./authService";
const ensureToken = (token) => token || getAuthToken();

const handleResponse = async (response) => {
  if (response.status === 401) {
    const err = new Error("Unauthorized");
    err.code = "UNAUTHORIZED";
    throw err;
  }

    // Lire le texte brut (utile si la réponse n'est pas JSON)
    let text = null;
    try {
      text = await response.text();
    } catch {
      text = null;
    }

    // Tenter de parser le JSON si possible
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      const serverMsg = (data && (data.detail || data.message)) || text || `HTTP ${response.status} ${response.statusText}`;
      const err = new Error(serverMsg);
      err.status = response.status;
      // Inclure données parsées et texte brut pour debug
      err.response = data || text;
      err.responseText = text;
      console.error("API error:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers ? response.headers.entries() : []),
        body: data || text,
      });
      throw err;
    }

    // En cas de succès, retourner JSON si parsé sinon texte brut
    return data != null ? data : (text || null);
};

export const getBeneficiaries = async (ownerAccountNumber, token) => {
  if (!ownerAccountNumber) return [];
  const t = ensureToken(token);
  const headers = { "Content-Type": "application/json" };
  if (t) headers.Authorization = `Bearer ${t}`;
  // Utiliser le préfixe `/api` (proxy Vite vers backend)
  const url = `/api/accounts/${encodeURIComponent(ownerAccountNumber)}/beneficiaries`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

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

  const t = ensureToken(token);
  const headers = { "Content-Type": "application/json" };
  if (t) headers.Authorization = `Bearer ${t}`;

  const payload = { beneficiary_account_number: beneficiaryAccountNumber };
  if (beneficiaryName != null) payload.beneficiary_name = beneficiaryName;

  const body = JSON.stringify(payload);
  const url = `/api/accounts/${encodeURIComponent(ownerAccountNumber)}/beneficiaries`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });
    return handleResponse(response);
  } catch (err) {
    // Log puis relancer
    console.error("addBeneficiary failed", { url, payload, err });
    throw err;
  }
};

export default { getBeneficiaries, addBeneficiary };
