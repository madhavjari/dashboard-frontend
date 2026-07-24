import { Link } from "react-router";

export default function Logo() {
  return (
    <Link
      to="/"
      className="text-xl font-bold tracking-tight text-gray-900 transition hover:text-blue-600"
    >
      SaaS App
    </Link>
  );
}
