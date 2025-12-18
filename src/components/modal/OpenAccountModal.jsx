import PropTypes from "prop-types";
import { useState } from "react";

const OpenAccountModal = ({ parentAccountNumber, onClose, openAccount, refresh }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!accountNumber.trim()) {
      setApiError("Le numéro du compte est obligatoire.");
      return;
    }

    if (!parentAccountNumber) {
      setApiError("Impossible d’ouvrir un compte secondaire : compte parent manquant.");
      return;
    }

    try {
      setLoading(true);
      await openAccount(accountNumber.trim(), parentAccountNumber);
      await refresh();  // <- rafraîchit la liste des comptes dans ProfilePage
      setAccountNumber("");
      onClose();
    } catch (err) {
      setApiError(err.message || "Erreur lors de l'ouverture du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold" style={{ color: "var(--primary)" }}>
        Ouvrir un compte secondaire
      </h3>

      {apiError && (
        <div
          className="p-3 rounded-md"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--error)",
            color: "var(--error)"
          }}
        >
          <p className="font-semibold">❌ Erreur</p>
          <p className="text-sm mt-1">{apiError}</p>
          {apiError.includes("plus de 5 comptes") && (
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              💡 Astuce : Certains comptes peuvent être masqués. Contactez l'administrateur pour nettoyer les comptes inactifs.
            </p>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Numéro du compte"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="p-3 rounded-md"
        style={{
          backgroundColor: "var(--surface-light)",
          border: `1px solid var(--border)`,
          color: "var(--text)"
        }}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 p-3 rounded-md bg-primary text-text-inverse font-semibold hover:brightness-110 transition"
        >
          {loading ? "Ouverture..." : "Ouvrir le compte"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 p-3 rounded-md bg-error text-text-inverse font-semibold hover:brightness-110 transition"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

OpenAccountModal.propTypes = {
  parentAccountNumber: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  openAccount: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default OpenAccountModal;
