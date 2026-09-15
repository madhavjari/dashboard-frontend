import { Fragment, useMemo, useState } from "react";
import InvoiceCard from "../../../../components/dashboard/InvoiceCard";
import { fmtDateIN } from "../../../../utils/format";
import {
  getNumericQuantityForUnit,
  getUnitLabel,
} from "../../../../utils/unitOfMeasure";
import { formatInvoiceQuantity as formatGroupedInvoiceQuantity } from "../../../../utils/invoiceQuantity";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "../RegisterPagination";

const GROUP_THRESHOLD = 2;

function formatQuantity(transaction, fmtNumber) {
  return [
    fmtNumber(getNumericQuantityForUnit(transaction), 1),
    getUnitLabel(transaction.per),
  ]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .join(" ");
}

function groupByInvoice(transactions) {
  const invoices = new Map();

  transactions.forEach((transaction, index) => {
    const key = [
      transaction.billNo || "Unnumbered",
      transaction.billDate || "",
      transaction.code || "",
    ].join("|");

    if (!invoices.has(key)) {
      invoices.set(key, {
        key,
        billNo: transaction.billNo || "Unnumbered",
        billDate: transaction.billDate,
        party: transaction.party,
        code: transaction.code,
        paymentStatus: transaction.paymentStatus,
        statusDays: transaction.statusDays,
        outstandingAmount: transaction.invoiceOutstandingAmount,
        items: [],
        totalAmount: 0,
        originalIndex: index,
      });
    }

    const invoice = invoices.get(key);
    invoice.items.push(transaction);
    invoice.totalAmount += Number(transaction.totalAmount) || 0;
    if (invoice.paymentStatus !== transaction.paymentStatus) {
      invoice.paymentStatus = null;
    }
    if (invoice.statusDays !== transaction.statusDays) {
      invoice.statusDays = null;
    }
  });

  const orderedInvoices = Array.from(invoices.values()).sort((first, second) => {
    const firstTime = new Date(first.billDate).getTime();
    const secondTime = new Date(second.billDate).getTime();

    if (Number.isFinite(firstTime) && Number.isFinite(secondTime)) {
      return firstTime - secondTime;
    }

    return first.originalIndex - second.originalIndex;
  });

  let runningBalance = 0;
  return orderedInvoices.map((invoice) => {
    runningBalance += Math.max(0, Number(invoice.outstandingAmount) || 0);
    return { ...invoice, runningBalance };
  });
}

function invoiceMatchesSearch(invoice, searchTerm) {
  if (!searchTerm) return true;

  return (
    String(invoice.billNo).toLowerCase().includes(searchTerm) ||
    String(invoice.code || "")
      .toLowerCase()
      .includes(searchTerm) ||
    invoice.items.some((transaction) =>
      String(transaction.itemName || "")
        .toLowerCase()
        .includes(searchTerm),
    )
  );
}

export default function TransactionRegister({
  transactions,
  fmtNumber,
  fmtINR,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedInvoice, setExpandedInvoice] = useState(null);

  const invoiceGroups = useMemo(
    () => groupByInvoice(transactions || []),
    [transactions],
  );
  const searchTerm = searchQuery.trim().toLowerCase();
  const filteredInvoices = useMemo(
    () =>
      invoiceGroups.filter((invoice) =>
        invoiceMatchesSearch(invoice, searchTerm),
      ),
    [invoiceGroups, searchTerm],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / REGISTER_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const firstInvoiceIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleInvoices = filteredInvoices.slice(
    firstInvoiceIndex,
    firstInvoiceIndex + REGISTER_PAGE_SIZE,
  );

  function toggleInvoice(key) {
    setExpandedInvoice((current) => (current === key ? null : key));
  }

  function changePage(page) {
    setCurrentPage(page);
    setExpandedInvoice(null);
  }

  function changeSearch(event) {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    setExpandedInvoice(null);
  }

  const emptyMessage = invoiceGroups.length
    ? "No invoices match your search."
    : "No transactions available.";

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900">
              Transaction Register
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {invoiceGroups.length}{" "}
              {invoiceGroups.length === 1 ? "invoice" : "invoices"} ·{" "}
              {transactions.length} line items
            </p>
          </div>
          <label className="block w-full sm:w-72">
            <span className="sr-only">Search invoices or items</span>
            <input
              type="search"
              value={searchQuery}
              onChange={changeSearch}
              placeholder="Search invoice or item"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
            />
          </label>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <>
          <RegisterPagination
            page={activePage}
            totalPages={totalPages}
            startIndex={firstInvoiceIndex}
            visibleCount={visibleInvoices.length}
            totalCount={filteredInvoices.length}
            itemLabel="invoices"
            onChange={changePage}
            scrollTargetId="party-transaction-register"
            placement="top"
          />
          <div
            id="party-transaction-register"
            className="scroll-mt-12 space-y-3 p-4 md:hidden"
          >
            {visibleInvoices.map((invoice) =>
              invoice.items.length <= GROUP_THRESHOLD ? (
                invoice.items.map((transaction, index) => (
                  <TransactionCard
                    key={[invoice.key, index].join("-")}
                    transaction={transaction}
                    runningBalance={index === 0 ? invoice.runningBalance : null}
                    fmtNumber={fmtNumber}
                    fmtINR={fmtINR}
                  />
                ))
              ) : (
                <GroupedInvoiceCard
                  key={invoice.key}
                  invoice={invoice}
                  expanded={expandedInvoice === invoice.key}
                  onToggle={() => toggleInvoice(invoice.key)}
                  fmtNumber={fmtNumber}
                  fmtINR={fmtINR}
                />
              ),
            )}
          </div>

          <div className="table-scroll hidden max-h-[42rem] overflow-auto md:block">
            <table className="w-full min-w-[1100px] table-fixed text-sm">
              <colgroup>
                <InvoiceTableColumns />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-center">Type</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Running balance</th>
                  <th className="px-5 py-3 text-right">Items</th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.map((invoice) => (
                  <InvoiceRows
                    key={invoice.key}
                    invoice={invoice}
                    expanded={expandedInvoice === invoice.key}
                    onToggle={() => toggleInvoice(invoice.key)}
                    fmtNumber={fmtNumber}
                    fmtINR={fmtINR}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <RegisterPagination
            page={activePage}
            totalPages={totalPages}
            startIndex={firstInvoiceIndex}
            visibleCount={visibleInvoices.length}
            totalCount={filteredInvoices.length}
            itemLabel="invoices"
            onChange={changePage}
            scrollTargetId="party-transaction-register"
          />
        </>
      )}
    </section>
  );
}

function TransactionCard({ transaction, runningBalance, fmtNumber, fmtINR }) {
  return (
    <InvoiceCard
      invoiceNumber={transaction.billNo}
      billDate={transaction.billDate}
      date={fmtDateIN(transaction.billDate)}
      title={transaction.party}
      subtitle={transaction.itemName}
      quantity={formatQuantity(transaction, fmtNumber)}
      type={transaction.code}
      amount={fmtINR(transaction.totalAmount)}
      status={transaction.paymentStatus}
      statusDays={transaction.statusDays}
      runningBalance={
        runningBalance === null || runningBalance === undefined
          ? undefined
          : fmtINR(runningBalance)
      }
    />
  );
}

function GroupedInvoiceCard({
  invoice,
  expanded,
  onToggle,
  fmtNumber,
  fmtINR,
}) {
  return (
    <InvoiceCard
      invoiceNumber={invoice.billNo}
      billDate={invoice.billDate}
      date={fmtDateIN(invoice.billDate)}
      title={invoice.party}
      subtitle={`${invoice.items.length} items`}
      quantity={formatGroupedInvoiceQuantity(invoice.items, fmtNumber)}
      type={invoice.code}
      amount={fmtINR(invoice.totalAmount)}
      status={invoice.paymentStatus}
      statusDays={invoice.statusDays}
      runningBalance={fmtINR(invoice.runningBalance)}
    >
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          {expanded ? "Hide items" : "View items"}
        </button>
      </div>
      {expanded && (
        <InvoiceItemLines
          items={invoice.items}
          fmtNumber={fmtNumber}
          fmtINR={fmtINR}
        />
      )}
    </InvoiceCard>
  );
}

function InvoiceRows({ invoice, expanded, onToggle, fmtNumber, fmtINR }) {
  if (invoice.items.length <= GROUP_THRESHOLD) {
    return invoice.items.map((transaction, index) => (
      <tr
        key={[invoice.key, index].join("-")}
        className="border-b border-slate-50 hover:bg-slate-50/60"
      >
        <td className="px-5 py-3">{fmtDateIN(transaction.billDate)}</td>
        <td className="px-5 py-3 font-mono">{transaction.billNo}</td>
        <td className="px-5 py-3">{transaction.itemName}</td>
        <td className="px-5 py-3 text-right font-mono">
          {formatQuantity(transaction, fmtNumber)}
        </td>
        <td className="px-5 py-3 text-right font-mono">
          {fmtINR(transaction.totalAmount)}
        </td>
        <td className="px-5 py-3 text-center">
          <TransactionTypeBadge code={transaction.code} />
        </td>
        {index === 0 ? (
          <>
            <td
              rowSpan={invoice.items.length}
              className="px-3 py-3 text-center align-middle"
            >
              <TransactionStatus
                status={invoice.paymentStatus}
                days={invoice.statusDays}
              />
            </td>
            <td
              rowSpan={invoice.items.length}
              className="whitespace-nowrap px-4 py-3 text-right align-middle font-mono-num text-xs font-semibold text-slate-800"
            >
              {fmtINR(invoice.runningBalance)}
            </td>
          </>
        ) : null}
        <td aria-hidden="true" />
      </tr>
    ));
  }

  return (
    <Fragment>
      <tr className="border-b border-slate-100 bg-slate-50/50">
        <td className="px-5 py-3">{fmtDateIN(invoice.billDate)}</td>
        <td className="px-5 py-3 font-mono font-medium">{invoice.billNo}</td>
        <td className="px-5 py-3 font-medium text-slate-900">
          {invoice.items.length} items
        </td>
        <td className="px-5 py-3 text-right font-mono">
          {formatGroupedInvoiceQuantity(invoice.items, fmtNumber)}
        </td>
        <td className="px-5 py-3 text-right font-mono font-medium">
          {fmtINR(invoice.totalAmount)}
        </td>
        <td className="px-5 py-3 text-center">
          <TransactionTypeBadge code={invoice.code} />
        </td>
        <td className="px-3 py-3 text-center">
          <TransactionStatus
            status={invoice.paymentStatus}
            days={invoice.statusDays}
          />
        </td>
        <td className="whitespace-nowrap px-4 py-3 text-right font-mono-num text-xs font-semibold text-slate-800">
          {fmtINR(invoice.runningBalance)}
        </td>
        <td className="px-5 py-3 text-right">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {expanded ? "Hide items" : "View items"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} className="bg-slate-50 p-0">
            <DesktopInvoiceItemLines
              items={invoice.items}
              fmtNumber={fmtNumber}
              fmtINR={fmtINR}
            />
          </td>
        </tr>
      )}
    </Fragment>
  );
}

function InvoiceItemLines({ items, fmtNumber, fmtINR }) {
  return (
    <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-slate-200 bg-white">
      {items.map((transaction, index) => (
        <div
          key={[transaction.itemName, index].join("-")}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-slate-100 px-3 py-2.5 last:border-0"
        >
          <p className="break-words text-sm font-medium text-slate-800">
            {transaction.itemName}
          </p>
          <p className="text-right font-mono-num text-xs text-slate-500">
            {formatQuantity(transaction, fmtNumber)}
          </p>
          <p className="col-span-2 text-right font-mono-num text-sm text-slate-700">
            {fmtINR(transaction.totalAmount)}
          </p>
        </div>
      ))}
    </div>
  );
}

function DesktopInvoiceItemLines({ items, fmtNumber, fmtINR }) {
  return (
    <div className="max-h-80 overflow-y-auto border-b border-slate-200 bg-white">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <InvoiceTableColumns />
        </colgroup>
        <tbody>
          {items.map((transaction, index) => (
            <tr
              key={[transaction.itemName, index].join("-")}
              className="border-b border-slate-100 last:border-0"
            >
              <td aria-hidden="true" />
              <td aria-hidden="true" />
              <td className="break-words px-5 py-2.5 font-medium text-slate-800">
                {transaction.itemName}
              </td>
              <td className="px-5 py-2.5 text-right font-mono text-slate-600">
                {formatQuantity(transaction, fmtNumber)}
              </td>
              <td className="px-5 py-2.5 text-right font-mono text-slate-700">
                {fmtINR(transaction.totalAmount)}
              </td>
              <td aria-hidden="true" />
              <td aria-hidden="true" />
              <td aria-hidden="true" />
              <td aria-hidden="true" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvoiceTableColumns() {
  return (
    <>
      <col style={{ width: "12%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "17%" }} />
      <col style={{ width: "9%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "10%" }} />
    </>
  );
}

function TransactionStatus({ status, days }) {
  if (!status) return <span className="text-slate-400">—</span>;

  const badgeClass =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-rose-50 text-rose-700 ring-rose-200";
  const daysClass = status === "Paid" ? "text-emerald-700" : "text-rose-700";
  const showDays = days !== null && days !== undefined && Number.isFinite(Number(days));

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${badgeClass}`}>
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

function TransactionTypeBadge({ code }) {
  const isReturn = String(code || "").endsWith("R");

  return (
    <span
      className={
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium " +
        (isReturn ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200" : "bg-slate-100 text-slate-700")
      }
      title={isReturn ? "Return transaction" : "Sale or purchase transaction"}
    >
      {code}
    </span>
  );
}
