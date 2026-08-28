import {
  Area,
  AreaChart,
  CartesianGrid,
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

function fillMissingMonths(rows) {
  if (rows.length < 2) return rows;
  const sorted = [...rows].sort((a, b) => new Date(a.month) - new Date(b.month));
  const byMonth = new Map(sorted.map((row) => {
    const date = new Date(row.month);
    return [`${date.getUTCFullYear()}-${date.getUTCMonth()}`, row];
  }));
  const first = new Date(sorted[0].month);
  const last = new Date(sorted.at(-1).month);
  const cursor = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1));
  const end = new Date(Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), 1));
  const result = [];
  while (cursor <= end) {
    const key = `${cursor.getUTCFullYear()}-${cursor.getUTCMonth()}`;
    result.push(byMonth.get(key) || { month: cursor.toISOString(), netAmount: 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return result;
}

export default function MonthWiseSalesChart({ monthlySales, context }) {
  const completeSales = fillMissingMonths(monthlySales);
  const averageNetAmount = completeSales.length
    ? completeSales.reduce(
        (total, entry) => total + Number(entry.netAmount || 0),
        0,
      ) / completeSales.length
    : 0;
  const data = completeSales.map((entry) => ({
    ...entry,
    label: new Date(entry.month).toLocaleString("en-IN", { month: "short" }),
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
            <AreaChart data={data} margin={{ top: 16, right: 8, left: -10 }}>
              <defs><linearGradient id={`monthly-${context}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0f766e" stopOpacity={0.22} /><stop offset="100%" stopColor="#0f766e" stopOpacity={0} /></linearGradient></defs>
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
              <Area
                type="monotone"
                dataKey="netAmount"
                name={`Net ${context}`}
                stroke="#0f766e"
                strokeWidth={2.5}
                fill={`url(#monthly-${context})`}
                dot={{ r: 3, fill: "#fff", stroke: "#0f766e", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
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
