import { useTransactions } from "../hooks/useTransactions";
import { useNavigate } from "react-router-dom";


const TransactionsList = ({ accountNumber }) => {
  const navigate = useNavigate();
  const { transactions, loading, error } = useTransactions(accountNumber);

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


  return (
    <div
      className="overflow-y-auto overflow-x-auto"
      style={{
        maxHeight: "250px",
        border: `1px solid var(--border)`,
        borderRadius: "8px"
      }}
    >
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--surface-light)" }}>
            <th className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>Date</th>
            <th className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>Type</th>
            <th className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>Montant</th>
            <th className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>Source</th>
            <th className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>Destination</th>
          </tr>
        </thead>

      <tbody>
  {transactions.map((txn, index) => {
    console.log("transaction ID :", txn.id);
    console.log("account number :", accountNumber);

    return (
              <tr key={index} className="hover:opacity-80 transition">
                <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                  {new Date(txn.date).toLocaleString()}
                </td>
                <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                  {formatType(txn.transaction_type)}
                </td>
                <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                  {formatAmount(txn.amount)}
                </td>
                <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                  {txn.source_account_number || "—"}
                </td>
                <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                  {txn.destination_account_number || "—"}
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => navigate(`/transactions/${accountNumber}/${txn.id}`)}
                    className="
                      ml-4 px-4 py-2 rounded-md font-semibold
                      bg-[var(--primary)] text-[var(--text-inverse)]
                      transition-all duration-300
                      hover:scale-105 hover:brightness-110 hover:shadow-md
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    Voir détails
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
