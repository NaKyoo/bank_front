import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { AuthProvider } from "../context/AuthContext";

import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/DashBoardPage";
import ProfilePage from "../pages/ProfilePage";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Spinner from "../components/Spinner";

import DepositForm from "../components/DepositForm.jsx"; // modifier 
import TransactionDetailsPage from "../pages/TransactionDetailsPage.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

const RouterContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Spinner show={loading} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pages publiques */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Pages privées */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

         {/* Page de dépôt d'argent */}
        <Route
          path="/deposit"
          element={
            <PrivateRoute> 
              <DepositForm />
            </PrivateRoute> 
        }
        /> 

        {/* Page de détails de transaction */}
        <Route
          path="/transactions/:userAccountNumber/:transactionId"
          element={
            <PrivateRoute>
              <TransactionDetailsPage/>
            </PrivateRoute>
          }
          />
      </Routes>
    </>
  );
};

export default AppRouter;
