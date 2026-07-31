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
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        label={`Total Quantity ${quantityAction}`}
        value={`${fmtNumber(summary.quantity, 2)} ${summary.unit}`}
      />
    </div>
  );
}
