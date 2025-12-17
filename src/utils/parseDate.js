// src/utils/parseDate.js

/**
 * Convertit une chaîne de date MySQL/Postgres (YYYY-MM-DD HH:MM:SS.ssssss)
 * en une date lisible au format JJ/MM/AAAA.
 * @param {string} dateStr - La date à parser
 * @returns {string} - Date formatée ou '—' si invalide
 */
export const parseDate = (dateStr) => {
  if (!dateStr) return "—";

  // Supprimer les microsecondes après les 3 premiers chiffres (millisecondes)
  // et remplacer l'espace par 'T'
  const cleaned = dateStr.replace(/\.(\d{3})\d*/, '.$1').replace(" ", "T");

  const date = new Date(cleaned);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
