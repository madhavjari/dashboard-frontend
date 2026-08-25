import { Navigate, Outlet } from "react-router";
import useAuth from "../../config/useAuth";

export default function GuestRoute() {
  const { accessToken, accounts, accountAccessStatus, isAuthenticating } =
    useAuth();

  if (isAuthenticating || accountAccessStatus === "loading") return null;

  const destination = accounts.some((account) => account.sync?.configured)
    ? "/dashboard-summary"
    : "/sync-setup";

  return accessToken ? (
    <Navigate to={destination} replace />
  ) : (
    <Outlet />
  );
}
