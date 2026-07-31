export default function ItemTransactionRegister({ transactions, fmtNumber, fmtINR }) {
  function getQuantity(transaction) {
    if (transaction.per === "W") return transaction.weight;
    if (transaction.per === "M") return transaction.meters;
    return transaction.pcs;
  }

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-display text-sm font-bold text-slate-900">
          Transaction Register
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Party</th>
              <th className="px-5 py-3 text-right">Qty</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-center">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={`${transaction.billNo}-${index}`}
                className="border-b border-slate-50 hover:bg-slate-50/60"
              >
                <td className="px-5 py-3">
                  {fmtDateIN(transaction.billDate)}
                </td>
                <td className="px-5 py-3 font-mono">{transaction.billNo}</td>
                <td className="px-5 py-3">{transaction.party}</td>
                <td className="px-5 py-3 text-right font-mono">
                  {fmtNumber(getQuantity(transaction), 1)} {transaction.per}
                </td>
                <td className="px-5 py-3 text-right font-mono">
                  {fmtINR(transaction.totalAmount)}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      transaction.code.endsWith("R")
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {transaction.code}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { fmtDateIN } from "../../../../utils/format";
