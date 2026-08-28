import StatCard from "../../../../components/dashboard/StatCard";

export default function CustomerSummary({
  summary,
  fmtCompact,
  fmtINR,
  context,
  outstandingAmount,
  averagePaymentDays,
  paidInvoiceCount,
}) {
  const isSales = context === "Sales";
  const outstandingLabel = isSales ? "To Collect" : "To Pay";

  return (
    <section className="metric-group mb-6 grid grid-cols-2 sm:grid-cols-3" aria-label={`${context} party summary`}>
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.grossAmount)}
        sub={`${summary.invoiceCount} invoices before returns`}
        exactValue={fmtINR(summary.grossAmount)}
        grouped
      />
      <StatCard
        label="Total Returns"
        value={fmtCompact(summary.returnAmount)}
        sub="deducted from gross activity"
        exactValue={fmtINR(summary.returnAmount)}
        tone="text-rose-700"
        grouped
      />
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netAmount)}
        sub="after returns"
        exactValue={fmtINR(summary.netAmount)}
        grouped
      />
      <StatCard
        label="Invoices"
        value={summary.invoiceCount}
        sub="total bills"
        grouped
      />
      <StatCard
        label={outstandingLabel}
        value={fmtCompact(outstandingAmount)}
        sub="open balance"
        exactValue={fmtINR(outstandingAmount)}
        tone="text-amber-700"
        grouped
      />
      <StatCard
        label="Average Payment Days"
        value={
          averagePaymentDays === null
            ? "—"
            : `${averagePaymentDays.toFixed(1)} days`
        }
        sub={
          paidInvoiceCount
            ? `${paidInvoiceCount} paid invoice${paidInvoiceCount === 1 ? "" : "s"} · invoice to final payment`
            : "No paid invoices"
        }
        grouped
      />
    </section>
  );
}
