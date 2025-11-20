import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllTransactions } from "../api/transactionService";

export const useAllTransactions = () => {
  const { token, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      setLoading(true);
      return;
    }

    // If no token after auth loaded, set loading false and bail
    if (!token) {
      setLoading(false);
      setTransactions([]);
      setError(null);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllTransactions(token);
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, authLoading]);

  return { transactions, loading, error };
};
