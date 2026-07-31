import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function TransactionMixChart({
  context,
  pieData,
  totalTransaction,
  COLORS,
  fmtINR,
  toNum,
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="font-display text-sm font-bold text-slate-900">
        {context} Mix
      </h3>
      <p className="mb-3 text-xs text-slate-500">By unit of measure</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {pieData.map((datum, index) => (
              <Cell key={index} fill={datum.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => fmtINR(value)}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${COLORS.grid}`,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-1.5">
        {pieData.map((datum) => (
          <div
            key={datum.name}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-1.5 text-slate-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: datum.fill }}
              />
              {datum.name}
            </span>
            <span className="font-mono-num font-medium text-slate-800">
              {((datum.value / toNum(totalTransaction)) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
