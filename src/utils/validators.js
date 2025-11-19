
export const validators = {
  name(value) {
    if (!value) return "Le nom est requis.";
    if (value.trim().length < 2) return "Le nom est trop court.";
    return null;
  },
  email(value) {
    if (!value) return "L'email est requis.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Email invalide.";
    return null;
  },

  password(value) {
  if (!value) return "Le mot de passe est requis.";

  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

  if (!regex.test(value))
    return "Le mot de passe doit contenir 1 majuscule, 1 chiffre, 1 caractère spécial et au moins 6 caractères.";

  return null;
}

};