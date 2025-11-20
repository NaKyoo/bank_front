import React from 'react';

const AccountCard = ({ acct, onDetails, onHistory, onTransfer }) => {
  const id = acct.account_number || acct.id || acct.accountId || acct.primary_account_number || '—';
  const rawBalance = acct.balance ?? acct.amount ?? acct.saldo ?? 0;
  const numericBalance = typeof rawBalance === 'number' ? rawBalance : parseFloat(String(rawBalance).replace(',', '.')) || 0;
  const type = acct.account_type || acct.type || acct.label || 'Compte';
  const isSecondary = !!acct.parent_account_number;

  const formatter = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <article className={`account-card ${isSecondary ? 'account-secondary' : 'account-primary'}`}>
      <div className="account-info">
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div className="account-type">{type}</div>
          <div className={`account-badge ${isSecondary ? 'secondary' : 'primary'}`}>{isSecondary ? 'Secondaire' : 'Principal'}</div>
        </div>
        <div className="account-id">{id}</div>
        <div className={`account-balance ${numericBalance < 0 ? 'balance-negative' : ''}`}>{formatter.format(numericBalance)} €</div>
      </div>

      <div className="account-actions">
        <button className="btn btn-primary" onClick={() => onDetails && onDetails(id)}>Détails</button>
        <button className="btn btn-secondary" onClick={() => onHistory && onHistory(id)}>Historique</button>
        <button className="btn btn-ghost" onClick={() => onTransfer && onTransfer(id)}>Virement</button>
      </div>
    </article>
  );
};

export default AccountCard;
