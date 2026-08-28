import { useMemo, useState } from "react";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { fmtDateIN } from "../../../../utils/format";
import { Link, useLocation } from "react-router";
import RegisterPagination, { REGISTER_PAGE_SIZE } from "../RegisterPagination";
import { getAgeBand, getInvoiceAgeDays } from "../../../../utils/invoiceAge";

const ageFilters = ["All ages", "0–30 days", "31–60 days", "61–90 days", "90+ days"];

function AgeBadge({ days }) {
  const tone = days > 90 ? "bg-rose-50 text-rose-700 ring-rose-200" : days > 60 ? "bg-orange-50 text-orange-700 ring-orange-200" : days > 30 ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-slate-50 text-slate-600 ring-slate-200";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}>{days} days</span>;
}

export default function OutstandingRegister({ invoices, fmtINR, context }) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const dealer = context === "Sales" ? "customer" : "supplier";
  const outstandingLabel = context === "Sales" ? "To collect" : "To pay";
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("All ages");
  const [sort, setSort] = useState("oldest");

  const outstandingInvoices = useMemo(() => invoices.filter((invoice) => Number(invoice.amountOutstanding) > 0).map((invoice) => ({ ...invoice, ageDays: getInvoiceAgeDays(invoice.billDate) })), [invoices]);
  const filteredInvoices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = outstandingInvoices.filter((invoice) => {
      const matchesQuery = !normalized || `${invoice.party} ${invoice.billNo}`.toLowerCase().includes(normalized);
      return matchesQuery && (ageFilter === "All ages" || getAgeBand(invoice.ageDays) === ageFilter);
    });
    result.sort((a, b) => sort === "highest" ? Number(b.amountOutstanding) - Number(a.amountOutstanding) : sort === "newest" ? a.ageDays - b.ageDays : b.ageDays - a.ageDays);
    return result;
  }, [ageFilter, outstandingInvoices, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / REGISTER_PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleInvoices = filteredInvoices.slice(startIndex, startIndex + REGISTER_PAGE_SIZE);
  const hasFilters = Boolean(query) || ageFilter !== "All ages";
  const clearFilters = () => { setQuery(""); setAgeFilter("All ages"); setCurrentPage(1); };
  const partyUrl = (party) => `${routePrefix}/${dealer}?party=${encodeURIComponent(party)}`;

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Open invoices</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{outstandingInvoices.length} invoices need {context === "Sales" ? "collection follow-up" : "payment planning"}.{context === "Sales" ? " Balances exclude unlinked sales returns." : ""}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{filteredInvoices.length} shown</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(14rem,1fr)_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search party or invoice</span>
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder={`Search ${dealer} or invoice`} className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-100" />
            {query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><X size={15} /></button> : null}
          </label>
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700">
            <SlidersHorizontal size={16} className="text-slate-400" /><span className="sr-only">Filter by invoice age</span>
            <select value={ageFilter} onChange={(event) => { setAgeFilter(event.target.value); setCurrentPage(1); }} className="bg-transparent font-medium outline-none">{ageFilters.map((filter) => <option key={filter}>{filter}</option>)}</select>
          </label>
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700">
            <span className="text-xs font-medium text-slate-500">Sort</span>
            <select value={sort} onChange={(event) => { setSort(event.target.value); setCurrentPage(1); }} className="bg-transparent font-semibold outline-none"><option value="oldest">Oldest first</option><option value="highest">Highest balance</option><option value="newest">Newest first</option></select>
          </label>
        </div>
        {hasFilters ? <button type="button" onClick={clearFilters} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900"><X size={14} /> Clear all filters</button> : null}
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {visibleInvoices.length === 0 ? <EmptyState hasFilters={hasFilters} context={context} onClear={clearFilters} /> : visibleInvoices.map((invoice) => (
          <article key={`${invoice.billNo}-${invoice.party}`} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3"><Link to={partyUrl(invoice.party)} className="min-w-0 break-words text-sm font-bold text-slate-900 hover:text-teal-700">{invoice.party}</Link><AgeBadge days={invoice.ageDays} /></div>
            <p className="mt-1 font-mono text-xs text-slate-500">{invoice.billNo} · {fmtDateIN(invoice.billDate)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs"><RegisterValue label="Bill amount" value={fmtINR(invoice.billAmount)} /><RegisterValue label={outstandingLabel} value={fmtINR(invoice.amountOutstanding)} emphasized /></div>
            <Link to={partyUrl(invoice.party)} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800">View {dealer} ledger <ArrowUpRight size={15} /></Link>
          </article>
        ))}
      </div>

      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50"><tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500"><th className="px-6 py-3">Invoice date</th><th className="px-4 py-3">Invoice</th><th className="px-4 py-3">{context === "Sales" ? "Customer" : "Supplier"}</th><th className="px-4 py-3">Age</th><th className="px-4 py-3 text-right">Bill amount</th><th className="px-6 py-3 text-right">{outstandingLabel}</th><th className="w-12 px-3 py-3"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>{visibleInvoices.length === 0 ? <tr><td colSpan={7}><EmptyState hasFilters={hasFilters} context={context} onClear={clearFilters} /></td></tr> : visibleInvoices.map((invoice) => (
            <tr key={`${invoice.billNo}-${invoice.party}`} className="border-b border-slate-100 transition hover:bg-teal-50/40"><td className="whitespace-nowrap px-6 py-3.5 text-slate-600">{fmtDateIN(invoice.billDate)}</td><td className="px-4 py-3.5 font-mono text-xs font-medium text-slate-800">{invoice.billNo}</td><td className="px-4 py-3.5 font-semibold text-slate-900"><Link to={partyUrl(invoice.party)} className="hover:text-teal-700 hover:underline">{invoice.party}</Link></td><td className="px-4 py-3.5"><AgeBadge days={invoice.ageDays} /></td><td className="px-4 py-3.5 text-right font-mono-num text-slate-600">{fmtINR(invoice.billAmount)}</td><td className="px-6 py-3.5 text-right font-mono-num font-bold text-slate-950">{fmtINR(invoice.amountOutstanding)}</td><td className="px-3 py-3.5"><Link to={partyUrl(invoice.party)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-teal-700" aria-label={`View ${invoice.party} ledger`} title={`View ${dealer} ledger`}><ArrowUpRight size={17} /></Link></td></tr>
          ))}</tbody>
        </table>
      </div>
      {filteredInvoices.length > 0 ? <RegisterPagination page={activePage} totalPages={totalPages} startIndex={startIndex} visibleCount={visibleInvoices.length} totalCount={filteredInvoices.length} itemLabel="invoices" onChange={setCurrentPage} /> : null}
    </section>
  );
}

function EmptyState({ hasFilters, context, onClear }) {
  return <div className="px-5 py-12 text-center"><p className="text-sm font-semibold text-slate-800">{hasFilters ? "No invoices match these filters" : `No open ${context.toLowerCase()} invoices`}</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">{hasFilters ? "Try a different party, invoice number, or age range." : "There is nothing requiring action for the selected workspace and financial year."}</p>{hasFilters ? <button type="button" onClick={onClear} className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button> : null}</div>;
}

function RegisterValue({ label, value, emphasized = false }) {
  return <div><p className="uppercase tracking-wide text-slate-400">{label}</p><p className={`mt-1 font-mono-num ${emphasized ? "font-bold text-slate-950" : "text-slate-700"}`}>{value}</p></div>;
}
