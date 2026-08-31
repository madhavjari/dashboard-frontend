import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Error from "../../components/dashboard/Error";
import Loading from "../../components/dashboard/Loading";
import useOutstandingData from "../../utils/fetch/outstandingData";
import { fmtDateIN, fmtINR } from "../../utils/format";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "./components/RegisterPagination";

const statusOptions = ["All statuses", "Paid", "Unpaid"];

function getStatus(invoice) {
  return Number(invoice.amountOutstanding) <= 0 ? "Paid" : "Unpaid";
}

function StatusBadge({ status }) {
  const className =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-amber-50 text-amber-800 ring-amber-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {status}
    </span>
  );
}

function Items({ itemNames }) {
  if (!itemNames?.length) return <span className="text-slate-400">No item name</span>;

  return (
    <span title={itemNames.join(", ")}>
      {itemNames.join(", ")}
    </span>
  );
}

export default function InvoiceDashboard({ INVOICES_URL, context }) {
  const isSales = context === "Sales";
  const reportName = isSales ? "Sales invoices" : "Purchase invoices";
  const partyLabel = isSales ? "customer" : "supplier";
  const { summary, invoices, status, message, reload } = useOutstandingData(
    INVOICES_URL,
    context,
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const invoiceRows = useMemo(
    () =>
      invoices.map((invoice) => ({
        ...invoice,
        paymentStatus: getStatus(invoice),
      })),
    [invoices],
  );

  const filteredInvoices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const rows = invoiceRows.filter((invoice) => {
      const searchable = `${invoice.billNo ?? ""} ${invoice.party ?? ""} ${(
        invoice.itemNames ?? []
      ).join(" ")}`.toLowerCase();
      const matchesQuery = !normalized || searchable.includes(normalized);
      const matchesStatus =
        statusFilter === "All statuses" ||
        invoice.paymentStatus === statusFilter;
      return matchesQuery && matchesStatus;
    });

    rows.sort((first, second) => {
      if (sort === "highest") {
        return Number(second.billAmount) - Number(first.billAmount);
      }
      const firstDate = new Date(first.billDate).getTime() || 0;
      const secondDate = new Date(second.billDate).getTime() || 0;
      return sort === "oldest" ? firstDate - secondDate : secondDate - firstDate;
    });
    return rows;
  }, [invoiceRows, query, sort, statusFilter]);

  if (status === "loading") {
    return <Loading message={message} header={reportName} />;
  }

  if (status === "error") {
    return <Error message={message} header={reportName} reload={reload} />;
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / REGISTER_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + REGISTER_PAGE_SIZE,
  );
  const hasFilters = Boolean(query) || statusFilter !== "All statuses";

  function clearFilters() {
    setQuery("");
    setStatusFilter("All statuses");
    setCurrentPage(1);
  }

  return (
    <main className="app-page">
      <div className="app-page-inner">
        <header className="mb-7">
          <p className="text-sm font-semibold text-teal-700">{context}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            All invoices
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Bill, item, {partyLabel}, value, and payment status for the selected financial year
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total invoices" value={summary.invoiceCount} />
          <SummaryCard label="Paid" value={summary.paidInvoiceCount} tone="paid" />
          <SummaryCard
            label="Unpaid"
            value={summary.outstandingInvoiceCount}
            tone="unpaid"
          />
        </div>

        <section className="surface-card overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Invoice register</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredInvoices.length} of {invoiceRows.length} invoices shown
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(14rem,1fr)_auto_auto]">
              <label className="relative block">
                <span className="sr-only">Search invoice, party, or item</span>
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search invoice, party, or item"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                ) : null}
              </label>
              <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700">
                <SlidersHorizontal size={16} className="text-slate-400" />
                <span className="sr-only">Filter by payment status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent font-medium outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700">
                <span className="text-xs font-medium text-slate-500">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent font-semibold outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="highest">Highest value</option>
                </select>
              </label>
            </div>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                <X size={14} /> Clear all filters
              </button>
            ) : null}
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {visibleInvoices.length ? (
              visibleInvoices.map((invoice, index) => (
                <article
                  key={`${invoice.billNo}-${invoice.party}-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-slate-900">
                        {invoice.billNo || "No bill number"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {fmtDateIN(invoice.billDate)}
                      </p>
                    </div>
                    <StatusBadge status={invoice.paymentStatus} />
                  </div>
                  <dl className="mt-4 grid gap-3 text-xs">
                    <MobileValue label="Party" value={invoice.party || "No party name"} />
                    <MobileValue
                      label="Items"
                      value={<Items itemNames={invoice.itemNames} />}
                    />
                    <MobileValue label="Value" value={fmtINR(invoice.billAmount)} strong />
                  </dl>
                </article>
              ))
            ) : (
              <EmptyState
                hasFilters={hasFilters}
                onClear={clearFilters}
                context={context}
              />
            )}
          </div>

          <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                  <th className="px-6 py-3">Bill no.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Item name</th>
                  <th className="px-4 py-3">Party name</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.length ? (
                  visibleInvoices.map((invoice, index) => (
                    <tr
                      key={`${invoice.billNo}-${invoice.party}-${index}`}
                      className="border-b border-slate-100 transition hover:bg-teal-50/40"
                    >
                      <td className="px-6 py-3.5 font-mono text-xs font-semibold text-slate-900">
                        {invoice.billNo || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                        {fmtDateIN(invoice.billDate)}
                      </td>
                      <td className="max-w-xs px-4 py-3.5 text-slate-700">
                        <Items itemNames={invoice.itemNames} />
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">
                        {invoice.party || "-"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono-num font-semibold text-slate-900">
                        {fmtINR(invoice.billAmount)}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <StatusBadge status={invoice.paymentStatus} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        hasFilters={hasFilters}
                        onClear={clearFilters}
                        context={context}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length ? (
            <RegisterPagination
              page={activePage}
              totalPages={totalPages}
              startIndex={startIndex}
              visibleCount={visibleInvoices.length}
              totalCount={filteredInvoices.length}
              itemLabel="invoices"
              onChange={setCurrentPage}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, tone }) {
  const valueClass =
    tone === "paid"
      ? "text-emerald-700"
      : tone === "unpaid"
        ? "text-amber-800"
        : "text-slate-950";

  return (
    <div className="surface-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold font-mono-num ${valueClass}`}>
        {Number(value) || 0}
      </p>
    </div>
  );
}

function MobileValue({ label, value, strong = false }) {
  return (
    <div>
      <dt className="uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className={`mt-1 break-words ${strong ? "font-bold text-slate-950" : "text-slate-700"}`}>
        {value}
      </dd>
    </div>
  );
}

function EmptyState({ hasFilters, onClear, context }) {
  const isSales = context === "Sales";
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-sm font-semibold text-slate-800">
        {hasFilters
          ? "No invoices match these filters"
          : `No ${isSales ? "sales" : "purchase"} invoices found`}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {hasFilters
          ? "Try a different invoice number, party, item, or payment status."
          : "There are no invoices in the selected workspace and financial year."}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
