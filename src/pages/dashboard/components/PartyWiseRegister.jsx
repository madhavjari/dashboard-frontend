import { fmtINR } from "../../../utils/format";

export default function PartyWiseRegister({ customers }) {
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
              <th className="py-2 text-right">Sales</th>
              <th className="py-2 text-right">Returns</th>
              <th className="py-2 text-right">Net Sales</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No customer sales data available.
              </p>
            ) : (
              customers.map((c) => (
                <tr key={c.party} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-900">{c.party}</td>
                  <td className="py-2 text-right text-gray-700">
                    {c.invoiceCount}
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {fmtINR(c.salesAmount)}
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {fmtINR(c.returnAmount)}
                  </td>
                  <td className="py-2 text-right text-gray-700">
                    {fmtINR(c.netSales)}
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
