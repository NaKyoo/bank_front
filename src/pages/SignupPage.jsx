import React, { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { signupRequest } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (values) => {
    try {
      setApiError(null);
      const data = await signupRequest(values);
      login(data.user);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message);
    }
  };

  return <SignUpForm onSubmit={handleSignup} apiError={apiError} />;
};

export default SignupPage;
