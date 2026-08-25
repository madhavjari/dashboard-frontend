import { useCallback, useState, useEffect, useRef } from "react";
import { AuthContext } from "./config/AuthContext";
import checkUser from "./config/checkUser";
import { AUTH_BASE_URL } from "./config/reportUrls";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountAccessStatus, setAccountAccessStatus] = useState("idle");
  const [accountAccessError, setAccountAccessError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const hasRefreshedSession = useRef(false);

  const updateAccessToken = useCallback((token, accountAccess = null) => {
    setAccessToken(token);
    if (token) {
      const decodedUser = checkUser(token);
      setUserId(decodedUser);

      if (accountAccess) {
        setUser(accountAccess.user ?? null);
        setAccounts(accountAccess.accounts ?? []);
        setAccountAccessStatus("ready");
        setAccountAccessError(null);
      }
    } else {
      setUserId(null);
      setUser(null);
      setAccounts([]);
      setAccountAccessStatus("idle");
      setAccountAccessError(null);
    }
  }, []);

  const refreshAccountAccess = useCallback(async (token = accessToken) => {
    if (!token) return null;

    setAccountAccessStatus("loading");
    setAccountAccessError(null);

    try {
      const response = await fetch(`${AUTH_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load account setup");
      }

      setUser(data.user ?? null);
      setAccounts(data.accounts ?? []);
      setAccountAccessStatus("ready");
      return data;
    } catch (error) {
      setAccountAccessStatus("error");
      setAccountAccessError(error.message);
      throw error;
    }
  }, [accessToken]);

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
        await refreshAccountAccess(data.accessToken);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAuthenticating(false);
      }
    }

    refresh();
  }, [refreshAccountAccess, updateAccessToken]);
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userId,
        user,
        accounts,
        accountAccessStatus,
        accountAccessError,
        updateAccessToken,
        refreshAccountAccess,
        isAuthenticating,
      }}
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
