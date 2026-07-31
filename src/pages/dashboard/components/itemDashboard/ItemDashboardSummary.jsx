import StatCard from "../../../../components/dashboard/StatCard";

export default function ItemDashboardSummary({
  context,
  summary,
  fmtCompact,
  fmtINR,
  mostSoldItem,
}) {
  const itemAction = context.toLowerCase() === "purchase" ? "Purchased" : "Sold";

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label={`Total Items ${itemAction}`}
        value={summary.totalUniqueItems}
        sub="unique items"
      />
      <StatCard
        label={`Most Item ${itemAction} by Value`}
        value={mostSoldItem?.name || "—"}
        sub={mostSoldItem ? fmtINR(mostSoldItem.transaction) : "No item sales"}
      />
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.totalTransaction)}
        sub={fmtINR(summary.totalTransaction)}
        tone="text-green-600"
      />
    </div>
  );
}
