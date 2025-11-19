import React from "react";
import PropTypes from "prop-types";
import { useLoginForm } from "../hooks/useLoginForm";

const LoginForm = ({ onSubmit, apiError }) => {
  const { values, handleChange } = useLoginForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: "var(--background)" }}>
      <div
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{
          backgroundColor: "var(--surface)",
          boxShadow: "var(--shadow)",
          borderRadius: "var(--radius-lg)"
        }}
      >
        <h1
          className="text-center text-3xl font-bold mb-6"
          style={{ color: "var(--primary)" }}
        >
          Connexion
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label style={{ color: "var(--text-muted)", marginBottom: "var(--space-xs)" }}>Email</label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              required
              className="p-3 rounded-md"
              style={{
                backgroundColor: "var(--surface-light)",
                color: "var(--text)",
                border: `1px solid var(--border)`
              }}
            />
          </div>

          <div className="flex flex-col">
            <label style={{ color: "var(--text-muted)", marginBottom: "var(--space-xs)" }}>Mot de passe</label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              required
              className="p-3 rounded-md"
              style={{
                backgroundColor: "var(--surface-light)",
                color: "var(--text)",
                border: `1px solid var(--border)`
              }}
            />
          </div>

          {apiError && (
            <p
              className="text-center mt-2"
              style={{ color: "var(--error)" }}
            >
              {apiError}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 p-3 rounded-md font-bold text-lg"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--text-inverse)",
              cursor: "pointer"
            }}
          >
            Se connecter
          </button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/signup"
            style={{ color: "var(--primary-light)", textDecoration: "underline" }}
          >
            Pas encore de compte ? S'inscrire
          </a>
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  apiError: PropTypes.string,
};

export default React.memo(LoginForm);