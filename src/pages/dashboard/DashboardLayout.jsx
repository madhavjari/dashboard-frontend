import { Outlet } from "react-router";
import DashboardSidebar from "./components/businessSummary/DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
