import { Link } from "react-router";

export default function Logo({
  className = "",
  compact = false,
  inverse = false,
  onClick,
  tagline,
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`flex min-w-0 shrink-0 items-center gap-2.5 ${className}`}
      aria-label="Prana home"
    >
      <img
        src="/prana-logo.png"
        alt=""
        className="h-9 w-9 shrink-0 object-contain"
        aria-hidden="true"
      />
      <span className={compact ? "sr-only" : "min-w-0"}>
        <span
          className={`block text-lg font-bold tracking-tight ${
            inverse ? "text-white" : "text-slate-950"
          }`}
        >
          Prana
        </span>
        {tagline ? (
          <span
            className={`mt-0.5 block truncate text-[11px] ${
              inverse ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
