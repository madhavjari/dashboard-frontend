import { Link } from "react-router";

export default function Logo() {
  return (
    <Link
      to="/"
      className="text-xl font-bold tracking-tight text-slate-900 transition hover:text-teal-700"
    >
      SaaS App
    </Link>
  );
}
