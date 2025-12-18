import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { useTransfer } from "../../hooks/useTransfer";
import PropTypes from "prop-types";

const TransferModal = ({
  onClose,
  accounts = [],
  defaultFrom = null,
  defaultTo = "",
  onSuccess,
  token,
  onAddBeneficiaryRequest = null,
}) => {
  const { send, loading, error } = useTransfer();

  const [fromAccount, setFromAccount] = useState(defaultFrom || "");
  const [toAccount, setToAccount] = useState(defaultTo || "");
  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState(null);

  const toRef = useRef(null);

  useEffect(() => {
    if (toRef.current) toRef.current.focus();
  }, []);

  const formatAccountLabel = (a) => {
    const id = a.account_number || a.id || a.primary_account_number || "—";
    const rawBal = a.balance ?? a.amount ?? a.saldo ?? 0;
    const num =
      typeof rawBal === "number"
        ? rawBal
        : Number.parseFloat(String(rawBal).replace(",", ".")) || 0;
    const formatted =
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(num) + " €";
    const type = a.account_type || a.type || a.label || "Compte";
    return `${id} • ${type} • ${formatted}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!fromAccount) return setLocalError("Choisissez un compte source.");
    if (!toAccount.trim()) return setLocalError("Numéro destinataire invalide.");
    const amt = Number.parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) return setLocalError("Montant invalide.");

    try {
      const payload = {
        from_account: fromAccount,
        to_account: toAccount.trim(),
        amount: amt,
      };
      const res = await send({ ...payload, token });
      if (onSuccess) onSuccess({ ...payload, result: res });
      onClose();
    } catch (submitError) {
      console.error("TransferModal: submit error", submitError);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div
        className="flex flex-col gap-4"
        style={{
          backgroundColor: "var(--surface)",
          padding: "1rem",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--primary)", marginBottom: "0.5rem" }}
        >
          Faire un virement
        </h3>

        {(localError || error) && (
          <p style={{ color: "var(--error)" }}>{localError || error}</p>
        )}

        {/* Compte source */}
        <div className="flex flex-col gap-2">
        <label style={{ color: "var(--text)" }}>Compte source</label>

        <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="p-3 rounded-md"
            style={{
            backgroundColor: "var(--surface-light)",
            border: `1px solid var(--border)`,
            color: "var(--text)",
            }}
        >
            <option value="">-- Choisir --</option>

            {accounts
            .filter(a => a.account_number)
            .map(a => {
                const key = a.account_number || a.id || a.primary_account_number;
                return (
                <option key={key} value={key}>
                    {formatAccountLabel(a)}
                </option>
                );
            })}
        </select>
        </div>

        {/* Compte destinataire */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label style={{ color: "var(--text)" }}>Compte destinataire</label>
            {onAddBeneficiaryRequest && (
              <button
                type="button"
                onClick={onAddBeneficiaryRequest}
                className="text-sm font-semibold"
                style={{
                  color: "var(--primary)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + Ajouter un bénéficiaire
              </button>
            )}
          </div>
          <input
            ref={toRef}
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="Ex: ACC123456789"
            className="p-3 rounded-md"
            style={{
              backgroundColor: "var(--surface-light)",
              border: `1px solid var(--border)`,
              color: "var(--text)",
            }}
          />
        </div>

        {/* Montant */}
        <div className="flex flex-col gap-2">
          <label style={{ color: "var(--text)" }}>Montant</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="p-3 rounded-md"
            style={{
              backgroundColor: "var(--surface-light)",
              border: `1px solid var(--border)`,
              color: "var(--text)",
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 p-3 rounded-md font-semibold hover:brightness-110 transition"
            style={{
              backgroundColor: "var(--error)",
              color: "var(--text-inverse)",
            }}
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 p-3 rounded-md font-semibold hover:brightness-110 transition"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--text-inverse)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

TransferModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      account_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      is_active: PropTypes.bool,
    })
  ),
  defaultFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultTo: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  onAddBeneficiaryRequest: PropTypes.func,
};

export default TransferModal;
