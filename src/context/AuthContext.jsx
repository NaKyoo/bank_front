import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch (e) {
      console.warn("AuthContext: failed to read from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (payload, { remember = true } = {}) => {
    // Accept different payload shapes:
    // - { user, token }
    // - { user, access_token }
    // - backend user object (no token)
    // - payload contains token at .token or .access_token
    let nextUser = null;
    let nextToken = null;

    if (!payload) return;

    if (payload.user) {
      nextUser = payload.user;
      nextToken = payload.token || payload.access_token || payload.accessToken || null;
    } else {
      // payload may itself be the user object or contain token directly
      nextUser = payload;
      nextToken = payload.token || payload.access_token || payload.accessToken || null;
    }

    setUser(nextUser || null);
    setToken(nextToken || null);

    try {
      if (remember) {
        if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
        if (nextToken) localStorage.setItem("token", nextToken);
      }
    } catch (e) {
      console.warn("AuthContext: failed to persist auth", e);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
