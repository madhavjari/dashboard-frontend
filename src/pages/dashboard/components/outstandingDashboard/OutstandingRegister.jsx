import { fmtDateIN } from "../../../../utils/format";

export default function OutstandingRegister({ invoices, fmtINR, context }) {
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";
  const outstandingInvoices = invoices.filter(
    (invoice) => Number(invoice.amountOutstanding) > 0,
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
      <div className="overflow-x-auto">
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
              outstandingInvoices.map((invoice) => (
                <tr key={invoice.billNo} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-700">{fmtDateIN(invoice.billDate)}</td>
                  <td className="py-3 pr-4 font-mono text-gray-900">{invoice.billNo}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{invoice.party}</td>
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
    </div>
  );
}
