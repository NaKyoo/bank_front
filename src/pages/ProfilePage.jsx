import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAccounts } from "../hooks/useAccounts";
import AccountsList from "../components/AccountsList";
import Header from "../components/Header";
import DownloadPdf from "../components/DownloadPdf";

import OpenAccountModal from "../components/modal/OpenAccountModal";
import DepositModal from "../components/modal/DepositModal";
import Modal from "../components/modal/Modal";
import DepositModal from "../components/modal/DepositModal";
import TransferModal from "../components/modal/TransferModal";
import BeneficiariesModal from "../components/modal/BeneficiariesModal";


const ProfilePage = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferSource, setTransferSource] = useState(null);
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferModalKey, setTransferModalKey] = useState(0);
  const [beneficiariesOpen, setBeneficiariesOpen] = useState(false);
  const [beneficiariesStartAdding, setBeneficiariesStartAdding] = useState(false);
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    accounts,
    loading,
    error,
    openAccount,
    applyTransfer,
    refresh,
    deleteAccount,
  } = useAccounts();

  const parentAccountNumber =
    selectedAccount?.account_number ||
    accounts.find((acc) => acc.parent_account_number === null)?.account_number;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeModal = () => {
    setSelectedAccount(null);
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Header pageTitle="Profil" onLogout={logout} />

      <div className="flex items-center justify-center p-6">
        <div
          className="w-full max-w-5xl p-10 rounded-2xl shadow-lg transition-all"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Header comptes */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              Mes comptes
            </h2>

            <div className="flex gap-2">
              {/* Bouton Télécharger le relevé */}
              <DownloadPdf />

              {/* Bouton Bénéficiaires */}
              <button
                onClick={() => openBeneficiariesModal(false)}
                className="
                  px-4 py-2 rounded-md font-semibold
                  transition-all duration-300
                  hover:scale-105 hover:brightness-110 hover:shadow-md
                "
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--text-inverse)",
                  cursor: "pointer",
                }}
              >
                Bénéficiaires
              </button>

              {/* BTN Ouvrir un compte */}
              <button
                onClick={() => setOpenModal(true)}
                className="
                  px-4 py-2 rounded-md font-semibold
                  transition-all duration-300
                  hover:scale-105 hover:brightness-110 hover:shadow-md
                "
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--text-inverse)",
                  cursor: "pointer",
                }}
              >
                Ouvrir un compte
              </button>
            </div>
          </div>


          {/* Accounts */}
          {loading && <p style={{ color: "var(--text)" }}>Chargement...</p>}
          {error && <p style={{ color: "var(--error)" }}>{error}</p>}

          {!loading && !error && accounts.length > 0 && (
            <AccountsList
              accounts={accounts}
              refreshKey={transactionsRefreshKey}
              onDelete={async (accNum) => {
                await deleteAccount(accNum);
                await refresh();
                setTransactionsRefreshKey((prev) => prev + 1);
              }}
              onDeposit={openDepositModal} // pour le deposit dans profilPage
              onTransfer={(accNum) => {
                setTransferSource(accNum);
                setTransferRecipient("");
                setTransferModalKey((prev) => prev + 1);
                setTransferOpen(true);
              }}
            />
          )}

          {!loading && !error && accounts.length === 0 && (
            <p style={{ color: "var(--text)" }}>Aucun compte trouvé.</p>
          )}

          {/* Bouton Logout */}
          <button
            onClick={handleLogout}
            className="
              mt-6 w-full p-3 rounded-md font-bold text-lg
              transition-all duration-300
              hover:scale-105 hover:brightness-110 hover:shadow-md
            "
            style={{
              backgroundColor: "var(--error)",
              color: "var(--text-inverse)",
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>
        </div>

        {/* Modal Ouvrir un compte */}
        <Modal isOpen={openModal} onClose={closeModal}>
          <OpenAccountModal
            parentAccountNumber={parentAccountNumber}
            onClose={closeModal}
            openAccount={openAccount}
            refresh={refresh}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
