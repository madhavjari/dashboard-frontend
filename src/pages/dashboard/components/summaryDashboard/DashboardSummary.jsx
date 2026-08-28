import StatCard from "../../../../components/dashboard/StatCard";
import { fmtCompact, fmtINR } from "../../../../utils/format";

export default function DashboardSummary({
  summary,
  returnRate,
  context,
  debtorDays,
}) {
  const daysLabel = context === "Sales" ? "Debtor Days" : "Creditor Days";
  const daysFormula =
    context === "Sales"
      ? "payment left ÷ net sales × 365"
      : "amount to pay ÷ net purchase × 365";

  return (
    <section className="metric-group mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" aria-label={`${context} summary`}>
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netAmount)}
        sub="after returns"
        exactValue={fmtINR(summary.netAmount)}
        tone="text-teal-700"
        className="col-span-2 sm:col-span-1 lg:col-span-2"
        grouped
      />
      <StatCard
        label={`Gross ${context}`}
        value={fmtCompact(summary.grossAmount)}
        sub="before returns"
        exactValue={fmtINR(summary.grossAmount)}
        grouped
      />
      <StatCard
        label="Returns"
        value={fmtCompact(summary.returns)}
        sub={`${summary.returnCount} returns · ${returnRate}%`}
        tone="text-rose-700"
        grouped
      />
      <StatCard
        label="Invoices"
        value={summary.invoiceCount}
        sub={
          summary.invoiceCount > 0
            ? `Avg ${fmtCompact(
                summary.grossAmount / summary.invoiceCount,
              )}/invoice`
            : "No invoices"
        }
        grouped
      />
      <StatCard
        label={daysLabel}
        value={debtorDays === null ? "—" : `${debtorDays.toFixed(1)} days`}
        sub={daysFormula}
        grouped
      />
    </section>
  );
}
