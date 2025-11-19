export const handleApiError = (error) => {
  // Erreur réseau
  if (error.message === "Failed to fetch") {
    return "Le serveur est momentanément indisponible.";
  }

  // FastAPI : error.detail string
  if (typeof error.detail === "string") {
    return "Impossible de traiter votre demande.";
  }

  // FastAPI : error.detail array
  if (Array.isArray(error.detail)) {
    return "Certains champs sont invalides.";
  }

  // 401 / non autorisé
  if (error.status === 401) {
    return "Identifiants incorrects.";
  }

  // Cas par défaut
  return "Une erreur est survenue. Veuillez réessayer.";
};
