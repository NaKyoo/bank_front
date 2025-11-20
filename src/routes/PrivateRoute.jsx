import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <Spinner />;
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default React.memo(PrivateRoute);
