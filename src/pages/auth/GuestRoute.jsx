import { Navigate, Outlet } from "react-router";
import useAuth from "../../config/useAuth";

export default function GuestRoute() {
  const { accessToken, isAuthenticating } = useAuth();

  if (isAuthenticating) return null;

  return accessToken ? (
    <Navigate to="/dashboard-summary" replace />
  ) : (
    <Outlet />
  );
}
