import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../config/useAuth";

export default function ProtectedRoute() {
  const { accessToken, userId, isAuthenticating } = useAuth();
  const location = useLocation();

  if (isAuthenticating) return null;

  return accessToken ? (
    <Outlet context={{ accessToken, userId }} />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
