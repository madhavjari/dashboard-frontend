import { useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import { Outlet, useOutletContext } from "react-router";
import DashboardSidebar from "./components/businessSummary/DashboardSidebar";

export default function DashboardLayout() {
  const auth = useOutletContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
      />
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-20 rounded-lg bg-slate-950 p-2 text-slate-200 shadow-lg transition hover:bg-slate-800 hover:text-white"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}
      <div className={`min-w-0 flex-1 ${isSidebarOpen ? "" : "pt-14"}`}>
        <Outlet context={auth} />
      </div>
    </div>
  );
}
