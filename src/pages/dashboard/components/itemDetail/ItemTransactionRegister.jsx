import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { fmtDateIN } from "../../../../utils/format";
import { getNumericQuantityForUnit } from "../../../../utils/unitOfMeasure";
import RegisterPagination, { REGISTER_PAGE_SIZE } from "../RegisterPagination";

export default function ItemTransactionRegister({ transactions, fmtNumber, fmtINR }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? transactions.filter((transaction) => `${transaction.party} ${transaction.billNo} ${transaction.code}`.toLowerCase().includes(normalized)) : transactions;
  }, [query, transactions]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / REGISTER_PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + REGISTER_PAGE_SIZE);

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6"><div><h2 className="text-base font-bold text-slate-900">Transaction register</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} of {transactions.length} transactions</p></div><label className="relative block w-full sm:w-72"><span className="sr-only">Search party, invoice, or type</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Search party, invoice, or type" className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-8 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100" />{query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400" aria-label="Clear search"><X size={14} /></button> : null}</label></div>
      <div className="space-y-3 p-4 md:hidden">{visible.length ? visible.map((transaction, index) => <article key={`${transaction.billNo}-${startIndex + index}`} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><p className="break-words text-sm font-bold text-slate-900">{transaction.party}</p><TransactionTypeBadge code={transaction.code} /></div><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><Value label="Date" value={fmtDateIN(transaction.billDate)} /><Value label="Invoice" value={transaction.billNo} /><Value label="Quantity" value={`${fmtNumber(getNumericQuantityForUnit(transaction), 1)} ${transaction.per}`} /><Value label="Amount" value={fmtINR(transaction.totalAmount)} strong /></div></article>) : <Empty query={query} />}</div>
      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block"><table className="w-full min-w-[720px] text-sm"><thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500"><th className="px-5 py-3">Date</th><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Party</th><th className="px-5 py-3 text-right">Quantity</th><th className="px-5 py-3 text-right">Amount</th><th className="px-5 py-3 text-center">Type</th></tr></thead><tbody>{visible.length ? visible.map((transaction, index) => <tr key={`${transaction.billNo}-${startIndex + index}`} className="border-b border-slate-100 transition hover:bg-teal-50/40"><td className="whitespace-nowrap px-5 py-3 text-slate-600">{fmtDateIN(transaction.billDate)}</td><td className="px-5 py-3 font-mono text-xs text-slate-800">{transaction.billNo}</td><td className="px-5 py-3 font-semibold text-slate-900">{transaction.party}</td><td className="px-5 py-3 text-right font-mono-num text-slate-700">{fmtNumber(getNumericQuantityForUnit(transaction), 1)} {transaction.per}</td><td className="px-5 py-3 text-right font-mono-num font-semibold text-slate-950">{fmtINR(transaction.totalAmount)}</td><td className="px-5 py-3 text-center"><TransactionTypeBadge code={transaction.code} /></td></tr>) : <tr><td colSpan={6}><Empty query={query} /></td></tr>}</tbody></table></div>
      {filtered.length ? <RegisterPagination page={activePage} totalPages={totalPages} startIndex={startIndex} visibleCount={visible.length} totalCount={filtered.length} itemLabel="transactions" onChange={setCurrentPage} /> : null}
    </section>
  );
}

function Value({ label, value, strong = false }) { return <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 break-words font-mono-num ${strong ? "font-bold text-slate-950" : "text-slate-700"}`}>{value}</p></div>; }
function Empty({ query }) { return <div className="px-5 py-10 text-center"><p className="text-sm font-semibold text-slate-800">{query ? "No transactions match your search" : "No transactions available"}</p><p className="mt-1 text-xs text-slate-500">{query ? "Try another party, invoice number, or type." : "There is no activity for the selected workspace and year."}</p></div>; }
function TransactionTypeBadge({ code }) { const isReturn = String(code || "").endsWith("R"); return <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${isReturn ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200" : "bg-slate-100 text-slate-700"}`} title={isReturn ? "Return transaction" : "Sale or purchase transaction"}>{code}</span>; }
