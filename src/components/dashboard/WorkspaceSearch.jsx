import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Command, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const destinations = [
  { label: "Business overview", hint: "Revenue, purchases and cash position", to: "/dashboard-summary", keywords: "home summary kpi" },
  { label: "Sales by customer", hint: "Customers, invoices and sales", to: "/sales-dashboard", keywords: "party revenue" },
  { label: "Sales by item", hint: "Products, quantities and revenue", to: "/sales-itemwise-dashboard", keywords: "product sku" },
  { label: "Purchases by supplier", hint: "Suppliers, bills and purchases", to: "/purchase-dashboard", keywords: "vendor party" },
  { label: "Purchases by item", hint: "Purchased products and quantities", to: "/purchase-itemwise-dashboard", keywords: "product sku" },
  { label: "Receivables", hint: "Money customers owe you", to: "/sales-outstanding-dashboard", keywords: "collect outstanding due invoice" },
  { label: "Payables", hint: "Money owed to suppliers", to: "/purchase-outstanding-dashboard", keywords: "pay outstanding due bill" },
];

export default function WorkspaceSearch() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const routePrefix = pathname.startsWith("/demo") ? "/demo" : "";

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return destinations;
    return destinations.filter((item) =>
      `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  function goTo(destination) {
    navigate(`${routePrefix}${destination.to}`);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-white sm:w-64 lg:w-80"
        aria-label="Search reports and pages"
      >
        <Search size={17} aria-hidden="true" />
        <span className="hidden truncate sm:block">Search reports and pages</span>
        <span className="ml-auto hidden items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 lg:inline-flex">
          <Command size={10} />K
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/45 px-4 pt-[12vh] backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Search workspace"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4">
              <Search size={20} className="shrink-0 text-teal-700" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && matches[0]) goTo(matches[0]);
                }}
                className="h-14 min-w-0 flex-1 border-0 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Search sales, purchases, receivables…"
                aria-label="Search reports and pages"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {matches.length ? (
                matches.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => goTo(item)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-teal-50 focus-visible:bg-teal-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-teal-700">
                      <Search size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{item.hint}</span>
                    </span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-teal-700" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-800">No matching page</p>
                  <p className="mt-1 text-xs text-slate-500">Try “sales”, “supplier”, or “receivables”.</p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
              Search currently navigates reports. Entity search will be available when server-side search is connected.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
