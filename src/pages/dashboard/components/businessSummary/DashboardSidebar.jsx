import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  Landmark,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";

const sections = [
  {
    label: "Sales",
    icon: BarChart3,
    items: [
      { label: "Party-wise summary", to: "/sales-dashboard" },
      { label: "Item-wise summary", to: "/sales-itemwise-dashboard" },
    ],
  },
  {
    label: "Purchase",
    icon: ReceiptText,
    items: [
      { label: "Party-wise summary", to: "/purchase-dashboard" },
      { label: "Item-wise summary", to: "/purchase-itemwise-dashboard" },
    ],
  },
  {
    label: "Outstanding",
    icon: CircleDollarSign,
    items: [
      { label: "Sales outstanding", to: "/sales-outstanding-dashboard" },
      { label: "Purchase outstanding", to: "/purchase-outstanding-dashboard" },
    ],
  },
];

function SidebarSection({ section }) {
  const { pathname } = useLocation();
  const hasActiveItem = section.items.some((item) => item.to === pathname);
  const [isOpen, setIsOpen] = useState(hasActiveItem);
  const Icon = section.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
          hasActiveItem
            ? "bg-teal-500/15 text-teal-300"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon size={18} />
        <span className="flex-1">{section.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="mt-1 space-y-1 border-l border-slate-800 pl-3 ml-5">
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-xs font-medium transition ${
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
      )}
    </div>
  );
}

export default function DashboardSidebar() {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 text-slate-300 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="px-5 py-5">
        <Link to="/" className="block">
          <p className="text-lg font-bold tracking-tight text-white">Prana</p>
          <p className="mt-0.5 text-xs text-slate-400">Business command centre</p>
        </Link>
      </div>
      <nav className="space-y-1 px-3 pb-5">
        <NavLink
          to="/dashboard-summary"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-teal-500/15 text-teal-300"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Summary
        </NavLink>
        {sections.map((section) => (
          <SidebarSection key={section.label} section={section} />
        ))}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500">
          <Landmark size={18} />
          Cashflow <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px]">Soon</span>
        </div>
      </nav>
    </aside>
  );
}
