import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to restore saved user (and token) from localStorage on init
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("bank_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("Failed to parse stored user", e);
      return null;
    }
  });

  // persist user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("bank_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("bank_user");
      }
    } catch (e) {
      console.warn("Failed to persist user to localStorage", e);
    }
  }, [user]);

  const login = (userData, { remember = true } = {}) => {
    // store user in state; persisted by effect above
    // `remember` could be used to decide between localStorage/sessionStorage
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // localStorage cleaned by effect, but ensure immediate removal
    try { localStorage.removeItem("bank_user"); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
