import { getInvoiceAgeDays } from "../../utils/invoiceAge";

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
  billDate,
  date,
  title,
  subtitle,
  quantity,
  type,
  amount,
  status,
  unpaidDays,
  statusDays,
  runningBalance,
  children,
  action,
}) {
  const accent = accentClass[status] || accentClass.neutral;
  const daysUnpaid =
    unpaidDays ?? (billDate ? getInvoiceAgeDays(billDate) : null);
  const displayedDays = statusDays ?? daysUnpaid;
  const showStatusDays =
    status === "Unpaid"
      ? displayedDays !== null && Number.isFinite(Number(displayedDays))
      : status === "Paid" &&
        statusDays !== null &&
        statusDays !== undefined &&
        Number.isFinite(Number(statusDays));

  return (
    <article
      className={`rounded-xl border border-slate-200 border-l-4 bg-white p-2.5 shadow-sm ${accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 break-words font-mono text-[11px] font-semibold text-slate-500">
          Bill No: {invoiceNumber || "No bill number"}
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

      <p className="mt-2 text-xs font-semibold text-slate-500">
        {quantity || "—"}
        {type ? ` · Type: ${type}` : ""}
      </p>

      {children ? <div className="mt-2">{children}</div> : null}

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono-num text-lg font-bold tracking-tight text-slate-950">
            {amount}
          </p>
          {runningBalance !== null && runningBalance !== undefined ? (
            <p className="mt-1 text-[10px] font-semibold text-slate-500">
              Running balance: {runningBalance}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          {action ? action : null}
          {status ? (
            <div className="flex flex-col items-end gap-1">
              <span
                className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold ${
                  statusClass[status] || "bg-slate-100 text-slate-700"
                }`}
              >
                {status}
              </span>
              {showStatusDays ? (
                <span
                  className={`text-[10px] font-semibold ${
                    status === "Paid" ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {displayedDays} {Number(displayedDays) === 1 ? "day" : "days"}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
