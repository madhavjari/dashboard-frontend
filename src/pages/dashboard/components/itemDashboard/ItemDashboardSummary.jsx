import StatCard from "../../../../components/dashboard/StatCard";

export default function ItemDashboardSummary({
  context,
  summary,
  totalQuantity,
  fmtQty,
  fmtCompact,
  fmtINR,
  toNum,
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <StatCard
        label="Total Quantity"
        value={fmtQty(totalQuantity)}
        sub="based on unit of measure"
      />
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.totalTransaction)}
        sub={fmtINR(summary.totalTransaction)}
        tone="text-green-600"
      />
      <StatCard
        label="Taxable Value"
        value={fmtCompact(toNum(summary.totalTaxable))}
        sub={fmtINR(toNum(summary.totalTaxable))}
      />
      <StatCard
        label="Total Items"
        value={summary.totalUniqueItems}
        sub="items sold"
      />
    </div>
  );
}
