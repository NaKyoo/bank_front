import { useState } from "react";
import { transfer, getTransaction } from "../api/transactionService";

export const useTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const send = async ({ from_account, to_account, amount, token }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await transfer({ from_account, to_account, amount, token });
      // If backend returns a transaction id and status is pending, poll until completed
      setResult(data);

      const transactionId = data?.transaction_id || data?.id || data?.transaction?.id;
      const initialStatus = data?.status || data?.transaction?.status;
      if (transactionId && initialStatus && String(initialStatus).toLowerCase().includes("pending")) {
        const maxRetries = 12; // ~12s
        const delayMs = 1000;
        for (let i = 0; i < maxRetries; i++) {
          try {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            const updatedTransaction = await getTransaction({ user_account_number: from_account, transaction_id: transactionId, token });
            const currentStatus = updatedTransaction?.status || updatedTransaction?.transaction?.status;
            if (currentStatus && String(currentStatus).toLowerCase().includes("completed")) {
              setResult(updatedTransaction);
              return updatedTransaction;
            }
          } catch (pollingError) {
            // ignore transient polling errors and continue
            console.debug('Polling attempt failed, retrying...', pollingError.message);
          }
        }
        // timeout — return original pending data
        return data;
      }

      return data;
    } catch (err) {
      setError(err.message || "Erreur lors du transfert");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error, result };
};