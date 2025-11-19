import { useState, useEffect } from "react";
import { getUserInfo, getUserAccounts } from "../api/accountService";

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

  useEffect(() => {
    // Fonction pour charger toutes les données nécessaires
    const fetchDashboardData = async () => {
      // Si pas de token, on ne fait rien
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Appels API en parallèle pour plus de performance
        const [userResponse, accountsResponse] = await Promise.all([
          getUserInfo(token),
          getUserAccounts(token),
        ]);

        // Mise à jour des états avec les données reçues
        setUser(userResponse);
        setAccounts(accountsResponse);
      } catch (err) {
        // Gestion d'erreur simple
        setError(err.message);
      } finally {
        // Toujours arrêter le loading, succès ou échec
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]); // Se déclenche quand le token change

  // Retourne tout ce dont le composant a besoin
  return { user, accounts, loading, error };
};
