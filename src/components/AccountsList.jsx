import { parseDate } from "../utils/parseDate";

const AccountsList = ({ accounts }) => {
  return (
    <table className="w-full text-left border-collapse" style={{ borderColor: "var(--border)" }}>
      <thead>
        <tr>
          <th className="p-3" style={{ borderBottom: "1px solid var(--border)", color: "var(--primary)" }}>Numéro</th>
          <th className="p-3" style={{ borderBottom: "1px solid var(--border)", color: "var(--primary)" }}>Solde (€)</th>
          <th className="p-3" style={{ borderBottom: "1px solid var(--border)", color: "var(--primary)" }}>Type</th>
          <th className="p-3" style={{ borderBottom: "1px solid var(--border)", color: "var(--primary)" }}>Date de création</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((acc) => {
          const type = acc.parent_account_number ? "Secondaire" : "Principal";
          return (
            <tr
              key={acc.account_number}
              style={{
                borderBottom: "1px solid var(--border)",
                transition: "background-color 0.3s",
              }}
              className="hover:bg-surface-light"
            >
              <td className="p-3">{acc.account_number}</td>
              <td className="p-3">{Number(acc.balance).toFixed(2)}</td>
              <td className="p-3">{type}</td>
              <td className="p-3">{parseDate(acc.created_at)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AccountsList;
