import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getBeneficiaries,
  addBeneficiary as apiAddBeneficiary,
} from "../api/beneficiaryService";

export const useBeneficiaries = (ownerAccountNumber) => {
  const auth = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = auth?.token || auth?.access_token || null;
      if (!ownerAccountNumber) {
        setBeneficiaries([]);
        setLoading(false);
        return;
      }
      const data = await getBeneficiaries(ownerAccountNumber, token);
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.message || "Erreur lors de la récupération des bénéficiaires"
      );
    } finally {
      setLoading(false);
    }
  }, [auth?.token, auth?.access_token, ownerAccountNumber]);

  useEffect(() => {
    if (auth?.loading) return;
    fetchBeneficiaries();
  }, [auth?.loading, fetchBeneficiaries]);

  const addBeneficiary = async (
    beneficiaryAccountNumber,
    beneficiaryName = null
  ) => {
    setError(null);
    const accountValue = beneficiaryAccountNumber
      ? String(beneficiaryAccountNumber).trim()
      : "";
    const nameValue = beneficiaryName != null ? beneficiaryName.trim() : null;

    if (!accountValue) {
      const err = new Error("Numéro du compte bénéficiaire manquant");
      setError(err.message);
      throw err;
    }

    if (!ownerAccountNumber) {
      const err = new Error("Compte propriétaire introuvable");
      setError(err.message);
      throw err;
    }

    if (
      accountValue === String(ownerAccountNumber) ||
      beneficiaries.some((b) => {
        const existing =
          b?.beneficiary_account_number || b?.account_number || b;
        return String(existing) === accountValue;
      })
    ) {
      const err = new Error(
        "Ce compte est déjà dans vos bénéficiaires ou est votre compte"
      );
      setError(err.message);
      throw err;
    }

    setLoading(true);
    try {
      const token = auth?.token || auth?.access_token || null;
      await apiAddBeneficiary(
        ownerAccountNumber,
        accountValue,
        nameValue,
        token
      );
      await fetchBeneficiaries();
    } catch (err) {
      setError(err?.message || "Erreur lors de l'ajout du bénéficiaire");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    beneficiaries,
    loading,
    error,
    addBeneficiary,
    refresh: fetchBeneficiaries,
  };
};

export default useBeneficiaries;
