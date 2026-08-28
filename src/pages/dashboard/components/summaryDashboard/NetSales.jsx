import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import ChartCard from "../../../../components/dashboard/ChartCard";
import { fmtCompact, fmtINR } from "../../../../utils/format";

export default function NetSales({ customerChartData, context }) {
  const { pathname } = useLocation();
  const prefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const partyRoute = context === "Sales" ? "customer" : "supplier";
  const label = context === "Sales" ? "customer" : "supplier";
  const data = [...customerChartData]
    .map((party) => ({ ...party, value: Number(party.netAmount) || 0 }))
    .sort((a, b) => b.value - a.value);
  const visible = data.slice(0, 10);
  const largest = Math.max(1, ...visible.map((party) => Math.abs(party.value)));

  return (
    <ChartCard title={`Top ${label}s by net ${context.toLowerCase()}`} subtitle="Ranked contribution; select a name to open its ledger">
      {visible.length ? <div className="divide-y divide-slate-100">{visible.map((party, index) => <Link key={party.party} to={`${prefix}/${partyRoute}?party=${encodeURIComponent(party.party)}`} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-3"><span className="min-w-0 truncate text-sm font-semibold text-slate-800 group-hover:text-teal-700">{index + 1}. {party.party}</span><span className="flex items-center gap-2 font-mono-num text-sm font-bold text-slate-950" title={fmtINR(party.value)}>{fmtCompact(party.value)}<ArrowRight size={14} className="text-slate-300 group-hover:text-teal-700" /></span><span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${party.value < 0 ? "bg-rose-500" : "bg-teal-600"}`} style={{ width: `${(Math.abs(party.value) / largest) * 100}%` }} /></span></Link>)}</div> : <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">No {context.toLowerCase()} {label} data available.</div>}
      {data.length > 10 ? <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">Showing the top 10 of {data.length} {label}s. Use the register for complete detail.</p> : null}
    </ChartCard>
  );
}
