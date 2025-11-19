import { useState } from "react";
import { parseDate } from "../utils/parseDate";
import { useAccounts } from "../hooks/useAccounts";
import TransactionsList from "./TransactionsList";

const AccountsList = ({ onViewDetails }) => {
  const { accounts, deleteAccount } = useAccounts();
  const [openAccount, setOpenAccount] = useState(null);

  const toggleAccount = (accountNumber) => {
    setOpenAccount(openAccount === accountNumber ? null : accountNumber);
  };

  const handleDelete = async (accountNumber) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le compte ${accountNumber} ?`)) return;

    const success = await deleteAccount(accountNumber);
    if (success && openAccount === accountNumber) setOpenAccount(null);
  };

  return (
    <div className="space-y-4">
      {accounts.map((acc) => {
        const type = acc.parent_account_number ? "Secondaire" : "Principal";
        const isOpen = openAccount === acc.account_number;

        return (
          <div
            key={acc.account_number}
            className="rounded-lg shadow-md border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            {/* Header de l'accordéon */}
            <button
              onClick={() => toggleAccount(acc.account_number)}
              className="w-full flex justify-between items-center p-4 transition-colors"
              style={{ color: "var(--text)" }}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{acc.account_number}</span>
                <span className="text-sm text-gray-400">{type}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-semibold">{Number(acc.balance).toFixed(2)} €</span>

                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: "var(--text)" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>

                {/* Supprimer seulement si compte secondaire */}
                {acc.parent_account_number && (
                  <button
                    className="px-3 py-1 rounded-md font-medium text-sm"
                    style={{ backgroundColor: "var(--error)", color: "var(--text-inverse)" }}
                    onClick={() => handleDelete(acc.account_number)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </button>

            {/* Contenu de l'accordéon */}
            {isOpen && (
              <div
                className="p-4 border-t space-y-3"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface-light)",
                  color: "var(--text-muted)",
                }}
              >
                <div className="flex justify-between items-center">
                  <span>
                    <strong>Création :</strong> {parseDate(acc.created_at)}
                  </span>

                  <button
                    className="px-3 py-1 rounded-md font-medium text-sm"
                    style={{ backgroundColor: "var(--primary)", color: "var(--text-inverse)" }}
                    onClick={() => onViewDetails(acc)}
                  >
                    +
                  </button>
                </div>
                <TransactionsList accountNumber={acc.account_number} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccountsList;
