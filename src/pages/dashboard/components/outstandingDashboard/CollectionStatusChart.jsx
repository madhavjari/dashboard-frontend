import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../../../../components/dashboard/ChartCard";
import { fmtCompact, fmtINR } from "../../../../utils/format";

export default function CollectionStatusChart({ summary, context }) {
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";
  const data = [
    { name: context, value: summary.totalTransactionAmount, fill: "#1e293b" },
    { name: "Adjusted", value: summary.totalAdjustedAmount, fill: "#16a34a" },
    {
      name: outstandingLabel,
      value: summary.totalOutstandingAmount,
      fill: "#d97706",
    },
  ];

  return (
    <ChartCard title={`${context} Payment Status`}>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10 }}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtCompact}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={65}
          />
          <Tooltip formatter={(value) => fmtINR(value)} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={70}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
