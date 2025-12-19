// En développement (npm run dev), Vite utilise le proxy défini dans vite.config.js
// En production, on veut souvent utiliser une URL relative pour passer par le même Nginx
// ou une URL spécifique définie dans les variables d'environnement.
export const API_URL = import.meta.env.VITE_API_URL || "/api";