import { useState } from "react";
import SignUpForm from "../components/SignUpForm";
import { signupRequest } from "../api/authService";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (values) => {
  try {
    setApiError(null);
    await signupRequest(values);
    navigate("/login");
  } catch (err) {
    setApiError(handleApiError(err));
  }
};

  return <SignUpForm onSubmit={handleSignup} apiError={apiError} />;
};

export default SignupPage;
