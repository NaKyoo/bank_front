import React, { useState } from 'react';

const AddBeneficiaryForm = ({ addBeneficiary, onAdded, onCancel }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!accountNumber || String(accountNumber).trim().length < 3) return setError('Numéro invalide');
    setLoading(true);
    try {
      await addBeneficiary(String(accountNumber).trim(), beneficiaryName ? String(beneficiaryName).trim() : null);
      setAccountNumber('');
      setBeneficiaryName('');
      if (onAdded) onAdded();
    } catch (err) {
      setError(err?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="add-form">
      <div className="add-form-row">
        <input
          className="input-text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Numéro du compte bénéficiaire"
        />

        <input
          className="input-text"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          placeholder="Nom du bénéficiaire (optionnel)"
        />

        <button type="button" onClick={onCancel} className="btn-cancel" disabled={loading}>Annuler</button>
        <button type="submit" className="btn-add" disabled={loading}>{loading ? 'Ajout...' : 'Ajouter'}</button>
      </div>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default AddBeneficiaryForm;
