import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/authService";
import LoginForm from "../components/LoginForm";
import { handleApiError } from "../utils/handleApiError";
import "../styles/Auth.css";

const LoginPage = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    try {
      setApiError(null);
      const data = await loginRequest(values);

      // Delegate shape handling to AuthContext.login which accepts multiple shapes
      login(data);
      navigate("/profile");
    } catch (err) {
      setApiError(handleApiError(err));
    }
  };

  return <LoginForm onSubmit={handleLogin} apiError={apiError} />;
};

export default LoginPage;
