const accentClass = {
  Paid: "border-l-emerald-500",
  Unpaid: "border-l-rose-500",
  neutral: "border-l-slate-300",
};

const statusClass = {
  Paid: "bg-emerald-50 text-emerald-700",
  Unpaid: "bg-rose-50 text-rose-700",
};

export default function InvoiceCard({
  invoiceNumber,
  date,
  title,
  subtitle,
  amount,
  status,
  children,
  action,
}) {
  const accent = accentClass[status] || accentClass.neutral;

  return (
    <article
      className={`rounded-xl border border-slate-200 border-l-4 bg-white p-2.5 shadow-sm ${accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 break-words font-mono text-[11px] font-semibold text-slate-500">
          {invoiceNumber || "No bill number"}
        </p>
        <p className="shrink-0 text-[11px] text-slate-400">{date}</p>
      </div>

      <div className="mt-2 min-w-0">
        <div className="break-words text-sm font-bold tracking-tight text-slate-950">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-0.5 break-words text-[11px] text-slate-400">
            {subtitle}
          </div>
        ) : null}
      </div>

      {children ? <div className="mt-2">{children}</div> : null}

      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="font-mono-num text-lg font-bold tracking-tight text-slate-950">
          {amount}
        </p>
        <div className="flex items-center gap-2">
          {action ? action : null}
          {status ? (
            <span
              className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold ${
                statusClass[status] || "bg-slate-100 text-slate-700"
              }`}
            >
              {status}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
