import { useState, useEffect } from "react";
import { AuthContext } from "./config/AuthContext";
import checkUser from "./config/checkUser";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
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
    async function refresh() {
      try {
        const response = await fetch("http://localhost:5000/api/auth/refresh", {
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
        <div>
          <div></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
