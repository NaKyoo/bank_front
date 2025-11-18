import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import { AuthProvider } from "../context/AuthContext";

const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SignupPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRouter;
