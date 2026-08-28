import { ArrowRight, CircleDollarSign, ReceiptIndianRupee } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function BusinessMetrics({ summary, fmtCompact, fmtINR }) {
  const position = summary.salesOutstanding - summary.purchaseOutstanding;

  const metrics = [
    { label: "Net sales", value: summary.netSales, detail: "Revenue after returns", tone: "text-slate-950" },
    { label: "Net purchases", value: summary.netPurchases, detail: "Purchases after returns", tone: "text-slate-950" },
    { label: "Receivables", value: summary.salesOutstanding, detail: "Money to collect", tone: "text-amber-700" },
    { label: "Payables", value: summary.purchaseOutstanding, detail: "Payments to plan", tone: "text-rose-700" },
  ];

  return (
    <section aria-label="Key business metrics" className="surface-card overflow-hidden">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <article key={metric.label} className={`p-5 sm:p-6 ${index ? "border-t border-slate-100 sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-t xl:border-t-0" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
            <p className={`mt-2 font-mono-num text-2xl font-bold tracking-tight sm:text-3xl ${metric.tone}`} title={fmtINR(metric.value)}>{fmtCompact(metric.value)}</p>
            <p className="mt-1.5 text-xs text-slate-500">{metric.detail}</p>
          </article>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 bg-slate-50/80 px-5 py-3 text-sm sm:px-6">
        <span className="font-medium text-slate-600">Receivables less payables</span>
        <span className={`font-mono-num font-bold ${position >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{fmtINR(position)}</span>
        <span className="text-xs text-slate-500">before bank and cash balances</span>
      </div>
    </section>
  );
}

export function MorningFocus({ summary, fmtINR }) {
  const { pathname } = useLocation();
  const prefix = pathname.startsWith("/demo") ? "/demo" : "";
  return (
    <section className="surface-card overflow-hidden" aria-labelledby="money-due-title">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><h2 id="money-due-title" className="text-sm font-bold text-slate-900">Money due</h2><p className="mt-0.5 text-xs text-slate-500">Move directly from the summary to the balances requiring review.</p></div>
      <div className="grid sm:grid-cols-2">
        <Link to={`${prefix}/sales-outstanding-dashboard`} className="group flex min-h-20 items-center gap-3 px-5 py-4 transition hover:bg-teal-50 sm:px-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><CircleDollarSign size={19} /></span>
          <span className="min-w-0"><span className="block text-xs font-semibold text-slate-500">Review receivables</span><span className="mt-0.5 block font-mono-num text-lg font-bold text-slate-950">{fmtINR(summary.salesOutstanding)}</span></span>
          <ArrowRight size={17} className="ml-auto text-slate-400 group-hover:text-teal-700" />
        </Link>
        <Link to={`${prefix}/purchase-outstanding-dashboard`} className="group flex min-h-20 items-center gap-3 border-t border-slate-100 px-5 py-4 transition hover:bg-teal-50 sm:border-l sm:border-t-0 sm:px-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700"><ReceiptIndianRupee size={19} /></span>
          <span className="min-w-0"><span className="block text-xs font-semibold text-slate-500">Plan payables</span><span className="mt-0.5 block font-mono-num text-lg font-bold text-slate-950">{fmtINR(summary.purchaseOutstanding)}</span></span>
          <ArrowRight size={17} className="ml-auto text-slate-400 group-hover:text-teal-700" />
        </Link>
      </div>
    </section>
  );
}
