import { Fragment, useMemo, useState } from "react";
import { fmtDateIN } from "../../../../utils/format";
import {
  getNumericQuantityForUnit,
  getUnitKey,
  getUnitLabel,
} from "../../../../utils/unitOfMeasure";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "../RegisterPagination";

const GROUP_THRESHOLD = 2;

function formatQuantity(transaction, fmtNumber) {
  return [fmtNumber(getNumericQuantityForUnit(transaction), 1), transaction.per]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .join(" ");
}

function formatInvoiceQuantity(items, fmtNumber) {
  const units = new Set(
    items.map((transaction) => getUnitKey(transaction.per)),
  );
  const everyItemHasUnit = items.every(
    (transaction) => getUnitKey(transaction.per) !== null,
  );

  if (!everyItemHasUnit || units.size !== 1) return "Mixed units";

  const totalQuantity = items.reduce(
    (total, transaction) =>
      total + getNumericQuantityForUnit(transaction),
    0,
  );
  const unit = getUnitLabel(items[0]?.per);
  return [fmtNumber(totalQuantity, 1), unit].join(" ");
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
        code: transaction.code,
        items: [],
        totalAmount: 0,
        originalIndex: index,
      });
    }

    const invoice = invoices.get(key);
    invoice.items.push(transaction);
    invoice.totalAmount += Number(transaction.totalAmount) || 0;
  });

  return Array.from(invoices.values()).sort((first, second) => {
    const firstTime = new Date(first.billDate).getTime();
    const secondTime = new Date(second.billDate).getTime();

    if (Number.isFinite(firstTime) && Number.isFinite(secondTime)) {
      return secondTime - firstTime;
    }

    return first.originalIndex - second.originalIndex;
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
          <div className="space-y-3 p-4 md:hidden">
            {visibleInvoices.map((invoice) =>
              invoice.items.length <= GROUP_THRESHOLD ? (
                invoice.items.map((transaction, index) => (
                  <TransactionCard
                    key={[invoice.key, index].join("-")}
                    transaction={transaction}
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
            <table className="w-full table-fixed text-sm">
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
                  <th className="px-5 py-3 text-right">Details</th>
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
          />
        </>
      )}
    </section>
  );
}

function TransactionCard({ transaction, fmtNumber, fmtINR }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="break-words text-sm font-semibold text-slate-900">
          {transaction.itemName}
        </p>
        <TransactionTypeBadge code={transaction.code} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
        <RegisterValue label="Date" value={fmtDateIN(transaction.billDate)} />
        <RegisterValue label="Invoice" value={transaction.billNo} />
        <RegisterValue
          label="Qty"
          value={formatQuantity(transaction, fmtNumber)}
        />
        <RegisterValue
          label="Amount"
          value={fmtINR(transaction.totalAmount)}
          emphasized
        />
      </div>
    </div>
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
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-slate-900">
            {invoice.billNo}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {fmtDateIN(invoice.billDate)} · {invoice.items.length} items
          </p>
        </div>
        <TransactionTypeBadge code={invoice.code} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 text-[11px]">
        <RegisterValue
          label="Qty"
          value={formatInvoiceQuantity(invoice.items, fmtNumber)}
        />
        <RegisterValue
          label="Amount"
          value={fmtINR(invoice.totalAmount)}
          emphasized
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
    </div>
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
          {formatInvoiceQuantity(invoice.items, fmtNumber)}
        </td>
        <td className="px-5 py-3 text-right font-mono font-medium">
          {fmtINR(invoice.totalAmount)}
        </td>
        <td className="px-5 py-3 text-center">
          <TransactionTypeBadge code={invoice.code} />
        </td>
        <td className="px-5 py-3 text-right">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {expanded ? "Hide" : "View"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="bg-slate-50 p-0">
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
      <col style={{ width: "13%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "27%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "9%" }} />
      <col style={{ width: "11%" }} />
    </>
  );
}

function RegisterValue({ label, value, emphasized = false }) {
  return (
    <div>
      <p className="uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={
          "mt-0.5 break-words font-mono-num " +
          (emphasized ? "font-semibold text-slate-900" : "text-slate-700")
        }
      >
        {value}
      </p>
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
