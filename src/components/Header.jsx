import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Header = ({ pageTitle, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-4 shadow-md"
      style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow)" }}
    >
      {/* Bank à gauche */}
      <div
        onClick={() => navigate("/profile")}
        className="text-xl font-bold cursor-pointer hover:text-var(--primary-light) transition-colors"
        style={{ color: "var(--primary)" }}
      >
        Bank
      </div>

      {/* Titre de la page au centre */}
      <div className="text-lg font-semibold text-center" style={{ color: "var(--text)" }}>
        {pageTitle}
      </div>

      {/* Menu carré à droite */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="relative flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-all duration-500"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-light), var(--primary-dark))",
            backgroundSize: "200% 200%",
            color: "var(--text-inverse)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundPosition = "100% 0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundPosition = "0 0";
          }}
        >
          {/* Icône menu classique (3 points verticaux) */}
          <svg
            className="w-6 h-6 relative"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden transition-all"
            style={{ backgroundColor: "var(--surface-light)" }}
          >
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-var(--primary-light) transition-colors cursor-pointer"
              style={{ color: "var(--text)" }}
            >
              Se déconnecter
            </button>
            {/* Ajouter d’autres éléments ici */}
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
