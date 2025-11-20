import { useState } from 'react';
import { depositService } from '../api/depositService';

export const useDeposit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const deposit = async (accountNumber, amount) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await depositService.depositToAccount(accountNumber, amount);
      setSuccess(`Dépôt de ${amount}€ effectué avec succès.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deposit, loading, error, success };
};