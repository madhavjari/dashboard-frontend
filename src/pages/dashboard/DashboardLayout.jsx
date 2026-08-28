import { useEffect, useState } from "react";
import { CalendarRange, Menu, RefreshCw } from "lucide-react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import CompanySelector from "../../components/dashboard/CompanySelector";
import WorkspaceSearch from "../../components/dashboard/WorkspaceSearch";
import {
  ACCOUNTING_COMPANIES_URL,
  FINANCIAL_YEARS_URL,
} from "../../config/reportUrls";
import { appendReportFilters } from "../../utils/fetch/reportUrl";
import DashboardSidebar from "./components/businessSummary/DashboardSidebar";

const DEFAULT_FINANCIAL_YEAR = "2025-2026";

export default function DashboardLayout() {
  const auth = useOutletContext();
  const { pathname } = useLocation();
  const isDemo = pathname === "/demo" || pathname.startsWith("/demo/");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 1024px)").matches,
  );
  const [financialYears, setFinancialYears] = useState([]);
  const [financialYear, setFinancialYear] = useState(null);
  const [financialYearStatus, setFinancialYearStatus] = useState("loading");
  const [accountingCompanies, setAccountingCompanies] = useState([]);
  const [selectedAccountingCompanyIds, setSelectedAccountingCompanyIds] =
    useState([]);
  const [companyStatus, setCompanyStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadAccountingCompanies() {
      try {
        setCompanyStatus("loading");
        const response = await fetch(ACCOUNTING_COMPANIES_URL, {
          headers: auth?.accessToken
            ? { Authorization: `Bearer ${auth.accessToken}` }
            : {},
        });
        if (!response.ok) {
          throw new Error("Unable to load accounting companies");
        }

        const payload = await response.json();
        const companies = Array.isArray(payload.data) ? payload.data : [];
        if (cancelled) return;

        setAccountingCompanies(companies);
        setSelectedAccountingCompanyIds(
          companies.map((company) => company.id),
        );
        setCompanyStatus("success");
      } catch {
        if (cancelled) return;
        setAccountingCompanies([]);
        setSelectedAccountingCompanyIds([]);
        setCompanyStatus("error");
      }
    }

    loadAccountingCompanies();
    return () => {
      cancelled = true;
    };
  }, [auth?.accessToken]);

  useEffect(() => {
    if (companyStatus === "loading") return undefined;
    if (
      companyStatus === "success" &&
      accountingCompanies.length > 0 &&
      selectedAccountingCompanyIds.length === 0
    ) {
      return undefined;
    }

    let cancelled = false;

    async function loadFinancialYears() {
      try {
        setFinancialYearStatus("loading");
        const url = appendReportFilters(
          FINANCIAL_YEARS_URL,
          null,
          selectedAccountingCompanyIds,
        );
        const response = await fetch(url, {
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
  }, [
    accountingCompanies.length,
    auth?.accessToken,
    companyStatus,
    selectedAccountingCompanyIds,
  ]);

  return (
    <div
      className={`min-h-screen bg-[#f4f7f6] lg:grid lg:transition-[grid-template-columns] lg:duration-200 lg:ease-out ${
        isSidebarOpen
          ? "lg:grid-cols-[16rem_minmax(0,1fr)]"
          : "lg:grid-cols-[4.5rem_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((open) => !open)}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu size={20} />
              </button>
              <WorkspaceSearch />
              <div className="ml-auto flex min-w-0 items-center gap-2">
          {companyStatus === "loading" ? (
            <span className="hidden items-center gap-2 text-sm text-slate-500 md:inline-flex" role="status">
              <RefreshCw size={15} className="animate-spin" /> Loading companies
            </span>
          ) : null}
          {accountingCompanies.length > 1 ? (
            <div className="hidden min-w-0 md:block">
              <CompanySelector
                companies={accountingCompanies}
                selectedCompanyIds={selectedAccountingCompanyIds}
                onChange={setSelectedAccountingCompanyIds}
              />
            </div>
          ) : null}
          {companyStatus === "error" ? (
            <span className="hidden text-xs text-amber-700 md:inline">
              Company list unavailable; showing all accessible data.
            </span>
          ) : null}

          <div className="flex items-center gap-2">
            {financialYearStatus === "loading" && (
              <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500" role="status">
                <RefreshCw size={15} className="animate-spin" /> <span className="hidden sm:inline">Loading year</span>
              </span>
            )}
            {financialYearStatus !== "loading" ? (
              <label className="relative flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-300">
                <CalendarRange size={17} className="shrink-0 text-teal-700" aria-hidden="true" />
                <span className="sr-only">Financial year</span>
                <select
                  value={financialYear ?? ""}
                  onChange={(event) => setFinancialYear(event.target.value)}
                  className="min-w-0 appearance-none bg-transparent pr-5 text-sm outline-none"
                  aria-label="Financial year"
                >
                  {(financialYears.length ? financialYears : [financialYear]).filter(Boolean).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 text-[10px] text-slate-400">▼</span>
              </label>
            ) : null}
            {financialYearStatus === "error" && (
              <span className="sr-only">Year list unavailable. Using {DEFAULT_FINANCIAL_YEAR}.</span>
            )}
          </div>
              </div>
          </div>
          {accountingCompanies.length > 1 ? (
            <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-2 md:hidden">
              <span className="text-xs font-semibold text-slate-500">Workspace</span>
              <CompanySelector
                companies={accountingCompanies}
                selectedCompanyIds={selectedAccountingCompanyIds}
                onChange={setSelectedAccountingCompanyIds}
              />
            </div>
          ) : null}
        </header>
        {isDemo && (
          <div className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 sm:mx-6 lg:mx-10">
            <span>
              Demo workspace — all companies, invoices, and payments are synthetic.
            </span>
            <Link to="/register" className="font-semibold underline underline-offset-2">
              Create your workspace
            </Link>
          </div>
        )}
        {companyStatus !== "loading" && financialYearStatus !== "loading" && (
          <Outlet
            key={`${financialYear}:${selectedAccountingCompanyIds.join(",")}`}
            context={{
              ...(auth ?? {}),
              financialYear,
              selectedAccountingCompanyIds,
            }}
          />
        )}
      </div>
    </div>
  );
}
