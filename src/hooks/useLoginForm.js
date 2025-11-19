import { useState } from "react";
import { loginRequest } from "../api/authService";

/**
 * Hook custom pour gérer le formulaire de login
 * Responsabilité : gérer l'état du form et la soumission
 */
export const useLoginForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Met à jour un champ du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Efface l'erreur quand l'utilisateur tape
    if (error) setError(null);
  };

  // Soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Appel API pour se connecter
      const response = await loginRequest(formData);
      
      // Succès : callback avec les données
      onSuccess(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
};
