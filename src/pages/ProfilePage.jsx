import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAccounts } from "../hooks/useAccounts";
import AccountsList from "../components/AccountsList";
import Header from "../components/Header";
import DetailsModal from "../components/modal/DetailsModal";
import Modal from "../components/modal/Modal";

const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { accounts, loading, error } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeModal = () => setSelectedAccount(null);

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <Header pageTitle="Profil" onLogout={logout} />

      {/* Contenu principal */}
      <div className="flex items-center justify-center p-6">
        <div
          className="w-full max-w-3xl p-8 rounded-lg shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Section Mes comptes */}
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--primary)" }}
          >
            Mes comptes
          </h2>

          {loading && <p style={{ color: "var(--text)" }}>Chargement...</p>}
          {error && <p style={{ color: "var(--error)" }}>{error}</p>}
          {!loading && !error && accounts.length > 0 && (
            <AccountsList accounts={accounts} onViewDetails={setSelectedAccount} />
          )}
          {!loading && !error && accounts.length === 0 && (
            <p style={{ color: "var(--text)" }}>Aucun compte trouvé.</p>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full p-3 rounded-md font-bold text-lg transition duration-300 hover:brightness-110 hover:scale-105"
            style={{
              backgroundColor: "var(--error)",
              color: "var(--text-inverse)",
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>
        </div>

        <Modal isOpen={!!selectedAccount} onClose={closeModal}>
          <DetailsModal account={selectedAccount}/>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
