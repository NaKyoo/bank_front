import { useState } from "react";
import Modal from "./Modal";
import useBeneficiaries from "../../hooks/useBeneficiaries";
import AddBeneficiaryForm from "../AddBeneficiaryForm";
import "../../styles/beneficiaries.css";

const BeneficiariesModal = ({
  isOpen = true,
  onClose,
  ownerAccountNumber,
  startAdding = false,
  onAdded = null,
  onPick = null,
}) => {
  const { beneficiaries, loading, error, addBeneficiary, refresh } =
    useBeneficiaries(ownerAccountNumber);
  const [isAdding, setIsAdding] = useState(() => Boolean(isOpen && startAdding));

  const handleAdded = async (createdAccountNumber) => {
    setIsAdding(false);
    await refresh();
    if (onAdded && createdAccountNumber) onAdded(createdAccountNumber);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="beneficiaries-root">
        <h3 className="beneficiaries-title">Mes bénéficiaires</h3>

        <div className="beneficiaries-top">
          <p className="beneficiaries-desc">
            Gérez les comptes favoris pour accélérer vos virements
          </p>
          <button
            type="button"
            className="beneficiaries-add-btn"
            onClick={() => setIsAdding(true)}
          >
            Ajouter un bénéficiaire
          </button>
        </div>

        <div className="beneficiaries-list">
          {loading && <div>Chargement...</div>}
          {error && <div className="beneficiaries-error">{error}</div>}

          {!loading && (!beneficiaries || beneficiaries.length === 0) && (
            <div className="beneficiary-empty">
              Aucun bénéficiaire enregistré pour le moment.
            </div>
          )}

          {!loading && Array.isArray(beneficiaries) && beneficiaries.length > 0 && (
            <ul className="beneficiary-ul">
              {beneficiaries.map((beneficiary, index) => {
                const accountNumber =
                  beneficiary?.beneficiary_account_number ||
                  beneficiary?.account_number ||
                  beneficiary;
                const label =
                  beneficiary?.beneficiary_name || beneficiary?.label || "—";
                return (
                  <li
                    key={`${accountNumber}-${index}`}
                    className="beneficiary-item"
                  >
                    <button
                      type="button"
                      className="beneficiary-btn"
                      onClick={() => {
                        if (onPick && accountNumber) {
                          try {
                            onPick(accountNumber);
                          } catch (pickError) {
                            console.error("BeneficiariesModal: onPick failed", pickError);
                          }
                        }
                        if (onClose) onClose();
                      }}
                    >
                      <div className="beneficiary-row">
                        <div className="beneficiary-info">
                          <div className="beneficiary-meta">{accountNumber}</div>
                          <div className="beneficiary-label">{label}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {isAdding && (
          <AddBeneficiaryForm
            addBeneficiary={addBeneficiary}
            onAdded={handleAdded}
            onCancel={() => setIsAdding(false)}
          />
        )}
      </div>
    </Modal>
  );
};

export default BeneficiariesModal;
