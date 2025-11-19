import { useTransactions } from "../hooks/useTransactions";

const TransactionsList = ({ accountNumber }) => {
  const { transactions, loading, error } = useTransactions(accountNumber);

  if (loading) return <p style={{ color: "var(--text)" }}>Chargement des transactions...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>Erreur : {error}</p>;
  if (!transactions || transactions.length === 0)
    return <p style={{ color: "var(--text-muted)" }}>Aucune transaction trouvée.</p>;

  return (
    <div className="overflow-x-auto">
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
          {transactions.map((txn, index) => (
            <tr key={index} className="hover:opacity-80 transition">
              <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                {new Date(txn.date).toLocaleString()}
              </td>
              <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                {txn.transaction_type || "—"}
              </td>
              <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                {txn.amount != null ? `${txn.amount} €` : "—"}
              </td>
              <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                {txn.source_account_number || "—"}
              </td>
              <td className="px-3 py-2" style={{ borderBottom: `1px solid var(--border)` }}>
                {txn.destination_account_number || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
