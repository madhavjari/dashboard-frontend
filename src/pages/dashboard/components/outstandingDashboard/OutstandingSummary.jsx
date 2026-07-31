import StatCard from "../../../../components/dashboard/StatCard";

export default function OutstandingSummary({
  summary,
  fmtCompact,
  fmtINR,
  context,
}) {
  const outstandingLabel =
    context === "Sales" ? "Amount to Collect" : "Amount to Pay";

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netTransactionAmount)}
        sub={`${fmtINR(summary.netTransactionAmount)} after returns`}
      />
      <StatCard
        label="Adjusted Amount"
        value={fmtCompact(summary.totalAdjustedAmount)}
        sub={fmtINR(summary.totalAdjustedAmount)}
        tone="text-green-600"
      />
      <StatCard
        label={outstandingLabel}
        value={fmtCompact(summary.totalOutstandingAmount)}
        sub={`${fmtINR(summary.totalOutstandingAmount)} · ${summary.outstandingRate.toFixed(1)}% of net ${context.toLowerCase()}`}
        tone="text-amber-600"
      />
      <StatCard
        label="Average Payment Days"
        value={
          summary.averagePaymentDays === null
            ? "—"
            : `${summary.averagePaymentDays.toFixed(1)} days`
        }
        sub={
          summary.partyPaymentCount
            ? `average across ${summary.partyPaymentCount} part${summary.partyPaymentCount === 1 ? "y" : "ies"}`
            : "No fully paid invoices"
        }
      />
      <StatCard
        label="Outstanding Invoices"
        value={summary.outstandingInvoiceCount}
        sub={`${summary.paidInvoiceCount} fully paid`}
      />
      <StatCard
        label="Overpaid Amount"
        value={fmtCompact(summary.totalOverpaidAmount)}
        sub={fmtINR(summary.totalOverpaidAmount)}
        tone="text-blue-600"
      />
    </div>
  );
}
