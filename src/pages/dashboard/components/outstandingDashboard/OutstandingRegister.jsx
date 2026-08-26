import { useState } from "react";
import { fmtDateIN } from "../../../../utils/format";
import { Link, useLocation } from "react-router";
import RegisterPagination, {
  REGISTER_PAGE_SIZE,
} from "../RegisterPagination";

export default function OutstandingRegister({ invoices, fmtINR, context }) {
  const { pathname } = useLocation();
  const routePrefix = pathname.startsWith("/demo/") ? "/demo" : "";
  const dealer = context === "Sales" ? "customer" : "supplier";
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";
  const outstandingInvoices = invoices.filter(
    (invoice) => Number(invoice.amountOutstanding) > 0,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(outstandingInvoices.length / REGISTER_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleInvoices = outstandingInvoices.slice(
    startIndex,
    startIndex + REGISTER_PAGE_SIZE,
  );

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Invoice Register</h3>
        {context === "Sales" && (
          <p className="text-xs text-gray-500">
            Invoice balances exclude sales returns because returns are not linked to invoices.
          </p>
        )}
      </div>
      <div className="space-y-3 md:hidden">
        {outstandingInvoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No outstanding {context.toLowerCase()} invoices available.
          </p>
        ) : (
          visibleInvoices.map((invoice) => (
            <div
              key={invoice.billNo}
              className="rounded-lg border border-slate-100 p-3"
            >
              <Link
                to={`${routePrefix}/${dealer}?party=${invoice.party}`}
                target="_blank"
                className="block break-words text-sm font-semibold text-slate-900"
              >
                {invoice.party}
              </Link>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <RegisterValue
                  label="Date"
                  value={fmtDateIN(invoice.billDate)}
                />
                <RegisterValue label="Invoice" value={invoice.billNo} />
                <RegisterValue
                  label="Bill Amount"
                  value={fmtINR(invoice.billAmount)}
                />
                <RegisterValue
                  label={outstandingLabel}
                  value={fmtINR(invoice.amountOutstanding)}
                  emphasized
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Invoice</th>
              <th className="py-2 pr-4">Party</th>
              <th className="py-2 text-right">Bill Amount</th>
              <th className="py-2 text-right">{outstandingLabel}</th>
            </tr>
          </thead>
          <tbody>
            {outstandingInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  No outstanding {context.toLowerCase()} invoices available.
                </td>
              </tr>
            ) : (
              visibleInvoices.map((invoice) => (
                <tr key={invoice.billNo} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-700">{fmtDateIN(invoice.billDate)}</td>
                  <td className="py-3 pr-4 font-mono text-gray-900">{invoice.billNo}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    <Link
                      to={`${routePrefix}/${dealer}?party=${invoice.party}`}
                      target="_blank"
                    >
                      {invoice.party}
                    </Link>
                  </td>
                  <td className="py-3 text-right text-gray-700">{fmtINR(invoice.billAmount)}</td>
                  <td className="py-3 text-right font-medium text-amber-700">
                    {fmtINR(invoice.amountOutstanding)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {outstandingInvoices.length > 0 && (
        <div className="-mx-5 -mb-5 mt-4">
          <RegisterPagination
            page={activePage}
            totalPages={totalPages}
            startIndex={startIndex}
            visibleCount={visibleInvoices.length}
            totalCount={outstandingInvoices.length}
            itemLabel="invoices"
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

function RegisterValue({ label, value, emphasized = false }) {
  return (
    <div>
      <p className="uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-0.5 break-words font-mono-num ${
          emphasized ? "font-semibold text-amber-700" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
