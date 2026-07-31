import StatCard from "../../../../components/dashboard/StatCard";

export default function OutstandingSummary({ summary, fmtCompact, fmtINR, context }) {
  const outstandingLabel = context === "Sales" ? "Amount to Collect" : "Amount to Pay";

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.totalTransactionAmount)}
        sub={fmtINR(summary.totalTransactionAmount)}
      />
      <StatCard
        label="Adjusted Amount"
        value={fmtCompact(summary.totalAdjustedAmount)}
        sub={fmtINR(summary.totalAdjustedAmount)}
        tone="text-green-600"
      />
      {context === "Sales" && (
        <StatCard
          label="Sales Returns"
          value={fmtCompact(summary.totalReturnAmount)}
          sub={fmtINR(summary.totalReturnAmount)}
          tone="text-red-600"
        />
      )}
      <StatCard
        label={outstandingLabel}
        value={fmtCompact(summary.totalOutstandingAmount)}
        sub={fmtINR(summary.totalOutstandingAmount)}
        tone="text-amber-600"
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
