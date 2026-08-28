import StatCard from "../../../../components/dashboard/StatCard";

export default function ItemDashboardSummary({
  context,
  summary,
  fmtCompact,
  fmtINR,
}) {
  const itemAction = context.toLowerCase() === "purchase" ? "Purchased" : "Sold";
  const averageItemValue = summary.totalUniqueItems
    ? summary.totalTransaction / summary.totalUniqueItems
    : 0;

  return (
    <section className="metric-group mb-6 grid grid-cols-1 sm:grid-cols-3" aria-label={`${context} item summary`}>
      <StatCard
        label={`Total Items ${itemAction}`}
        value={summary.totalUniqueItems}
        sub="unique items"
        grouped
      />
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.totalTransaction)}
        sub="net transaction value"
        tone="text-teal-700"
        exactValue={fmtINR(summary.totalTransaction)}
        grouped
      />
      <StatCard
        label="Average value per item"
        value={fmtCompact(averageItemValue)}
        sub="total value ÷ unique items"
        grouped
      />
    </section>
  );
}
