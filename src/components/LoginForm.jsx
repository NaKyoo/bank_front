import { useLoginForm } from "../hooks/useLoginForm";
import "../styles/Auth.css";

/**
 * Composant formulaire de connexion
 * Responsabilité : afficher les champs et gérer la soumission
 */
const LoginForm = ({ onSuccess }) => {
  const { formData, loading, error, handleChange, handleSubmit } =
    useLoginForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="email" className="auth-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="auth-input"
          placeholder="jean.dupont@test.com"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="auth-label">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="auth-input"
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
};

export default LoginForm;
