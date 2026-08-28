import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { fmtINR } from "../../../../utils/format";
import { Link, useLocation } from "react-router";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "../RegisterPagination";

export default function PartyWiseRegister({ party, context }) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const dealer = context === "Sales" ? "customer" : "supplier";
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("net-desc");
  const filteredParties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = normalized ? party.filter((entry) => entry.party.toLowerCase().includes(normalized)) : [...party];
    return matches.sort((a, b) => {
      if (sort === "name") return a.party.localeCompare(b.party);
      if (sort === "outstanding-desc") return Number(b.outstandingAmount) - Number(a.outstandingAmount);
      if (sort === "invoices-desc") return Number(b.invoiceCount) - Number(a.invoiceCount);
      return Number(b.netAmount) - Number(a.netAmount);
    });
  }, [party, query, sort]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredParties.length / REGISTER_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleParties = filteredParties.slice(
    startIndex,
    startIndex + REGISTER_PAGE_SIZE,
  );
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
        <div><h2 className="text-base font-bold text-slate-900">{context === "Sales" ? "Customer" : "Supplier"} performance</h2><p className="mt-1 text-xs text-slate-500">Open a party to review its ledger and transactions.</p></div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><label className="relative block w-full sm:w-64"><span className="sr-only">Search {dealer}</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-8 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100" placeholder={`Search ${dealer}`} />{query ? <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400" aria-label="Clear search"><X size={14} /></button> : null}</label><label className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-xs text-slate-500"><span>Sort</span><select value={sort} onChange={(event) => { setSort(event.target.value); setCurrentPage(1); }} className="bg-transparent text-sm font-semibold text-slate-700 outline-none"><option value="net-desc">Net value</option><option value="outstanding-desc">Outstanding</option><option value="invoices-desc">Invoices</option><option value="name">Name A–Z</option></select></label></div>
      </div>
      <div className="p-5 pt-3 sm:p-6 sm:pt-3">
      <div className="space-y-3 md:hidden">
        {filteredParties.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {query ? `No ${dealer} matches “${query}”.` : `No ${dealer} ${context.toLowerCase()} data available.`}
          </p>
        ) : (
          visibleParties.map((entry) => (
            <div
              key={entry.party}
              className="rounded-lg border border-slate-100 p-3"
            >
              <Link
                to={`${routePrefix}/${dealer}?party=${encodeURIComponent(entry.party)}`}
                className="block break-words text-sm font-semibold text-slate-900"
              >
                {entry.party}
              </Link>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <RegisterValue label="Invoices" value={entry.invoiceCount} />
                <RegisterValue label={context} value={fmtINR(entry.grossAmount)} />
                <RegisterValue label="Returns" value={fmtINR(entry.returnAmount)} />
                <RegisterValue
                  label={`Net ${context}`}
                  value={fmtINR(entry.netAmount)}
                  emphasized
                />
                <RegisterValue
                  label={outstandingLabel}
                  value={fmtINR(entry.outstandingAmount)}
                  emphasized
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
              <th className="py-2">{context === "Sales" ? "Customer" : "Supplier"}</th>
              <th className="py-2 text-right">Invoices</th>
              <th className="py-2 text-right">{context}</th>
              <th className="py-2 text-right">Returns</th>
              <th className="py-2 text-right">Net {context}</th>
              <th className="py-2 text-right">{outstandingLabel}</th>
            </tr>
          </thead>
          <tbody>
            {filteredParties.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-sm text-gray-500"
                >
                  {query ? `No ${dealer} matches “${query}”.` : `No ${dealer} ${context.toLowerCase()} data available.`}
                </td>
              </tr>
            ) : (
              visibleParties.map((c) => (
                <tr key={c.party} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-900">
                    <Link to={`${routePrefix}/${dealer}?party=${encodeURIComponent(c.party)}`} className="hover:text-teal-700 hover:underline">
                      {c.party}
                    </Link>
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {c.invoiceCount}
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {fmtINR(c.grossAmount)}
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {fmtINR(c.returnAmount)}
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {fmtINR(c.netAmount)}
                  </td>
                  <td className={`py-2 text-right font-semibold ${Number(c.outstandingAmount) > 0 ? "text-amber-700" : "text-slate-500"}`}>
                    {fmtINR(c.outstandingAmount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredParties.length > 0 && (
        <div className="-mx-5 -mb-5 mt-4 sm:-mx-6 sm:-mb-6">
          <RegisterPagination
            page={activePage}
            totalPages={totalPages}
            startIndex={startIndex}
            visibleCount={visibleParties.length}
            totalCount={filteredParties.length}
            itemLabel="parties"
            onChange={setCurrentPage}
          />
        </div>
      )}
      </div>
    </section>
  );
}

function RegisterValue({ label, value, emphasized = false }) {
  return (
    <div>
      <p className="uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-0.5 font-mono-num ${
          emphasized ? "font-semibold text-slate-900" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
