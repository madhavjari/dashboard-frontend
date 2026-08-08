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
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.grossAmount)}
        sub={fmtINR(summary.grossAmount)}
        tone="text-green-600"
      />
      <StatCard
        label="Total Returns"
        value={fmtCompact(summary.returnAmount)}
        sub={fmtINR(summary.returnAmount)}
        tone="text-red-600"
      />
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netAmount)}
        sub={fmtINR(summary.netAmount)}
      />
      <StatCard
        label="Invoices"
        value={summary.invoiceCount}
        sub="total bills"
      />
      <StatCard
        label={outstandingLabel}
        value={fmtCompact(outstandingAmount)}
        sub={fmtINR(outstandingAmount)}
        tone="text-amber-700"
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
      />
    </div>
  );
}
