import { ArrowRight, Gem, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AUTH_BASE_URL } from "./config/reportUrls";

const navigation = [
  { label: "Product", href: "#product" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Navbar({ userId, updateAccessToken }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Invalid request");
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      updateAccessToken(null);
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur" aria-label="Primary navigation">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Prana home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"><Gem size={18} aria-hidden="true" /></span>
          <span className="text-lg font-bold tracking-tight text-slate-950">Prana</span>
        </Link>

        <div className="ml-10 hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">{item.label}</a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {userId ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:hidden"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={handleLogout} className="hidden min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"><LogOut size={16} /> Sign out</button>
              <Link to="/dashboard-summary" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800">Open dashboard <ArrowRight size={15} /></Link>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Sign in</Link>
              <Link to="/demo/dashboard-summary" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800">View demo <ArrowRight size={15} className="hidden sm:block" /></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
