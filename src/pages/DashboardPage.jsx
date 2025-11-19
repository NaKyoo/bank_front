import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import "../styles/Dashboard.css";

/**
 * Page principale du Dashboard
 * Responsabilité unique : afficher les données du dashboard
 * 
 * Affiche :
 * - Informations utilisateur (nom, email)
 * - Liste des comptes (ID, type, solde)
 * - Liens vers détails compte, nouveau compte, historique
 */
const DashboardPage = () => {
  // Récupération du user depuis le contexte d'authentification
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Chargement des données via le hook custom
  // authUser?.token = récupère le token s'il existe
  const { user, accounts, loading, error } = useDashboard(authUser?.token);

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="dashboard-container">
        <p className="loading-message">Chargement de vos données...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">Erreur : {error}</p>
      </div>
    );
  }

  // Affichage principal du dashboard
  return (
    <div className="dashboard-container">
      {/* En-tête avec informations utilisateur */}
      <header className="dashboard-header">
        <h1>Mon Dashboard</h1>
        {user && (
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
            <button onClick={handleLogout} className="logout-button">
              🚪 Déconnexion
            </button>
          </div>
        )}
      </header>

      {/* Section des comptes bancaires */}
      <section className="accounts-section">
        <div className="section-header">
          <h2>Mes Comptes</h2>
          <Link to="/accounts/new" className="btn btn-primary">
            + Ouvrir un nouveau compte
          </Link>
        </div>

        {/* Liste des comptes */}
        {accounts && accounts.length > 0 ? (
          <div className="accounts-list">
            {accounts.map((account) => (
              <div key={account.account_number} className="account-card">
                {/* Informations du compte */}
                <div className="account-info">
                  <h3 className="account-type">{account.account_type}</h3>
                  <p className="account-id">N° {account.account_number}</p>
                  <p className="account-balance">
                    {/* Formatage du solde en euros */}
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(account.balance)}
                  </p>
                </div>

                {/* Actions possibles sur le compte */}
                <div className="account-actions">
                  <Link
                    to={`/accounts/${account.account_number}`}
                    className="btn btn-secondary"
                  >
                    Voir détails
                  </Link>
                  <Link
                    to={`/accounts/${account.account_number}/history`}
                    className="btn btn-secondary"
                  >
                    Historique
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Message si aucun compte
          <div className="no-accounts">
            <p>Vous n'avez pas encore de compte bancaire.</p>
            <Link to="/accounts/new" className="btn btn-primary">
              Ouvrir votre premier compte
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
