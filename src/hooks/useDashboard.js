import { useState, useEffect } from "react";
import { getUserInfo, getUserAccounts } from "../api/accountService";
import { useAuth } from "../context/AuthContext";

/**
 * Hook custom pour gérer la logique du dashboard
 * Responsabilité unique : gérer l'état et charger les données
 * 
 * @param {string} token - Le token JWT de l'utilisateur connecté
 * @returns {Object} État du dashboard (user, accounts, loading, error)
 */
export const useDashboard = (token) => {
  // États séparés pour chaque donnée - principe KISS
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  // allow manual refetch by exposing `refetch` function
  const fetchDashboardData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [userResponse, accountsResponse] = await Promise.all([
        getUserInfo(token),
        getUserAccounts(token),
      ]);

      setUser(userResponse);
      setAccounts(accountsResponse);
    } catch (err) {
      // If the backend returned 401 / unauthorized, log the user out and set a friendly message
      if (err && err.code === "UNAUTHORIZED") {
        try {
          logout();
        } catch {
          // ignore
        }
        setError("Token expiré. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Retourne tout ce dont le composant a besoin et une fonction pour recharger
  return { user, accounts, loading, error, refetch: fetchDashboardData };
};
