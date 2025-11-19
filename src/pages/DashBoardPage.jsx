import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-6">
      <h1 className="text-4xl font-bold text-gray-800">
        Hello World
      </h1>

      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
