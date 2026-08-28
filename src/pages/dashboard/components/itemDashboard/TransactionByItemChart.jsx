import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import ChartCard from "../../../../components/dashboard/ChartCard";

export default function TransactionByItemChart({ barData, fmtCompact, fmtINR, context }) {
  const { pathname } = useLocation();
  const prefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const detailRoute = context === "Sales" ? "item" : "purchase-item";
  const largest = Math.max(1, ...barData.map((item) => Math.abs(Number(item.transaction) || 0)));

  return (
    <ChartCard title="Top items by value" subtitle="Ranked net transaction value; select an item to open its ledger">
      {barData.length ? <div className="divide-y divide-slate-100">{barData.map((item, index) => {
        const isOther = item.name === "Other items";
        const content = <><span className={`min-w-0 truncate text-sm font-semibold ${isOther ? "text-slate-600" : "text-slate-800 group-hover:text-teal-700"}`}>{index + 1}. {item.fullName}</span><span className="flex items-center gap-2 font-mono-num text-sm font-bold text-slate-950" title={fmtINR(item.transaction)}>{fmtCompact(item.transaction)}{!isOther ? <ArrowRight size={14} className="text-slate-300 group-hover:text-teal-700" /> : null}</span><span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-teal-600" style={{ width: `${(Math.abs(item.transaction) / largest) * 100}%` }} /></span></>;
        return isOther ? <div key={item.fullName} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-3">{content}</div> : <Link key={item.fullName} to={`${prefix}/${detailRoute}?item=${encodeURIComponent(item.fullName)}`} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-3">{content}</Link>;
      })}</div> : <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">No item activity available.</div>}
    </ChartCard>
  );
}
