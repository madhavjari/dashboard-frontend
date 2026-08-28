import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { fmtCompact, fmtINR } from "../../../../utils/format";

function aggregateByItem(transactions) {
  const items = new Map();
  for (const transaction of transactions) {
    const itemName = transaction.itemName || "Unknown item";
    const direction = String(transaction.code || "").endsWith("R") ? -1 : 1;
    items.set(itemName, (items.get(itemName) || 0) + direction * (Number(transaction.totalAmount) || 0));
  }
  return [...items.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export default function ItemValueQuantityChart({ transactions, context }) {
  const { pathname } = useLocation();
  const prefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const detailRoute = context === "Sales" ? "item" : "purchase-item";
  const data = useMemo(() => aggregateByItem(transactions || []), [transactions]);
  const visible = data.slice(0, 10);
  const largest = Math.max(1, ...visible.map((item) => Math.abs(item.value)));

  return (
    <section className="surface-card mb-6 overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><h2 className="text-sm font-bold text-slate-900">Top items by net value</h2><p className="mt-1 text-xs text-slate-500">Returns deducted · select an item to open its ledger</p></div>
      {visible.length ? <div className="divide-y divide-slate-100 px-5 sm:px-6">{visible.map((item, index) => <Link key={item.name} to={`${prefix}/${detailRoute}?item=${encodeURIComponent(item.name)}`} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-3.5"><span className="min-w-0 truncate text-sm font-semibold text-slate-800 group-hover:text-teal-700">{index + 1}. {item.name}</span><span className="flex items-center gap-2 font-mono-num text-sm font-bold text-slate-950" title={fmtINR(item.value)}>{fmtCompact(item.value)}<ArrowRight size={14} className="text-slate-300 group-hover:text-teal-700" /></span><span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-teal-600" style={{ width: `${(Math.abs(item.value) / largest) * 100}%` }} /></span></Link>)}</div> : <div className="px-5 py-10 text-center text-sm text-slate-500">No item activity available.</div>}
      {data.length > 10 ? <p className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:px-6">Showing the top 10 of {data.length} items. Use the transaction register for complete detail.</p> : null}
    </section>
  );
}
