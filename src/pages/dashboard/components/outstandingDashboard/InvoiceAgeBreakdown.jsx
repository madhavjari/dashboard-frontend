import { Clock3 } from "lucide-react";
import ChartCard from "../../../../components/dashboard/ChartCard";
import { fmtCompact, fmtINR } from "../../../../utils/format";
import { getAgeBand, getInvoiceAgeDays } from "../../../../utils/invoiceAge";

const bands = [
  { label: "0–30 days", tone: "bg-teal-500" },
  { label: "31–60 days", tone: "bg-amber-400" },
  { label: "61–90 days", tone: "bg-orange-500" },
  { label: "90+ days", tone: "bg-rose-600" },
];

export default function InvoiceAgeBreakdown({ invoices, context }) {
  const rows = bands.map((band) => {
    const matching = invoices.filter(
      (invoice) => getAgeBand(getInvoiceAgeDays(invoice.billDate)) === band.label && Number(invoice.amountOutstanding) > 0,
    );
    return {
      ...band,
      amount: matching.reduce((total, invoice) => total + Number(invoice.amountOutstanding || 0), 0),
      count: matching.length,
    };
  });
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const noun = context === "Sales" ? "receivable" : "payable";

  return (
    <ChartCard
      title="Invoice age"
      subtitle={`How long open ${noun}s have been on the books`}
      action={<Clock3 size={18} className="text-slate-400" aria-hidden="true" />}
    >
      {total ? (
        <>
          <div className="mb-5 flex h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            {rows.map((row) => (
              <span key={row.label} className={row.tone} style={{ width: `${(row.amount / total) * 100}%` }} />
            ))}
          </div>
          <div className="space-y-1">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${row.tone}`} />
                  <span className="text-sm font-medium text-slate-700">{row.label}</span>
                  <span className="text-xs text-slate-400">{row.count} {row.count === 1 ? "invoice" : "invoices"}</span>
                </div>
                <span className="font-mono-num text-sm font-semibold text-slate-900" title={fmtINR(row.amount)}>{fmtCompact(row.amount)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
            Age is measured from the invoice date. Contractual due dates are not available.{context === "Sales" ? " Invoice-level balances are shown before unlinked sales returns, so they may not reconcile to net receivables." : ""}
          </p>
        </>
      ) : (
        <div className="flex min-h-56 items-center justify-center text-sm text-slate-500">No open invoices to age.</div>
      )}
    </ChartCard>
  );
}
