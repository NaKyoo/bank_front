import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAccounts } from "../hooks/useAccounts";
import AccountsList from "../components/AccountsList";
import Header from "../components/Header";
import DownloadPdf from "../components/DownloadPdf";
import TransferModal from "../components/modal/TransferModal";
import Notification from "../components/Notification";
import BeneficiariesModal from "../components/modal/BeneficiariesModal";
import "../styles/beneficiaries.css";

import OpenAccountModal from "../components/modal/OpenAccountModal";
import Modal from "../components/modal/Modal";

const ProfilePage = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferSource, setTransferSource] = useState(null);
  const [notification, setNotification] = useState(null);
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);
  const [beneficiariesOpen, setBeneficiariesOpen] = useState(false);

  const {
    accounts,
    loading,
    error,
    openAccount,
    refresh,
    applyTransfer,
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
          className="w-full max-w-3xl p-8 rounded-lg shadow-lg transition-all"
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
                onClick={() => setBeneficiariesOpen(true)}
                className={
                  `
                  px-4 py-2 rounded-md font-semibold
                  transition-all duration-300
                  hover:scale-105 hover:brightness-110 hover:shadow-md
                ` + ' beneficiaries-open-btn'
                }
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
              onViewDetails={setSelectedAccount}
              refreshKey={transactionsRefreshKey}
              onDelete={async (accNum) => {
                await deleteAccount(accNum);
                await refresh();
                setTransactionsRefreshKey((prev) => prev + 1);
              }}
              onTransfer={(accNum) => {
                setTransferSource(accNum);
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

        {/* Modal Bénéficiaires */}
        {beneficiariesOpen && (
          <BeneficiariesModal
            isOpen={beneficiariesOpen}
            onClose={() => setBeneficiariesOpen(false)}
            ownerAccountNumber={parentAccountNumber}
          />
        )}
      
          {transferOpen && (
        <TransferModal
          accounts={accounts}
          defaultFrom={transferSource}
          onClose={() => { setTransferOpen(false); setTransferSource(null); }}
          onSuccess={async ({ from_account, to_account, amount, result }) => {
            // Apply optimistic update immediately
            applyTransfer({ from_account, to_account, amount });
            
            // Bump transactions key to trigger re-fetch
            setTransactionsRefreshKey((prev) => prev + 1);

            // Refresh accounts from backend to sync real balances
            await refresh();
            
            // Show notification
            try {
              const msg = (result && (result.message || result.note)) || "Virement effectué";
              const bg = (result && result._ui && result._ui.bg) || 'var(--primary)';
              const color = (result && result._ui && result._ui.color) || 'var(--text-inverse)';
              setNotification({ message: msg, bgColor: bg, textColor: color, duration: 4000 });
            } catch (e) { console.debug('notify error', e); }
          }}
          token={token}
        />
      )}

          {notification && (
            <Notification
              message={notification.message}
              bgColor={notification.bgColor}
              textColor={notification.textColor}
              duration={notification.duration}
              onClose={() => setNotification(null)}
            />
          )}
      </div>
    </div>
  );
};

export default ProfilePage;
