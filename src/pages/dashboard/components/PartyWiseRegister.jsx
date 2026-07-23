import { fmtINR } from "../../../utils/format";
import { Link } from "react-router";

export default function PartyWiseRegister({ party, context }) {
  const dealer = context === "Sales" ? "customer" : "supplier";
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Party-wise Register
      </h3>
      <div className="overflow-x-auto">
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
              <p className="py-8 text-center text-sm text-gray-500">
                No customer {context.toLowerCase()} data available.
              </p>
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
