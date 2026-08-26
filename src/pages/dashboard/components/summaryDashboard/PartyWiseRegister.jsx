import { useState } from "react";
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
  const totalPages = Math.max(
    1,
    Math.ceil(party.length / REGISTER_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * REGISTER_PAGE_SIZE;
  const visibleParties = party.slice(
    startIndex,
    startIndex + REGISTER_PAGE_SIZE,
  );
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Party-wise Register
      </h3>
      <div className="space-y-3 md:hidden">
        {party.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No {dealer} {context.toLowerCase()} data available.
          </p>
        ) : (
          visibleParties.map((entry) => (
            <div
              key={entry.party}
              className="rounded-lg border border-slate-100 p-3"
            >
              <Link
                to={`${routePrefix}/${dealer}?party=${entry.party}`}
                target="_blank"
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
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
              <th className="py-2">Party</th>
              <th className="py-2 text-right">Invoices</th>
              <th className="py-2 text-right">{context}</th>
              <th className="py-2 text-right">Returns</th>
              <th className="py-2 text-right">Net {context}</th>
              <th className="py-2 text-right">{outstandingLabel}</th>
            </tr>
          </thead>
          <tbody>
            {party.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-sm text-gray-500"
                >
                  No {dealer} {context.toLowerCase()} data available.
                </td>
              </tr>
            ) : (
              visibleParties.map((c) => (
                <tr key={c.party} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-900">
                    <Link to={`${routePrefix}/${dealer}?party=${c.party}`} target="_blank">
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
                  <td className="py-2 text-right font-semibold text-amber-700">
                    {fmtINR(c.outstandingAmount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {party.length > 0 && (
        <div className="-mx-5 -mb-5 mt-4">
          <RegisterPagination
            page={activePage}
            totalPages={totalPages}
            startIndex={startIndex}
            visibleCount={visibleParties.length}
            totalCount={party.length}
            itemLabel="parties"
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
        className={`mt-0.5 font-mono-num ${
          emphasized ? "font-semibold text-slate-900" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
