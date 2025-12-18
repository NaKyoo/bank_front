import { useState } from "react";
import { useDeposit } from "../hooks/useDeposit";

const DepositForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const { deposit, loading, error, success } = useDeposit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number.parseFloat(amount);

    if (Number.isNaN(numAmount) || numAmount <= 0) {
      alert("Montant invalide.");
      return;
    }

    await deposit(accountNumber, numAmount);
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-6 py-8 rounded-lg shadow-lg"
         style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}>
      <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--primary-light)]">
        Faire un dépôt
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Numéro de compte"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Montant en €"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--text-inverse)] font-medium py-2 rounded-md transition"
        >
          {loading ? "Traitement..." : "Déposer"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-[var(--error)] text-sm text-center">{error}</p>
      )}
      {success && (
        <p className="mt-4 text-[var(--success)] text-sm text-center">{success}</p>
      )}
    </div>
  );
};

export default DepositForm;