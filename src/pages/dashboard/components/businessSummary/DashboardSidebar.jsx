import {
  BarChart3,
  CircleDollarSign,
  Gem,
  LayoutDashboard,
  KeyRound,
  LogOut,
  Menu,
  ReceiptText,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";

const sections = [
  {
    label: "Sales",
    icon: BarChart3,
    items: [
      { label: "By customer", to: "/sales-dashboard" },
      { label: "By item", to: "/sales-itemwise-dashboard" },
      { label: "All invoices", to: "/sales-invoices" },
    ],
  },
  {
    label: "Purchases",
    icon: ReceiptText,
    items: [
      { label: "By supplier", to: "/purchase-dashboard" },
      { label: "By item", to: "/purchase-itemwise-dashboard" },
    ],
  },
  {
    label: "Money due",
    icon: CircleDollarSign,
    items: [
      { label: "Receivables", to: "/sales-outstanding-dashboard" },
      { label: "Payables", to: "/purchase-outstanding-dashboard" },
    ],
  },
];

function SidebarSection({ section, routePrefix, compact, onExpand }) {
  const { pathname } = useLocation();
  const hasActiveItem = section.items.some((item) => `${routePrefix}${item.to}` === pathname);
  const Icon = section.icon;

  if (compact) {
    return <button type="button" onClick={onExpand} title={section.label} aria-label={`Open ${section.label} navigation`} className={`flex min-h-11 w-full items-center justify-center rounded-lg transition ${hasActiveItem ? "bg-teal-500/15 text-teal-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}><Icon size={18} /></button>;
  }

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"><Icon size={14} /><span>{section.label}</span></div>
        <div className="space-y-0.5">
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={`${routePrefix}${item.to}`}
              className={({ isActive }) =>
                `block min-h-9 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-500/15 text-teal-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
    </div>
  );
}

export default function DashboardSidebar({
  isOpen,
  onToggle,
  onSignOut,
  isSigningOut,
}) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo") ? "/demo" : "";
  return (
    <div
      className={`grid min-w-0 overflow-hidden transition-[grid-template-rows] duration-200 ease-out lg:block ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      {isOpen ? <button type="button" onClick={onToggle} className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" aria-label="Close navigation" /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex min-h-0 w-64 flex-col overflow-hidden bg-[#0d1c1a] text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:z-40 lg:min-h-screen ${
          isOpen
            ? "translate-x-0 border-r border-slate-800/80"
            : "-translate-x-full border-transparent lg:w-[4.5rem] lg:translate-x-0 lg:border-r"
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-5">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white"><Gem size={18} /></span>
            <span className={isOpen ? "min-w-0" : "lg:hidden"}>
              <span className="block text-lg font-bold tracking-tight text-white">Prana</span>
              <span className="mt-0.5 block truncate text-[11px] text-slate-400">Business workspace</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-5">
          <NavLink
            to={`${routePrefix}/dashboard-summary`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-500/15 text-teal-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span className={isOpen ? "" : "lg:hidden"}>Overview</span>
          </NavLink>
          {sections.map((section) => (
            <SidebarSection key={section.label} section={section} routePrefix={routePrefix} compact={!isOpen} onExpand={onToggle} />
          ))}
          {!routePrefix && (
            <NavLink
              to="/sync-setup"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-500/15 text-teal-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <KeyRound size={18} />
              <span className={isOpen ? "" : "lg:hidden"}>Data connection</span>
            </NavLink>
          )}
        </nav>
        {onSignOut ? (
          <div className="shrink-0 border-t border-white/10 p-3">
            <button
              type="button"
              onClick={onSignOut}
              disabled={isSigningOut}
              title="Sign out"
              className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-60"
            >
              <LogOut size={18} aria-hidden="true" />
              <span className={isOpen ? "" : "lg:hidden"}>
                {isSigningOut ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
