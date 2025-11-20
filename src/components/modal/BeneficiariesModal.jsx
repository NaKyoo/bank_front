import React, { useState } from 'react';
import Modal from './Modal';
import useBeneficiaries from '../../hooks/useBeneficiaries';
import AddBeneficiaryForm from '../AddBeneficiaryForm';
import '../../styles/beneficiaries.css';

const BeneficiariesModal = ({ isOpen = true, onClose, ownerAccountNumber, startAdding = false, onAdded = null }) => {
  const { beneficiaries, loading, error, addBeneficiary, refresh } = useBeneficiaries(ownerAccountNumber);
  const [isAdding, setIsAdding] = useState(() => Boolean(isOpen && startAdding));

  const handleBeneficiaryAdded = async (createdAccountNumber = null) => {
    setIsAdding(false);
    await refresh();
    if (onAdded && createdAccountNumber) onAdded(createdAccountNumber);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="beneficiaries-root">
        <h3 className="beneficiaries-title">Mes bénéficiaires</h3>

        <div className="beneficiaries-top">
          <p className="beneficiaries-desc">Liste des comptes que vous avez ajoutés</p>
          <div>
            <button type="button" onClick={() => setIsAdding(true)} className="beneficiaries-add-btn">Ajouter un bénéficiaire</button>
          </div>
        </div>

        <div className="beneficiaries-list">
          {loading && <div>Chargement...</div>}
          {error && <div className="beneficiaries-error">{error}</div>}

          {!loading && Array.isArray(beneficiaries) && beneficiaries.length === 0 && (
            <div className="beneficiary-empty">Aucun bénéficiaire. Ajoutez-en un pour faciliter vos virements.</div>
          )}

          {!loading && Array.isArray(beneficiaries) && beneficiaries.length > 0 && (
            <ul className="beneficiary-ul">
                {beneficiaries.map((beneficiary, index) => {
                  const accountNumber = beneficiary.beneficiary_account_number || beneficiary.account_number || beneficiary;
                  const label = beneficiary.beneficiary_name || beneficiary.label || '—';
                  return (
                    <li key={`${accountNumber}-${index}`} className="beneficiary-item">
                      <div className="beneficiary-row">
                        <div className="beneficiary-info">
                          <div className="beneficiary-meta">{accountNumber}</div>
                          <div className="beneficiary-label">{label}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>

        {isAdding && (
          <div className="add-form">
            <AddBeneficiaryForm
              addBeneficiary={addBeneficiary}
              onAdded={handleBeneficiaryAdded}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BeneficiariesModal;
