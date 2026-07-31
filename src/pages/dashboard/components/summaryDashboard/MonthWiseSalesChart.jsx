import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../../../../components/dashboard/ChartCard";
import { fmtCompact, fmtINR } from "../../../../utils/format";

function formatAxisAmount(amount) {
  const value = Number(amount) || 0;
  if (Math.abs(value) < 100_000) return fmtCompact(value);

  const lakhs = value / 100_000;
  return `₹${lakhs.toFixed(Number.isInteger(lakhs) ? 0 : 1)}L`;
}

export default function MonthWiseSalesChart({ monthlySales, context }) {
  const averageNetAmount = monthlySales.length
    ? monthlySales.reduce(
        (total, entry) => total + Number(entry.netAmount || 0),
        0,
      ) / monthlySales.length
    : 0;
  const data = monthlySales.map((entry, index) => ({
    ...entry,
    label: new Date(entry.month).toLocaleString("en-IN", { month: "short" }),
    isAboveAverage: Number(entry.netAmount) >= averageNetAmount,
    isLatest: index === monthlySales.length - 1,
  }));
  const latestMonth = data.at(-1);
  const latestDifference = latestMonth && averageNetAmount
    ? ((Number(latestMonth.netAmount) - averageNetAmount) / averageNetAmount) *
      100
    : 0;
  const trendDescription = latestMonth
    ? `${latestMonth.label} finished ${Math.abs(latestDifference).toFixed(0)}% ${
        latestDifference >= 0 ? "above" : "below"
      } average.`
    : "";

  return (
    <ChartCard
      title={`Month-wise Net ${context}`}
      action={
        data.length > 0 ? (
          <div className="rounded-lg bg-amber-50 px-2.5 py-1 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Monthly average
            </p>
            <p className="text-xs font-bold text-amber-900">
              {fmtCompact(averageNetAmount)}
            </p>
          </div>
        ) : null
      }
    >
      {data.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">
          No monthly {context.toLowerCase()} data available.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250} debounce={100}>
            <BarChart data={data} margin={{ top: 16, right: 8, left: -10 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatAxisAmount}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip
                formatter={(value) => fmtINR(value)}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={averageNetAmount}
                stroke="#d97706"
                strokeDasharray="5 5"
                strokeWidth={1.5}
              />
              <Bar
                dataKey="netAmount"
                name={`Net ${context}`}
                radius={[6, 6, 0, 0]}
                maxBarSize={56}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={
                      entry.isLatest
                        ? "#0f766e"
                        : entry.isAboveAverage
                          ? "#3da99c"
                          : "#a7d9d3"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-4 border-t-2 border-dashed border-amber-600" />
              Monthly average
            </span>
            <span className="font-medium text-slate-600">{trendDescription}</span>
          </div>
        </>
      )}
    </ChartCard>
  );
}
