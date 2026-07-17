import { Link, useNavigate } from "react-router";
import useAuth from "./config/useAuth";

export default function Navbar() {
  const { updateAccessToken, userId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Invalid request");
      }

      alert("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      updateAccessToken(null);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 transition hover:text-blue-600"
        >
          SaaS App
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {userId ? (
            <>
              {/* Future links can be added here */}

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
