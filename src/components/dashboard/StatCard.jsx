export default function StatCard({
  label,
  value,
  sub,
  tone = "text-gray-900",
  className = "",
  grouped = false,
  exactValue,
}) {
  return (
    <article className={`${grouped ? "min-w-0 bg-white p-5" : "surface-card min-w-0 p-5"} ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">
        {label}
      </p>
      <p className={`mt-2 font-mono-num text-2xl font-bold tracking-tight ${tone}`} title={exactValue}>{value}</p>
      {sub && <p className="mt-1.5 text-xs leading-5 text-slate-500">{sub}</p>}
    </article>
  );
}
