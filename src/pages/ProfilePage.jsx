import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Profil</h1>

        <div className="flex flex-col gap-4">
          <div>
            <strong>ID : </strong> {user.id || "N/A"}
          </div>
          <div>
            <strong>Email : </strong> {user.email || "N/A"}
          </div>
          {user.primary_account_number && (
            <div>
              <strong>Compte principal : </strong> {user.primary_account_number}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full p-3 rounded-md font-bold text-lg bg-red-500 text-white hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
