import { ArrowDownRight, ArrowUpRight, Clock3, IndianRupee, LayoutDashboard, MoreHorizontal } from "lucide-react";

const metrics = [
  { label: "Net sales", value: "₹82.4L", detail: "after returns", change: "+17.6%", positive: true },
  { label: "Net purchases", value: "₹48.7L", detail: "after returns", change: "+4.2%", positive: true },
  { label: "Receivables", value: "₹21.8L", detail: "money to collect", change: "14 open", warning: true },
  { label: "Payables", value: "₹12.4L", detail: "payments to plan", change: "8 open" },
];

const receivables = [
  { party: "Mehta Retail", age: "96 days", amount: "₹4.82L", urgent: true },
  { party: "Arora Trading Co.", age: "62 days", amount: "₹3.14L", urgent: true },
  { party: "Kaveri Distributors", age: "28 days", amount: "₹2.76L" },
];

export default function DemoAnalytics() {
  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white text-left shadow-2xl shadow-slate-950/12" aria-label="Illustrative Prana dashboard with synthetic business data">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white"><LayoutDashboard size={16} /></span>
          <div><p className="text-xs font-bold text-slate-900">Business health</p><p className="text-[10px] text-slate-500">Illustrative workspace</p></div>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">Synthetic demo data</span>
      </div>

      <div className="p-3 sm:p-5">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={metric.label} className={`min-w-0 p-3.5 sm:p-4 ${index % 2 ? "border-l border-slate-100" : ""} ${index > 1 ? "border-t border-slate-100 lg:border-t-0 lg:border-l" : ""}`}>
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
              <p className={`mt-1.5 font-mono-num text-lg font-bold sm:text-xl ${metric.warning ? "text-amber-700" : "text-slate-950"}`}>{metric.value}</p>
              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500"><span className="truncate">{metric.detail}</span><span className={`ml-auto shrink-0 font-semibold ${metric.positive ? "text-emerald-700" : "text-slate-600"}`}>{metric.change}</span></div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <section className="rounded-xl border border-slate-200 p-4 sm:p-5" aria-labelledby="trend-title">
            <div className="flex items-start justify-between gap-3">
              <div><p id="trend-title" className="text-xs font-bold text-slate-900">Sales trend</p><p className="mt-1 text-[10px] text-slate-500">Monthly net sales, Apr–Sep</p></div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700"><ArrowUpRight size={11} /> 17.6%</span>
            </div>
            <div className="mt-5 h-36 w-full sm:h-44">
              <svg viewBox="0 0 560 176" className="h-full w-full overflow-visible" role="img" aria-label="Net sales rise from 42 lakh in April to 82 lakh in September, with a small dip in June">
                {[24, 72, 120, 168].map((y) => <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 5" />)}
                <defs><linearGradient id="homeTrend" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity=".28" /><stop offset="100%" stopColor="#14b8a6" stopOpacity="0" /></linearGradient></defs>
                <path d="M8 140 C55 130 86 110 116 114 S185 126 224 92 S295 82 336 66 S410 52 448 35 S520 18 552 12 L552 168 L8 168 Z" fill="url(#homeTrend)" />
                <path d="M8 140 C55 130 86 110 116 114 S185 126 224 92 S295 82 336 66 S410 52 448 35 S520 18 552 12" fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
                {[8, 116, 224, 336, 448, 552].map((x, index) => <circle key={x} cx={x} cy={[140, 114, 92, 66, 35, 12][index]} r="4" fill="white" stroke="#0f766e" strokeWidth="3" />)}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-medium text-slate-400"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200" aria-labelledby="receivable-title">
            <div className="flex items-start justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
              <div><p id="receivable-title" className="text-xs font-bold text-slate-900">Receivables needing attention</p><p className="mt-1 text-[10px] text-slate-500">Prioritized by invoice age</p></div>
              <MoreHorizontal size={17} className="text-slate-400" />
            </div>
            <div>
              {receivables.map((item) => (
                <div key={item.party} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-100 px-4 py-3.5 last:border-0 sm:px-5">
                  <div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-900">{item.party}</p><p className={`mt-1 inline-flex items-center gap-1 text-[10px] font-medium ${item.urgent ? "text-rose-700" : "text-slate-500"}`}><Clock3 size={10} /> {item.age}</p></div>
                  <p className="font-mono-num text-xs font-bold text-slate-900">{item.amount}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 text-[10px] text-slate-600 sm:px-5"><IndianRupee size={12} className="text-teal-700" /><span>₹9.38L net receivable position</span><ArrowDownRight size={12} className="ml-auto text-slate-400" /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
