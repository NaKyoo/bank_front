import { useTransactions } from "../hooks/useTransactions";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const TransactionsList = ({ accountNumber }) => {
  const { transactions, loading, error } = useTransactions(accountNumber);
  const navigate = useNavigate();


  const formatType = (type) => {
    switch (type) {
      case "deposit":
        return "Crédit";
      case "transfer":
        return "Débit";
      default:
        return type || "—";
    }
  };

  const formatAmount = (amount) => {
    if (amount == null) return "—";
    return `${Number(amount).toFixed(2)} €`;
  };

  if (loading) return <p style={{ color: "var(--text)" }}>Chargement des transactions...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>Erreur : {error}</p>;
  if (!transactions || transactions.length === 0)
    return <p style={{ color: "var(--text-muted)" }}>Aucune transaction trouvée.</p>;

  const cellStyle = {
    borderBottom: `1px solid var(--border)`,
    whiteSpace: "normal",
    wordBreak: "break-word",
    padding: "14px 16px",
  };

  const actionsCellStyle = {
    ...cellStyle,
    minWidth: "140px",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className="overflow-y-auto"
      style={{
        maxHeight: "320px",
        border: `1px solid var(--border)`,
        borderRadius: "12px",
        padding: "8px",
        backgroundColor: "var(--surface)",
      }}
    >
      <table
        className="w-full text-sm md:text-base"
        style={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "var(--surface-light)" }}>
            <th style={cellStyle}>Date</th>
            <th style={cellStyle}>Type</th>
            <th style={cellStyle}>Montant</th>
            <th style={cellStyle}>Source</th>
            <th style={cellStyle}>Destination</th>
            <th style={actionsCellStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="hover:opacity-80 transition">
              <td style={cellStyle}>
                {new Date(txn.date).toLocaleString()}
              </td>
              <td style={cellStyle}>
                {formatType(txn.transaction_type)}
              </td>
              <td style={cellStyle}>
                {formatAmount(txn.amount)}
              </td>
              <td style={cellStyle}>
                {txn.source_account_number || "—"}
              </td>
              <td style={cellStyle}>
                {txn.destination_account_number || "—"}
              </td>
              <td style={actionsCellStyle}>
                  <button
                    onClick={() => navigate(`/transactions/${accountNumber}/${txn.id}`)}
                    className="
                      w-full md:w-auto px-4 py-2 rounded-md font-semibold
                      bg-[var(--primary)] text-[var(--text-inverse)]
                      transition-all duration-300
                      hover:scale-105 hover:brightness-110 hover:shadow-md
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  style={{ whiteSpace: "nowrap" }}
                  >
                    Voir détails
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsList.propTypes = {
  accountNumber: PropTypes.string.isRequired,
};

export default TransactionsList;
