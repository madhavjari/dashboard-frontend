import StatCard from "../../../../components/dashboard/StatCard";

export default function ItemDetailSummary({
  summary,
  fmtCompact,
  fmtINR,
  fmtNumber,
  context,
}) {
  const quantityAction = context === "Sales" ? "Sold" : "Purchased";
  const hasSingleUnit = summary.unit !== "Mixed units";
  const pricePerUnit = hasSingleUnit && summary.pricePerUnit !== null
    ? fmtINR(summary.pricePerUnit, 2)
    : "—";

  return (
    <section className="metric-group mb-6 grid grid-cols-2 lg:grid-cols-5" aria-label={`${context} item detail summary`}>
      <StatCard
        label={`Net ${context}`}
        value={fmtCompact(summary.netAmount)}
        sub="after returns"
        exactValue={fmtINR(summary.netAmount)}
        className="col-span-2 lg:col-span-1"
        grouped
      />
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
        label={`Total Quantity ${quantityAction}`}
        value={`${fmtNumber(summary.quantity, 2)} ${summary.unit}`}
        grouped
      />
      <StatCard
        label="Price per UOM · ex GST"
        value={pricePerUnit}
        sub={hasSingleUnit ? `Average before GST per ${summary.unit}` : "Multiple units; rate unavailable"}
        exactValue={summary.pricePerUnit === null ? undefined : fmtINR(summary.pricePerUnit, 2)}
        tone="text-teal-700"
        grouped
      />
    </section>
  );
}
