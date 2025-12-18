import { useState } from "react";
import PropTypes from "prop-types";

const AddBeneficiaryForm = ({ addBeneficiary, onAdded, onCancel }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const accountValue = accountNumber.trim();
    const nameValue = beneficiaryName.trim();

    if (!accountValue) {
      setError("Numéro de compte requis");
      return;
    }

    setSubmitting(true);
    try {
      await addBeneficiary(accountValue, nameValue || null);
      if (onAdded) onAdded(accountValue);
      setAccountNumber("");
      setBeneficiaryName("");
    } catch (err) {
      setError(err?.message || "Erreur lors de l'ajout");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="add-form-row">
        <input
          className="input-text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Numéro du compte bénéficiaire"
          disabled={submitting}
        />

        <input
          className="input-text"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          placeholder="Nom du bénéficiaire (optionnel)"
          disabled={submitting}
        />

        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Annuler
        </button>

        <button type="submit" className="btn-add" disabled={submitting}>
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

AddBeneficiaryForm.propTypes = {
  addBeneficiary: PropTypes.func.isRequired,
  onAdded: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddBeneficiaryForm;
