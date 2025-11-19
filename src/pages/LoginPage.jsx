import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/authService";
import LoginForm from "../components/LoginForm";
import { handleApiError } from "../utils/handleApiError";

const LoginPage = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    try {
      setApiError(null);
      const data = await loginRequest(values);

      console.log("Login backend :", data);

      const user = {
        id: data.user_id,
        email: data.email,
      };

      login({ user, token: data.access_token });
      navigate("/dashboard");
    } catch (err) {
      setApiError(handleApiError(err));
    }
  };

  return <LoginForm onSubmit={handleLogin} apiError={apiError} />;
};

export default LoginPage;