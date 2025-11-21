import { useState } from "react";
import { parseDate } from "../utils/parseDate";
import TransactionsList from "./TransactionsList";

const AccountsList = ({ accounts, onDelete, onDeposit, onTransfer }) => {
  const [openAccount, setOpenAccount] = useState(null);

  const toggleAccount = (accountNumber) => {
    setOpenAccount(openAccount === accountNumber ? null : accountNumber);
  };

  return (
    <div className="space-y-4">
      {accounts
        .filter((acc) => acc.is_active)
        .map((acc) => {
          const type = acc.parent_account_number ? "Secondaire" : "Principal";
          const isOpen = openAccount === acc.account_number;

          return (
            <div
              key={acc.account_number}
              className="rounded-lg shadow-md border transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Header de l'accordéon */}
              <button
                onClick={() => toggleAccount(acc.account_number)}
                className="
                  w-full flex justify-between items-center p-4
                  transition-all duration-300 cursor-pointer
                  hover:bg-opacity-50 hover:brightness-105
                "
                style={{ color: "var(--text)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{acc.account_number}</span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {type}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-semibold">
                    {Number(acc.balance).toFixed(2)} €
                  </span>

                  <svg
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "var(--text)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>

                  {/* Supprimer un compte secondaire */}
                  {acc.parent_account_number && onDelete && (
                    <button
                      className="
                        px-2 py-1 rounded-md transition-all
                        hover:scale-105 hover:brightness-110 hover:shadow-md
                      "
                      style={{
                        backgroundColor: "var(--error)",
                        color: "var(--text-inverse)",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmed = window.confirm(
                          `Êtes-vous sûr de vouloir supprimer le compte ${acc.account_number} ?`
                        );
                        if (confirmed) {
                          onDelete(acc.account_number);
                        }
                      }}
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
                  className="p-4 border-t space-y-4 transition-all duration-300"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface-light)",
                    color: "var(--text-muted)",
                  }}
                >
                  {/* ⭐︎ Boutons actions */}
                  <div className="flex justify-around">
  
                    {/* ⭐︎ Bouton Dépôt */}
                    <button
                      className="
                        px-4 py-2 rounded-md font-medium text-sm
                        transition-all duration-300 cursor-pointer
                        hover:scale-105 hover:brightness-110 hover:shadow-md
                      "
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--text-inverse)",
                      }}
                      onClick={() => onDeposit(acc.account_number)}
                    >
                      Dépôt
                    </button>

                    {/* ⭐︎ Bouton Virement */}
                    <button
                      className="
                        px-4 py-2 rounded-md font-medium text-sm
                        transition-all duration-300 cursor-pointer
                        hover:scale-105 hover:brightness-110 hover:shadow-md
                      "
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--text-inverse)",
                      }}
                      onClick={() => onTransfer && onTransfer(acc.account_number)}
                    >
                      Virement
                    </button>

                    {/* ⭐︎ Bouton Historique */}
                    <button
                      className="
                        px-4 py-2 rounded-md font-medium text-sm
                        transition-all duration-300 cursor-pointer
                        hover:scale-105 hover:brightness-110 hover:shadow-md
                      "
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--text-inverse)",
                      }}
                    >
                      Historique
                    </button>

                  </div>


                  {/* Infos création */}
                  <div className="flex justify-between items-center">
                    <span>
                      <strong style={{ color: "var(--text)" }}>Création :</strong>{" "}
                      {parseDate(acc.created_at)}
                    </span>
                  </div>

                  {/* Transactions */}
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
