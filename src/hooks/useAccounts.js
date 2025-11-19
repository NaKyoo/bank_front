import { useState, useEffect } from "react";
import { accountService } from "../api/accountService";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await accountService.getMyAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des comptes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);


  const closeAccount = async (accountNumber) => {
    setActionLoading(true);
    setError(null);

    try {
      const result = await accountService.closeAccount(accountNumber);
      return result;
    } catch (err) {
      setError(err.message || "Erreur lors de la clôture du compte");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const archiveAccount = async (accountNumber, reason = "Clôture du compte") => {
    setActionLoading(true);
    setError(null);

    try {
      const result = await accountService.archiveAccount(accountNumber, reason);
      return result;
    } catch (err) {
      setError(err.message || "Erreur lors de l'archivage du compte");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAccount = async (accountNumber) => {
    setActionLoading(true);
    setError(null);

    try {
      await closeAccount(accountNumber);

      await archiveAccount(accountNumber, "Clôture manuelle");

      await fetchAccounts();

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    accounts,
    loading,
    error,
    actionLoading,

    closeAccount,
    archiveAccount,
    deleteAccount,
    refresh: fetchAccounts,
  };
};