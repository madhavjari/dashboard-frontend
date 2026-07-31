import { Outlet } from "react-router";
import Navbar from "./Navbar";
import useAuth from "./config/useAuth";

function App() {
  const { accessToken, userId, updateAccessToken } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-900">
      <Navbar
        accessToken={accessToken}
        userId={userId}
        updateAccessToken={updateAccessToken}
      />
      <Outlet context={{ accessToken, userId }} />
    </div>
  );
}

export default App;
