import StatCard from "../../../components/dashboard/StatCard";
import { fmtCompact, fmtINR } from "../../../utils/format";

export default function DashboardSummary({ summary, returnRate, context }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label={`Gross ${context}`}
        value={fmtCompact(summary.grossAmount)}
        sub={fmtINR(summary.grossAmount)}
      />
      <StatCard
        label="Returns"
        value={fmtCompact(summary.returns)}
        sub={`${summary.returnCount} returns · ${returnRate}%`}
        tone="text-red-600"
      />
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netAmount)}
        sub={fmtINR(summary.netAmount)}
        tone="text-green-600"
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
      />
      <StatCard
        label={`Total Tax ( ${context})`}
        value={fmtCompact(summary.cgst + summary.sgst + summary.igst)}
        sub="CGST + SGST + IGST"
      />
    </div>
  );
}
