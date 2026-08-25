import { Navigate, Outlet, useOutletContext } from "react-router";
import useAuth from "../../config/useAuth";

export default function SyncConfiguredRoute() {
  const { accounts, accountAccessStatus } = useAuth();
  const auth = useOutletContext();

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
    <Outlet context={auth} />
  ) : (
    <Navigate to="/sync-setup" replace />
  );
}
