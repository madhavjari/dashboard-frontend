import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./config/AuthContext";
import checkUser from "./config/checkUser";
import { AUTH_BASE_URL } from "./config/reportUrls";

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
        const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-100 px-4 text-center text-sm font-medium text-slate-600">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p>Checking your session...</p>
          <p className="max-w-sm font-normal text-slate-500">
            The server may take up to a minute to wake on the free Render plan.
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
