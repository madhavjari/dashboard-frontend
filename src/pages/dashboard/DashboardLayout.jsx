import { useEffect, useState } from "react";
import { CalendarRange, Menu, RefreshCw } from "lucide-react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import { FINANCIAL_YEARS_URL } from "../../config/reportUrls";
import DashboardSidebar from "./components/businessSummary/DashboardSidebar";

const DEFAULT_FINANCIAL_YEAR = "2025-2026";

export default function DashboardLayout() {
  const auth = useOutletContext();
  const { pathname } = useLocation();
  const isDemo = pathname === "/demo" || pathname.startsWith("/demo/");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [financialYears, setFinancialYears] = useState([]);
  const [financialYear, setFinancialYear] = useState(null);
  const [financialYearStatus, setFinancialYearStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadFinancialYears() {
      try {
        setFinancialYearStatus("loading");
        const response = await fetch(FINANCIAL_YEARS_URL, {
          headers: auth?.accessToken
            ? { Authorization: `Bearer ${auth.accessToken}` }
            : {},
        });
        if (!response.ok) {
          throw new Error("Unable to load financial years");
        }

        const payload = await response.json();
        const availableYears = Array.isArray(payload.data) ? payload.data : [];
        if (cancelled) return;

        setFinancialYears(availableYears);
        setFinancialYear((selectedYear) =>
          availableYears.includes(selectedYear)
            ? selectedYear
            : availableYears.at(-1) || DEFAULT_FINANCIAL_YEAR,
        );
        setFinancialYearStatus("success");
      } catch {
        if (cancelled) return;
        setFinancialYear(DEFAULT_FINANCIAL_YEAR);
        setFinancialYearStatus("error");
      }
    }

    loadFinancialYears();
    return () => {
      cancelled = true;
    };
  }, [auth?.accessToken]);

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
        <div className="mx-4 mb-3 flex min-h-11 flex-wrap items-center gap-2 sm:mx-6 lg:mx-10">
          <div className="mr-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarRange size={18} className="text-teal-700" />
            Financial year
          </div>
          {financialYearStatus === "loading" && (
            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
              <RefreshCw size={15} className="animate-spin" /> Loading...
            </span>
          )}
          {financialYears.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setFinancialYear(year)}
              aria-pressed={financialYear === year}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                financialYear === year
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-800"
              }`}
            >
              {year}
            </button>
          ))}
          {financialYearStatus === "error" && (
            <span className="text-xs text-amber-700">
              Using {DEFAULT_FINANCIAL_YEAR}; year list is unavailable.
            </span>
          )}
        </div>
        {isDemo && (
          <div className="mx-4 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 sm:mx-6 lg:mx-10">
            <span>
              Demo workspace — all companies, invoices, and payments are synthetic.
            </span>
            <Link to="/register" className="font-semibold underline underline-offset-2">
              Create your workspace
            </Link>
          </div>
        )}
        {financialYearStatus !== "loading" && (
          <Outlet
            key={financialYear}
            context={{ ...(auth ?? {}), financialYear }}
          />
        )}
      </div>
    </div>
  );
}
