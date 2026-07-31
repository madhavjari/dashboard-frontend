import { fmtINR } from "../../../../utils/format";
import { Link } from "react-router";

export default function PartyWiseRegister({ party, context }) {
  const dealer = context === "Sales" ? "customer" : "supplier";
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
          party.map((entry) => (
            <div
              key={entry.party}
              className="rounded-lg border border-slate-100 p-3"
            >
              <Link
                to={`/${dealer}?party=${entry.party}`}
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
            </tr>
          </thead>
          <tbody>
            {party.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-sm text-gray-500"
                >
                  No {dealer} {context.toLowerCase()} data available.
                </td>
              </tr>
            ) : (
              party.map((c) => (
                <tr key={c.party} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-900">
                    <Link to={`/${dealer}?party=${c.party}`} target="_blank">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
