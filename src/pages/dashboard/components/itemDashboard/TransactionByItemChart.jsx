import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TransactionByItemChart({
  barData,
  COLORS,
  fmtCompact,
  fmtINR,
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="font-display text-sm font-bold text-slate-900">
        Transaction by Item
      </h3>
      <p className="mb-3 text-xs text-slate-500">Ranked highest to lowest</p>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={barData}
          layout="vertical"
          margin={{ left: 2, right: 24 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={COLORS.grid}
            horizontal={false}
          />
          <XAxis
            type="number"
            tickFormatter={fmtCompact}
            tick={{ fontSize: 11, fill: COLORS.muted }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={200}
            tick={{ fontSize: 11, fill: COLORS.ink }}
          />
          <Tooltip
            formatter={(value) => fmtINR(value)}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${COLORS.grid}`,
              fontSize: 12,
            }}
          />
          <Bar dataKey="transaction" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
