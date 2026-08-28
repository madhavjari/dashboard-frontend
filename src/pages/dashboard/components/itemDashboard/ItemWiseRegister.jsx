import { useMemo, useState } from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import RegisterPagination, { REGISTER_PAGE_SIZE } from "../RegisterPagination";

export default function ItemWiseRegister({ columns, context, sortedItems, sortKey, handleSort, summary, fmtNumber, fmtINR }) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const detailRoute = context === "Sales" ? "item" : "purchase-item";
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? sortedItems.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(normalized)) : sortedItems;
  }, [query, sortedItems]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / REGISTER_PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleItems = filteredItems.slice(startIndex, startIndex + REGISTER_PAGE_SIZE);
  const filteredTotal = filteredItems.reduce((sum, item) => sum + item.transaction, 0);
  const itemUrl = (name) => `${routePrefix}/${detailRoute}?item=${encodeURIComponent(name)}`;

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
        <div><h2 className="text-base font-bold text-slate-900">Item register</h2><p className="mt-1 text-xs text-slate-500">{filteredItems.length} of {sortedItems.length} items · {query ? "filtered value" : "total value"} {fmtINR(filteredTotal)}</p></div>
        <label className="relative block w-full sm:w-72"><span className="sr-only">Search item or unit</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search item or unit" className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-8 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100" />{query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><X size={14} /></button> : null}</label>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {visibleItems.length ? visibleItems.map((item) => <article key={item.name} className="rounded-xl border border-slate-200 p-4"><Link to={itemUrl(item.name)} className="break-words text-sm font-bold text-slate-900 hover:text-teal-700">{item.name}</Link><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><Value label="Value" value={fmtINR(item.transaction)} strong /><Value label="Quantity" value={`${fmtNumber(item.quantity, 1)} ${item.category}`} /><Value label={`Share of ${context.toLowerCase()}`} value={`${summary.totalTransaction ? ((item.transaction / summary.totalTransaction) * 100).toFixed(1) : "0.0"}%`} /><Value label="Net rate (inc. GST)" value={item.quantity > 0 ? `₹${(item.transaction / item.quantity).toFixed(2)}` : "—"} /></div></article>) : <Empty query={query} />}
      </div>

      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">{columns.map(([key, label]) => <th key={key} className={`px-5 py-2 ${key === "quantity" || key === "transaction" ? "text-right" : ""}`}><button type="button" onClick={() => handleSort(key)} className="inline-flex min-h-8 items-center gap-1 rounded px-1 font-semibold hover:text-slate-800" aria-label={`Sort by ${label}`}>{label}<ArrowUpDown size={11} className={sortKey === key ? "opacity-100" : "opacity-30"} /></button></th>)}<th className="px-5 py-3 text-right">Share</th><th className="px-5 py-3 text-right">Net rate (inc. GST)</th></tr></thead>
          <tbody>{visibleItems.length ? visibleItems.map((item) => <tr key={item.name} className="border-b border-slate-100 transition hover:bg-teal-50/40"><td className="px-5 py-3 font-semibold text-slate-900"><Link to={itemUrl(item.name)} className="hover:text-teal-700 hover:underline">{item.name}</Link></td><td className="px-5 py-3 text-slate-600">{item.category}</td><td className="px-5 py-3 text-right font-mono-num text-slate-700">{fmtNumber(item.quantity, 1)}</td><td className="px-5 py-3 text-right font-mono-num font-semibold text-slate-900">{fmtINR(item.transaction)}</td><td className="px-5 py-3 text-right font-mono-num text-slate-600">{summary.totalTransaction ? ((item.transaction / summary.totalTransaction) * 100).toFixed(1) : "0.0"}%</td><td className="px-5 py-3 text-right font-mono-num text-slate-600">{item.quantity > 0 ? `₹${(item.transaction / item.quantity).toFixed(2)}` : "—"}</td></tr>) : <tr><td colSpan={6}><Empty query={query} /></td></tr>}</tbody>
        </table>
      </div>
      {filteredItems.length ? <RegisterPagination page={activePage} totalPages={totalPages} startIndex={startIndex} visibleCount={visibleItems.length} totalCount={filteredItems.length} itemLabel="items" onChange={setCurrentPage} /> : null}
    </section>
  );
}

function Value({ label, value, strong = false }) { return <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 font-mono-num ${strong ? "font-bold text-slate-950" : "text-slate-700"}`}>{value}</p></div>; }
function Empty({ query }) { return <div className="px-5 py-10 text-center"><p className="text-sm font-semibold text-slate-800">{query ? "No items match your search" : "No item activity available"}</p><p className="mt-1 text-xs text-slate-500">{query ? "Try a broader item name or unit." : "There are no items for the selected workspace and year."}</p></div>; }
