export default function OutstandingRegister({ invoices, fmtINR, context }) {
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";

  function getStatus(invoice) {
    if (invoice.overpaidAmount > 0) return "Overpaid";
    if (invoice.amountOutstanding === 0) return "Paid";
    return "Outstanding";
  }

  function getStatusClass(status) {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Overpaid") return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  }

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
              <th className="py-2 text-right">Adjusted</th>
              <th className="py-2 text-right">{outstandingLabel}</th>
              <th className="py-2 pl-4 text-right">Avg. Payment Days</th>
              <th className="py-2 pl-4 text-center">Status</th>
              <th className="py-2 pl-4">Payments</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-sm text-gray-500">
                  No {context.toLowerCase()} invoices available.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => {
                const status = getStatus(invoice);
                return (
                  <tr key={invoice.billNo} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-gray-700">
                      {new Date(invoice.billDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 font-mono text-gray-900">{invoice.billNo}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">{invoice.party}</td>
                    <td className="py-3 text-right text-gray-700">{fmtINR(invoice.billAmount)}</td>
                    <td className="py-3 text-right text-green-700">{fmtINR(invoice.adjustedAmount)}</td>
                    <td className="py-3 text-right font-medium text-amber-700">
                      {fmtINR(invoice.amountOutstanding)}
                    </td>
                    <td className="py-3 pl-4 text-right font-mono text-gray-700">
                      {typeof invoice.averagePaymentDays !== "number"
                        ? "—"
                        : `${invoice.averagePaymentDays.toFixed(1)} days`}
                    </td>
                    <td className="py-3 pl-4 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-3 pl-4">
                      {invoice.payments.length === 0 ? (
                        <span className="text-xs text-gray-400">No payment</span>
                      ) : (
                        <details className="text-xs text-gray-600">
                          <summary className="cursor-pointer text-blue-600">
                            {invoice.payments.length} payment{invoice.payments.length > 1 ? "s" : ""}
                          </summary>
                          <div className="mt-2 space-y-1 whitespace-nowrap">
                            {invoice.payments.map((payment, index) => (
                              <p key={`${payment.mode}-${index}`}>
                                {payment.mode} · {fmtINR(payment.adjustedAmount)} adjusted
                              </p>
                            ))}
                          </div>
                        </details>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
