import StatCard from "../../../../components/dashboard/StatCard";

export default function ItemDetailSummary({
  summary,
  fmtCompact,
  fmtINR,
  fmtNumber,
  context,
}) {
  const quantityAction = context === "Sales" ? "Sold" : "Purchased";

  return (
    <section className="metric-group mb-6 grid grid-cols-2 lg:grid-cols-4" aria-label={`${context} item detail summary`}>
      <StatCard
        label={`Total ${context}`}
        value={fmtCompact(summary.grossAmount)}
        sub="before returns"
        exactValue={fmtINR(summary.grossAmount)}
        grouped
      />
      <StatCard
        label="Total Returns"
        value={fmtCompact(summary.returnAmount)}
        sub="deducted from gross activity"
        exactValue={fmtINR(summary.returnAmount)}
        tone="text-rose-700"
        grouped
      />
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netAmount)}
        sub="after returns"
        exactValue={fmtINR(summary.netAmount)}
        grouped
      />
      <StatCard
        label={`Total Quantity ${quantityAction}`}
        value={`${fmtNumber(summary.quantity, 2)} ${summary.unit}`}
        grouped
      />
    </section>
  );
}
