import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import InvoiceCard from "../../../../components/dashboard/InvoiceCard";
import { fmtDateIN } from "../../../../utils/format";
import {
  getNumericQuantityForUnit,
  getUnitLabel,
} from "../../../../utils/unitOfMeasure";
import RegisterPagination, { REGISTER_PAGE_SIZE } from "../RegisterPagination";

export default function ItemTransactionRegister({
  transactions,
  fmtNumber,
  fmtINR,
}) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? transactions.filter((transaction) =>
          `${transaction.party} ${transaction.billNo} ${transaction.code}`
            .toLowerCase()
            .includes(normalized),
        )
      : transactions;
  }, [query, transactions]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / REGISTER_PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + REGISTER_PAGE_SIZE);

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Transaction register
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {filtered.length} of {transactions.length} transactions
          </p>
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Search party, invoice, or type</span>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search party, invoice, or type"
            className="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-8 text-sm outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>
      </div>

      {filtered.length ? (
        <RegisterPagination
          page={activePage}
          totalPages={totalPages}
          startIndex={startIndex}
          visibleCount={visible.length}
          totalCount={filtered.length}
          itemLabel="transactions"
          onChange={setCurrentPage}
          scrollTargetId="item-transaction-register"
          placement="top"
        />
      ) : null}

      <div
        id="item-transaction-register"
        className="scroll-mt-12 space-y-3 p-4 md:hidden"
      >
        {visible.length ? (
          visible.map((transaction, index) => (
            <InvoiceCard
              key={`${transaction.billNo}-${startIndex + index}`}
              invoiceNumber={transaction.billNo}
              billDate={transaction.billDate}
              date={fmtDateIN(transaction.billDate)}
              title={transaction.party}
              subtitle={transaction.itemName}
              quantity={`${fmtNumber(getNumericQuantityForUnit(transaction), 1)} ${getUnitLabel(transaction.per)}`}
              type={transaction.code}
              amount={fmtINR(transaction.totalAmount)}
              status={transaction.paymentStatus}
              statusDays={transaction.statusDays}
            />
          ))
        ) : (
          <Empty query={query} />
        )}
      </div>

      <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Party</th>
              <th className="px-5 py-3 text-right">Quantity</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-center">Type</th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.length ? (
              visible.map((transaction, index) => (
                <tr
                  key={`${transaction.billNo}-${startIndex + index}`}
                  className="border-b border-slate-100 transition hover:bg-teal-50/40"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                    {fmtDateIN(transaction.billDate)}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-800">
                    {transaction.billNo}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {transaction.party}
                  </td>
                  <td className="px-5 py-3 text-right font-mono-num text-slate-700">
                    {fmtNumber(getNumericQuantityForUnit(transaction), 1)} {getUnitLabel(transaction.per)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono-num font-semibold text-slate-950">
                    {fmtINR(transaction.totalAmount)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <TransactionTypeBadge code={transaction.code} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TransactionStatus
                      status={transaction.paymentStatus}
                      days={transaction.statusDays}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <Empty query={query} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length ? (
        <RegisterPagination
          page={activePage}
          totalPages={totalPages}
          startIndex={startIndex}
          visibleCount={visible.length}
          totalCount={filtered.length}
          itemLabel="transactions"
          onChange={setCurrentPage}
          scrollTargetId="item-transaction-register"
        />
      ) : null}
    </section>
  );
}

function TransactionStatus({ status, days }) {
  if (!status) return <span className="text-slate-400">—</span>;

  const badgeClass =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-rose-50 text-rose-700 ring-rose-200";
  const daysClass = status === "Paid" ? "text-emerald-700" : "text-rose-700";
  const showDays =
    days !== null && days !== undefined && Number.isFinite(Number(days));

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${badgeClass}`}
      >
        {status}
      </span>
      {showDays ? (
        <span className={`whitespace-nowrap text-[10px] font-medium ${daysClass}`}>
          {days} {Number(days) === 1 ? "day" : "days"}
        </span>
      ) : null}
    </div>
  );
}

function Empty({ query }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-semibold text-slate-800">
        {query ? "No transactions match your search" : "No transactions available"}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {query
          ? "Try another party, invoice number, or type."
          : "There is no activity for the selected workspace and year."}
      </p>
    </div>
  );
}

function TransactionTypeBadge({ code }) {
  const isReturn = String(code || "").endsWith("R");

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
        isReturn
          ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
          : "bg-slate-100 text-slate-700"
      }`}
      title={isReturn ? "Return transaction" : "Sale or purchase transaction"}
    >
      {code}
    </span>
  );
}
