import { Navigate, Outlet } from "react-router";
import useAuth from "../../config/useAuth";

export default function SyncConfiguredRoute() {
  const { accounts, accountAccessStatus } = useAuth();

  if (
    accountAccessStatus === "idle" ||
    accountAccessStatus === "loading"
  ) {
    return null;
  }

  const hasConfiguredAccount = accounts.some(
    (account) => account.sync?.configured,
  );

  return hasConfiguredAccount ? (
    <Outlet />
  ) : (
    <Navigate to="/sync-setup" replace />
  );
}
