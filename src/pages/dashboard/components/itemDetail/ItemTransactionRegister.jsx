import { fmtDateIN } from "../../../../utils/format";
import { getNumericQuantityForUnit } from "../../../../utils/unitOfMeasure";

export default function ItemTransactionRegister({ transactions, fmtNumber, fmtINR }) {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-display text-sm font-bold text-slate-900">
          Transaction Register
        </h3>
      </div>
      <div className="space-y-3 p-4 md:hidden">
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No transactions available.
          </p>
        ) : (
          transactions.map((transaction, index) => (
            <div
              key={`${transaction.billNo}-${index}`}
              className="rounded-lg border border-slate-100 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="break-words text-sm font-semibold text-slate-900">
                  {transaction.party}
                </p>
                <TransactionTypeBadge
                  code={transaction.code}
                  isReturn={transaction.code.endsWith("R")}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <RegisterValue
                  label="Date"
                  value={fmtDateIN(transaction.billDate)}
                />
                <RegisterValue label="Invoice" value={transaction.billNo} />
                <RegisterValue
                  label="Qty"
                  value={`${fmtNumber(getNumericQuantityForUnit(transaction), 1)} ${transaction.per}`}
                />
                <RegisterValue
                  label="Amount"
                  value={fmtINR(transaction.totalAmount)}
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
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-sm text-slate-500"
                >
                  No transactions available.
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
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
                    {fmtNumber(getNumericQuantityForUnit(transaction), 1)}{" "}
                    {transaction.per}
                  </td>
                  <td className="px-5 py-3 text-right font-mono">
                    {fmtINR(transaction.totalAmount)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <TransactionTypeBadge
                      code={transaction.code}
                      isReturn={transaction.code.endsWith("R")}
                    />
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
        className={`mt-0.5 break-words font-mono-num ${
          emphasized ? "font-semibold text-slate-900" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TransactionTypeBadge({ code, isReturn }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        isReturn
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {code}
    </span>
  );
}
