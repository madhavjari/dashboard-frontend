import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useOutletContext } from "react-router";
import DashboardSidebar from "./components/businessSummary/DashboardSidebar";

export default function DashboardLayout() {
  const auth = useOutletContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`min-h-screen bg-slate-100 lg:grid lg:transition-[grid-template-columns] lg:duration-200 lg:ease-out ${
        isSidebarOpen
          ? "lg:grid-cols-[16rem_minmax(0,1fr)]"
          : "lg:grid-cols-[0_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            isSidebarOpen
              ? "grid-rows-[0fr] lg:grid-rows-[1fr]"
              : "grid-rows-[1fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex h-14 items-center px-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((open) => !open)}
                className={`rounded-lg bg-slate-950 p-2 text-slate-200 transition-opacity hover:bg-slate-800 hover:text-white ${
                  isSidebarOpen
                    ? "pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100"
                    : "opacity-100"
                }`}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
        <Outlet context={auth} />
      </div>
    </div>
  );
}
