import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import "../styles/Auth.css";

/**
 * Page de connexion
 * Responsabilité : afficher le formulaire et gérer la redirection
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Appelé quand le login réussit
  const handleLoginSuccess = (response) => {
    // Stocke l'utilisateur + token dans le contexte
    login({
      ...response.user,
      token: response.access_token,
    });

    // Redirige vers le dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">
            Accédez à votre espace bancaire
          </p>
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="auth-footer">
          <p className="auth-text">
            Pas encore de compte ?{" "}
            <Link to="/" className="auth-link">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
