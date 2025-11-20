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

      const txId = data?.transaction_id || data?.id || data?.transaction?.id;
      const status = data?.status || data?.transaction?.status;
      if (txId && status && String(status).toLowerCase().includes("pending")) {
        const maxRetries = 12; // ~12s
        const delayMs = 1000;
        for (let i = 0; i < maxRetries; i++) {
          try {
            await new Promise((res) => setTimeout(res, delayMs));
            const tx = await getTransaction({ user_account_number: from_account, transaction_id: txId, token });
            const s = tx?.status || tx?.transaction?.status;
            if (s && String(s).toLowerCase().includes("completed")) {
              setResult(tx);
              return tx;
            }
          } catch (pollErr) {
            // ignore transient polling errors and continue
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
