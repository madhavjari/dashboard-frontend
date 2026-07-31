import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./config/AuthContext";
import checkUser from "./config/checkUser";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const hasRefreshedSession = useRef(false);
  const updateAccessToken = (token) => {
    setAccessToken(token);
    if (token) {
      const decodedUser = checkUser(token);
      setUserId(decodedUser);
    } else {
      setUserId(null);
    }
  };
  useEffect(() => {
    // React Strict Mode intentionally runs effects twice in development.
    // Refresh tokens rotate after one use, so only one initial request is valid.
    if (hasRefreshedSession.current) return;
    hasRefreshedSession.current = true;

    async function refresh() {
      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticating(false);
          return;
        }

        const data = await response.json();
        updateAccessToken(data.accessToken);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAuthenticating(false);
      }
    }

    refresh();
  }, []);
  return (
    <AuthContext.Provider
      value={{ accessToken, userId, updateAccessToken, isAuthenticating }}
    >
      {isAuthenticating ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
          Checking your session...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
