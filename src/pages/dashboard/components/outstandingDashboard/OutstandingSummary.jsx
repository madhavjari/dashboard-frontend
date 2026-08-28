import { Clock3, FileWarning, ReceiptIndianRupee, TimerReset } from "lucide-react";
import { getInvoiceAgeDays } from "../../../../utils/invoiceAge";

export default function OutstandingSummary({
  summary,
  fmtCompact,
  fmtINR,
  context,
  invoices,
}) {
  const outstandingLabel = context === "Sales" ? "Total to collect" : "Total to pay";
  const openInvoices = invoices.filter((invoice) => Number(invoice.amountOutstanding) > 0);
  const olderThan90 = openInvoices.filter((invoice) => getInvoiceAgeDays(invoice.billDate) > 90);
  const olderThan90Amount = olderThan90.reduce((total, invoice) => total + Number(invoice.amountOutstanding || 0), 0);
  const oldestAge = openInvoices.length ? Math.max(...openInvoices.map((invoice) => getInvoiceAgeDays(invoice.billDate))) : 0;
  const cards = [
    { label: outstandingLabel, value: fmtCompact(summary.totalOutstandingAmount), detail: `${summary.outstandingRate.toFixed(1)}% of net ${context.toLowerCase()}`, icon: ReceiptIndianRupee, tone: "text-slate-950", iconTone: "bg-teal-50 text-teal-700" },
    { label: "Invoice balance aged 90+", value: fmtCompact(olderThan90Amount), detail: `${olderThan90.length} open ${olderThan90.length === 1 ? "invoice" : "invoices"}${context === "Sales" ? " · before unlinked returns" : ""}`, icon: FileWarning, tone: olderThan90Amount ? "text-rose-700" : "text-slate-950", iconTone: olderThan90Amount ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500" },
    { label: "Oldest open invoice", value: openInvoices.length ? `${oldestAge} days` : "—", detail: "Age since invoice date", icon: Clock3, tone: oldestAge > 90 ? "text-amber-700" : "text-slate-950", iconTone: "bg-amber-50 text-amber-700" },
    { label: "Average payment time", value: summary.averagePaymentDays === null ? "—" : `${summary.averagePaymentDays.toFixed(1)} days`, detail: summary.partyPaymentCount ? `Across ${summary.partyPaymentCount} paid ${summary.partyPaymentCount === 1 ? "party" : "parties"}` : "No fully paid invoices", icon: TimerReset, tone: "text-slate-950", iconTone: "bg-slate-100 text-slate-600" },
  ];

  return (
    <section className="surface-card mb-6 overflow-hidden" aria-label="Outstanding summary">
      <div className="grid grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone, iconTone }, index) => (
          <article key={label} className={`p-5 sm:p-6 ${index ? "border-t border-slate-100 sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-t xl:border-t-0" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
              <span className={`rounded-lg p-2 ${iconTone}`}><Icon size={17} aria-hidden="true" /></span>
            </div>
            <p className={`mt-3 font-mono-num text-2xl font-bold tracking-tight ${tone}`}>{value}</p>
            <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
          </article>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 bg-slate-50/80 px-5 py-3 text-xs text-slate-600 sm:px-6">
        <span><strong className="font-semibold text-slate-800">Net {context.toLowerCase()}:</strong> {fmtINR(summary.netTransactionAmount)}</span>
        <span><strong className="font-semibold text-slate-800">Adjusted:</strong> {fmtINR(summary.totalAdjustedAmount)}</span>
        <span><strong className="font-semibold text-slate-800">Fully paid:</strong> {summary.paidInvoiceCount} invoices</span>
        {Number(summary.totalOverpaidAmount) > 0 ? <span><strong className="font-semibold text-teal-700">Overpaid:</strong> {fmtINR(summary.totalOverpaidAmount)}</span> : null}
      </div>
    </section>
  );
}
