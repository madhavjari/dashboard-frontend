import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { fmtCompact, fmtINR } from "../../../../utils/format";

function aggregateByParty(transactions) {
  const parties = new Map();
  for (const transaction of transactions) {
    const party = transaction.party || "Unknown party";
    const direction = String(transaction.code || "").endsWith("R") ? -1 : 1;
    parties.set(party, (parties.get(party) || 0) + direction * (Number(transaction.totalAmount) || 0));
  }
  return [...parties.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export default function PartyRevenueQuantityChart({ transactions, context }) {
  const { pathname } = useLocation();
  const prefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const partyRoute = context === "Sales" ? "customer" : "supplier";
  const data = useMemo(() => aggregateByParty(transactions || []), [transactions]);
  const visible = data.slice(0, 10);
  const largest = Math.max(1, ...visible.map((party) => Math.abs(party.value)));

  return (
    <section className="surface-card mb-6 overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><h2 className="text-sm font-bold text-slate-900">Top {context === "Sales" ? "customers" : "suppliers"} by net value</h2><p className="mt-1 text-xs text-slate-500">Returns deducted · select a name to open the party ledger</p></div>
      {visible.length ? <div className="divide-y divide-slate-100 px-5 sm:px-6">{visible.map((party, index) => <Link key={party.name} to={`${prefix}/${partyRoute}?party=${encodeURIComponent(party.name)}`} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-3.5"><span className="min-w-0 truncate text-sm font-semibold text-slate-800 group-hover:text-teal-700">{index + 1}. {party.name}</span><span className="flex items-center gap-2 font-mono-num text-sm font-bold text-slate-950" title={fmtINR(party.value)}>{fmtCompact(party.value)}<ArrowRight size={14} className="text-slate-300 group-hover:text-teal-700" /></span><span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-teal-600" style={{ width: `${(Math.abs(party.value) / largest) * 100}%` }} /></span></Link>)}</div> : <div className="px-5 py-10 text-center text-sm text-slate-500">No party activity available.</div>}
      {data.length > 10 ? <p className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:px-6">Showing the top 10 of {data.length} parties. Use the transaction register for complete detail.</p> : null}
    </section>
  );
}
