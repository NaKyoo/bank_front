import { parseDate } from "../utils/parseDate";

const AccountsList = ({ accounts, onViewDetails }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="border-b p-2">Numéro</th>
          <th className="border-b p-2">Solde (€)</th>
          <th className="border-b p-2">Type</th>
          <th className="border-b p-2">Création</th>
          <th className="border-b p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((acc) => {
          const type = acc.parent_account_number ? "Secondaire" : "Principal";
          return (
            <tr key={acc.account_number} className="hover:bg-surface-light transition">
              <td className="border-b p-2">{acc.account_number}</td>
              <td className="border-b p-2">{Number(acc.balance).toFixed(2)}</td>
              <td className="border-b p-2">{type}</td>
              <td className="border-b p-2">{parseDate(acc.created_at)}</td>
              <td className="border-b p-2">
                <button
                  className="px-3 py-1 rounded-md font-medium text-sm bg-primary text-text-inverse hover:brightness-110 transition"
                  onClick={() => onViewDetails(acc)}
                >
                  Voir détails
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AccountsList;
