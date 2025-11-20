import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { useTransfer } from '../../hooks/useTransfer';

const TransferModal = ({ onClose, accounts = [], defaultFrom = null, onSuccess, token }) => {
  const { send, loading, error } = useTransfer();

  const [fromAccount, setFromAccount] = useState(defaultFrom || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [localError, setLocalError] = useState(null);
  const toRef = useRef(null);

  useEffect(() => {
    // focus destinataire pour accélérer l'usage
    if (toRef.current) toRef.current.focus();
  }, []);

  const formatAccountLabel = (a) => {
    const id = a.account_number || a.id || a.primary_account_number || '—';
    const rawBal = a.balance ?? a.amount ?? a.saldo ?? 0;
    const num = typeof rawBal === 'number' ? rawBal : parseFloat(String(rawBal).replace(',', '.')) || 0;
    const formatted = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num) + ' €';
    const type = a.account_type || a.type || a.label || 'Compte';
    return `${id} • ${type} • ${formatted}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!fromAccount) return setLocalError('Choisissez un compte source.');
    if (!toAccount || String(toAccount).trim().length < 3) return setLocalError('Numéro destinataire invalide.');
    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) return setLocalError('Montant invalide.');

    try {
      const payload = { from_account: fromAccount, to_account: toAccount.trim(), amount: amt };
      const res = await send({ ...payload, token });
      if (onSuccess) onSuccess({ ...payload, result: res });
      onClose();
    } catch {
      // useTransfer sets the `error` state; we'll show that below
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="transfer-modal" role="dialog" aria-label="Virement">
        <h3 className="transfer-title">Faire un virement</h3>

        <form className="transfer-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="fromAccount">Compte source</label>
            <select id="fromAccount" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
              <option value="">-- Choisir --</option>
              {accounts.map((a) => {
                const key = a.account_number || a.id || a.primary_account_number;
                return (
                  <option key={key} value={key}>{formatAccountLabel(a)}</option>
                );
              })}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="toAccount">Compte destinataire (numéro)</label>
            <input
              id="toAccount"
              ref={toRef}
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              placeholder="Ex: ACC123456789"
              inputMode="numeric"
              aria-required="true"
            />
          </div>

          <div className="form-row">
            <label htmlFor="amount">Montant</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              aria-required="true"
            />
          </div>

          {(localError || error) && (
            <div className="transfer-error" role="alert">{localError || error}</div>
          )}

          <div className="actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TransferModal;
