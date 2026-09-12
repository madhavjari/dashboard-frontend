import { useMemo, useState } from "react";
import { ArrowUpRight, Search, UsersRound, WalletCards, X } from "lucide-react";
import { fmtCompact, fmtINR } from "../../../../utils/format";
import { Link, useLocation } from "react-router";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "../RegisterPagination";

export default function PartyWiseRegister({ party, context }) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const isSales = context === "Sales";
  const dealer = isSales ? "customer" : "supplier";
  const dealerLabel = isSales ? "Customer" : "Supplier";
  const outstandingLabel = isSales ? "To collect" : "To pay";
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("net-desc");

  const summary = useMemo(
    () =>
      party.reduce(
        (totals, entry) => {
          const outstanding = Number(entry.outstandingAmount) || 0;
          totals.net += Number(entry.netAmount) || 0;
          totals.outstanding += Math.max(0, outstanding);
          if (outstanding > 0) totals.openBalances += 1;
          return totals;
        },
        { net: 0, outstanding: 0, openBalances: 0 },
      ),
    [party],
  );

  const filteredParties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? party.filter((entry) => entry.party.toLowerCase().includes(normalized))
      : [...party];

    return matches.sort((a, b) => {
      if (sort === "name") return a.party.localeCompare(b.party);
      if (sort === "outstanding-desc") {
        return Number(b.outstandingAmount) - Number(a.outstandingAmount);
      }
      if (sort === "invoices-desc") {
        return Number(b.invoiceCount) - Number(a.invoiceCount);
      }
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
  const partyUrl = (name) =>
    `${routePrefix}/${dealer}?party=${encodeURIComponent(name)}`;

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-950">
                {dealerLabel} performance
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {party.length} {party.length === 1 ? dealer : `${dealer}s`}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Compare net value and open balances, then open a ledger for detail.
            </p>
          </div>
        </div>

        <div
          className="mt-4 grid overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 sm:grid-cols-3"
          aria-label={`${dealerLabel} performance highlights`}
        >
          <Highlight
            label={`Total net ${context.toLowerCase()}`}
            value={fmtCompact(summary.net)}
            exactValue={fmtINR(summary.net)}
            tone="text-teal-700"
          />
          <Highlight
            label={outstandingLabel}
            value={fmtCompact(summary.outstanding)}
            exactValue={fmtINR(summary.outstanding)}
            tone={summary.outstanding > 0 ? "text-amber-700" : "text-slate-700"}
            icon={WalletCards}
          />
          <Highlight
            label="Needs attention"
            value={`${summary.openBalances} ${summary.openBalances === 1 ? "account" : "accounts"}`}
            detail={
              summary.openBalances > 0
                ? `with money ${isSales ? "to collect" : "to pay"}`
                : "no open balances"
            }
            tone={summary.openBalances > 0 ? "text-amber-700" : "text-emerald-700"}
            icon={UsersRound}
          />
        </div>

        <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search {dealer}</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
              placeholder={`Search ${dealer}`}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : null}
          </label>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-500">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setCurrentPage(1);
              }}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none sm:flex-none"
            >
              <option value="net-desc">Net value</option>
              <option value="outstanding-desc">Outstanding</option>
              <option value="invoices-desc">Invoices</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>

      {filteredParties.length > 0 ? (
        <RegisterPagination
          page={activePage}
          totalPages={totalPages}
          startIndex={startIndex}
          visibleCount={visibleParties.length}
          totalCount={filteredParties.length}
          itemLabel="parties"
          onChange={setCurrentPage}
          scrollTargetId={`${context.toLowerCase()}-party-register`}
          placement="top"
        />
      ) : null}

      <div
        id={`${context.toLowerCase()}-party-register`}
        className="scroll-mt-12 space-y-3 p-4 md:hidden"
      >
        {filteredParties.length === 0 ? (
          <EmptyState query={query} dealer={dealer} context={context} />
        ) : (
          visibleParties.map((entry, index) => (
            <article
              key={entry.party}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.03)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <Rank value={startIndex + index + 1} />
                  <div className="min-w-0">
                    <Link
                      to={partyUrl(entry.party)}
                      className="block break-words text-sm font-bold text-slate-950 hover:text-teal-700"
                    >
                      {entry.party}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {entry.invoiceCount} {Number(entry.invoiceCount) === 1 ? "invoice" : "invoices"}
                    </p>
                  </div>
                </div>
                <Link
                  to={partyUrl(entry.party)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                  aria-label={`Open ${entry.party} ledger`}
                >
                  <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-4 text-xs">
                <RegisterValue
                  label={`Net ${context}`}
                  value={fmtINR(entry.netAmount)}
                  tone="text-teal-700"
                  emphasized
                />
                <RegisterValue
                  label={outstandingLabel}
                  value={fmtINR(entry.outstandingAmount)}
                  tone={Number(entry.outstandingAmount) > 0 ? "text-amber-700" : "text-slate-600"}
                  emphasized={Number(entry.outstandingAmount) > 0}
                />
                <RegisterValue label={`Gross ${context}`} value={fmtINR(entry.grossAmount)} />
                <RegisterValue
                  label="Returns"
                  value={fmtINR(entry.returnAmount)}
                  tone={Number(entry.returnAmount) > 0 ? "text-rose-700" : "text-slate-600"}
                />
              </div>
            </article>
          ))
        )}
      </div>

      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
              <th className="w-14 px-5 py-3 text-center">#</th>
              <th className="px-3 py-3">{dealerLabel}</th>
              <th className="px-4 py-3 text-right">Invoices</th>
              <th className="px-4 py-3 text-right">Gross {context}</th>
              <th className="px-4 py-3 text-right">Returns</th>
              <th className="px-4 py-3 text-right">Net {context}</th>
              <th className="px-5 py-3 text-right">{outstandingLabel}</th>
              <th className="w-12 px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredParties.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <EmptyState query={query} dealer={dealer} context={context} />
                </td>
              </tr>
            ) : (
              visibleParties.map((entry, index) => (
                <tr
                  key={entry.party}
                  className="border-b border-slate-100 transition-colors hover:bg-teal-50/40"
                >
                  <td className="px-5 py-3.5 text-center">
                    <Rank value={startIndex + index + 1} />
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-slate-950">
                    <Link
                      to={partyUrl(entry.party)}
                      className="hover:text-teal-700 hover:underline"
                    >
                      {entry.party}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono-num text-slate-600">
                    {entry.invoiceCount}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono-num text-slate-600">
                    {fmtINR(entry.grossAmount)}
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono-num ${Number(entry.returnAmount) > 0 ? "text-rose-700" : "text-slate-500"}`}
                  >
                    {fmtINR(entry.returnAmount)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono-num font-bold text-teal-700">
                    {fmtINR(entry.netAmount)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <OutstandingValue
                      amount={entry.outstandingAmount}
                      label={outstandingLabel}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <Link
                      to={partyUrl(entry.party)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-teal-700"
                      aria-label={`Open ${entry.party} ledger`}
                      title={`Open ${dealer} ledger`}
                    >
                      <ArrowUpRight size={17} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredParties.length > 0 ? (
        <RegisterPagination
          page={activePage}
          totalPages={totalPages}
          startIndex={startIndex}
          visibleCount={visibleParties.length}
          totalCount={filteredParties.length}
          itemLabel="parties"
          onChange={setCurrentPage}
          scrollTargetId={`${context.toLowerCase()}-party-register`}
        />
      ) : null}
    </section>
  );
}

function Highlight({ label, value, exactValue, detail, tone, icon: Icon }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
        {Icon ? <Icon size={14} className="text-slate-400" /> : null}
        <span>{label}</span>
      </div>
      <p
        className={`mt-1.5 font-mono-num text-lg font-bold tracking-tight ${tone}`}
        title={exactValue}
      >
        {value}
      </p>
      {detail ? <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p> : null}
    </div>
  );
}

function Rank({ value }) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono-num text-xs font-bold ${
        value <= 3
          ? "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200"
          : "text-slate-400"
      }`}
    >
      {value}
    </span>
  );
}

function OutstandingValue({ amount, label }) {
  const numericAmount = Number(amount) || 0;

  if (numericAmount > 0) {
    return (
      <span
        className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 font-mono-num text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-200"
        title={`${label}: ${fmtINR(numericAmount)}`}
      >
        {fmtINR(numericAmount)}
      </span>
    );
  }

  return (
    <span className="font-mono-num text-sm font-medium text-slate-400">
      {fmtINR(numericAmount)}
    </span>
  );
}

function EmptyState({ query, dealer, context }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-sm font-semibold text-slate-800">
        {query ? `No ${dealer} matches “${query}”` : `No ${dealer} performance yet`}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {query
          ? "Try a different name or clear the search."
          : `There is no ${context.toLowerCase()} activity for the selected workspace and financial year.`}
      </p>
    </div>
  );
}

function RegisterValue({ label, value, emphasized = false, tone = "text-slate-700" }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 font-mono-num ${emphasized ? "font-bold" : "font-medium"} ${tone}`}
      >
        {value}
      </p>
    </div>
  );
}
