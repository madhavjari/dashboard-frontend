import StatCard from "../../../components/dashboard/StatCard";
import { fmtCompact, fmtINR } from "../../../utils/format";

export default function DashboardSummary({ summary, returnRate }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Gross Sales"
        value={fmtCompact(summary.grossSales)}
        sub={fmtINR(summary.grossSales)}
      />
      <StatCard
        label="Returns"
        value={fmtCompact(summary.returns)}
        sub={`${summary.returnCount} returns · ${returnRate}%`}
        tone="text-red-600"
      />
      <StatCard
        label="Net Sales"
        value={fmtCompact(summary.netSales)}
        sub={fmtINR(summary.netSales)}
        tone="text-green-600"
      />
      <StatCard
        label="Invoices"
        value={summary.invoiceCount}
        sub={
          summary.invoiceCount > 0
            ? `Avg ${fmtCompact(
                summary.grossSales / summary.invoiceCount,
              )}/invoice`
            : "No invoices"
        }
      />
      <StatCard
        label="Total Tax (Sales)"
        value={fmtCompact(
          summary.cgstSales + summary.sgstSales + summary.igstSales,
        )}
        sub="CGST + SGST + IGST"
      />
    </div>
  );
}
