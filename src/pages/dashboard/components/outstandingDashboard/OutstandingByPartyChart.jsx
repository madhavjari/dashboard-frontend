import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../../../../components/dashboard/ChartCard";
import { fmtCompact, fmtINR } from "../../../../utils/format";

export default function OutstandingByPartyChart({ partySummary, context }) {
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";
  const data = partySummary.filter((party) => party.amountOutstanding > 0);

  return (
    <ChartCard title={`${outstandingLabel} by Party`}>
      {data.length === 0 ? (
        <div className="flex h-[230px] items-center justify-center text-sm text-slate-500">
          No outstanding balances.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={230} debounce={100}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10 }}
          >
            <CartesianGrid stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={fmtCompact}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="party"
              width={140}
              tick={{ fontSize: 12, fill: "#1e293b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(value) => fmtINR(value)} />
            <Bar
              dataKey="amountOutstanding"
              name={outstandingLabel}
              fill="#d97706"
              radius={[0, 6, 6, 0]}
              maxBarSize={34}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
