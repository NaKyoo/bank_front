import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllTransactions } from "../api/transactionService";

export const useAllTransactions = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

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
  }, [token]);

  return { transactions, loading, error };
};
