import { useState } from "react";
import { useDeposit } from "../hooks/useDeposit";

const DepositForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const { deposit, loading, error, success } = useDeposit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Montant invalide.");
      return;
    }

    await deposit(accountNumber, numAmount);
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-lg shadow bg-[var(--surface)] text-[var(--text)]">
      <h2 className="text-2xl font-semibold text-center mb-4">Faire un dépôt</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Numéro de compte"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Montant (€)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
          step="0.01"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Traitement..." : "Déposer"}
        </button>
      </form>

      {error && <p className="text-[var(--error)] text-sm mt-2">{error}</p>}
      {success && <p className="text-[var(--success)] text-sm mt-2">{success}</p>}
    </div>
  );
};

export default DepositForm;
