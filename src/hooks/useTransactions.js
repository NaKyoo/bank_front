import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../api/transactionService";

export const useTransactions = (accountNumber) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accountNumber || !token) return;

    const loadTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactions(accountNumber, token);
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [accountNumber, token]);

  return { transactions, loading, error };
};
