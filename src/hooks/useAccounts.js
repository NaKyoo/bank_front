import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserAccounts, closeAccount as apiCloseAccount, archiveAccount as apiArchiveAccount, openAccount as apiOpenAccount } from "../api/accountService";

export const useAccounts = () => {
  const auth = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = auth?.token || auth?.access_token || null;
      let data = await getUserAccounts(token);
      setAccounts(Array.isArray(data) ? data : (data && data.value ? data.value : []));
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des comptes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeAccount = async (accountNumber) => {
    setActionLoading(true);
    setError(null);
    try {
      return await apiCloseAccount(accountNumber);
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
      return await apiArchiveAccount(accountNumber, reason);
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

  const openAccount = async (account_number, parent_account_number, initial_balance = 0) => {
    setActionLoading(true);
    setError(null);
    try {
      const newAccount = await apiOpenAccount({ account_number, parent_account_number, initial_balance });
      await fetchAccounts();
      return newAccount;
    } catch (err) {
      setError(err.message || "Erreur lors de l'ouverture du compte");
      throw err;
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
    openAccount,
    refresh: fetchAccounts,
  };
};