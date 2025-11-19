import { useState, useEffect } from "react";
import { accountService } from "../api/accountService";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchAccounts();
  }, []);

  return { accounts, loading, error };
};
