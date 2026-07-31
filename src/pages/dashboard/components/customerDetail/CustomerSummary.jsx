import StatCard from "../../../../components/dashboard/StatCard";

export default function CustomerSummary({
  summary,
  fmtCompact,
  fmtINR,
  context,
  debtorDays,
  averagePaymentDays,
  paidInvoiceCount,
}) {
  const daysLabel = context === "Sales" ? "Debtor Days" : "Creditor Days";
  const daysFormula =
    context === "Sales"
      ? "accounts receivable ÷ net sales × 365"
      : "accounts payable ÷ net purchase × 365";

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
        label={daysLabel}
        value={debtorDays === null ? "—" : `${debtorDays.toFixed(1)} days`}
        sub={debtorDays === null ? "No net sales" : daysFormula}
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
