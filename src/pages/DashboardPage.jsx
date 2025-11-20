import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import "../styles/Dashboard.css";
import { useState } from 'react';
import TransferModal from '../components/modal/TransferModal';
import AccountCard from '../components/AccountCard';

const Dashboard = () => {
  const { user: authUser, logout } = useAuth();
  const token = authUser?.token || authUser?.access_token || authUser?.tokenString || null;
  const { user, accounts, loading, error, refetch } = useDashboard(token);
  const navigate = useNavigate();
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferSource, setTransferSource] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="app-topbar">
        <div className="app-brand">MaBanque</div>
        <div className="app-nav">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/profile" className="nav-link">Profil</a>
          <button className="nav-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      </nav>
      <header className="dashboard-header">
        <h1>Bienvenue, {user?.name || user?.email || authUser?.email || "client"}</h1>

        <div className="user-info">
          <div className="user-name">{user?.name || authUser?.name || authUser?.email}</div>
          <div className="user-email">{user?.email || authUser?.email}</div>
          <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <section className="accounts-section">
        <div className="section-header">
          <h2>Mes comptes</h2>
          <div>
            <Link to="/accounts/new" className="fab-open-account">Ouvrir un compte</Link>
          </div>
        </div>

        {loading && <div className="loading-message">Chargement des comptes…</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="accounts-list">
            {(() => {
              // Accept either an array or an object like { value: [...] }
              const list = Array.isArray(accounts) ? accounts : (accounts && accounts.value ? accounts.value : []);
              if (!list || list.length === 0) {
                return (
                  <div className="no-accounts">
                    <p>Aucun compte trouvé. Ouvrez un nouveau compte pour commencer.</p>
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                      <Link to="/accounts/new" className="fab-open-account">Ouvrir un compte</Link>
                    </div>
                  </div>
                );
              }

              return list.map((acct) => {
                const id = acct.account_number || acct.id || acct.accountId || acct.primary_account_number;
                return (
                  <AccountCard
                    key={id}
                    acct={acct}
                    onDetails={(acc) => navigate(`/accounts/${acc}`)}
                    onHistory={(acc) => navigate(`/accounts/${acc}/history`)}
                    onTransfer={(acc) => { setTransferSource(acc); setTransferOpen(true); }}
                  />
                );
              });
            })()}
          </div>
        )}
      </section>
      {transferOpen && (
        <TransferModal
          accounts={accounts}
          defaultFrom={transferSource}
          onClose={() => setTransferOpen(false)}
          onSuccess={() => refetch()}
          token={token}
        />
      )}
        {/* Floating action button to open transfer modal */}
        <button
          className="fab-transfer"
          onClick={() => { setTransferSource(null); setTransferOpen(true); }}
          aria-label="Faire un virement"
        >
          Virement
        </button>
    </div>
  );
};

export default Dashboard;
