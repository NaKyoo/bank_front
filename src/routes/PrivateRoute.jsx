import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Composant pour protéger les routes
 * Responsabilité : rediriger vers / si l'utilisateur n'est pas connecté
 * 
 * @param {Object} props - Les props du composant
 * @param {ReactNode} props.children - Le composant enfant à protéger
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Si pas d'utilisateur connecté, rediriger vers la page d'accueil
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Sinon, afficher le composant demandé
  return children;
};

export default PrivateRoute;
