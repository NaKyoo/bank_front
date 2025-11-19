import { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { signupRequest } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { handleApiError } from "../utils/handleApiError";

const SignupPage = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (values) => {
    try {
      setApiError(null);
      const data = await signupRequest(values);
      login({ user: data });
      navigate("/login");
    } catch (err) {
      setApiError(handleApiError(err));
    }
  };

  return <SignUpForm onSubmit={handleSignup} apiError={apiError} />;
};

export default SignupPage;
