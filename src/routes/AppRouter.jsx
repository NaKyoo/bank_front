import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import { AuthProvider } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";

const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          /> */}
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);


export default AppRouter;
