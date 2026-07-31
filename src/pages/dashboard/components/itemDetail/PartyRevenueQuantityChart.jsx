import { useMemo } from "react";
import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtCompact, fmtINR } from "../../../../utils/format";

function getQuantity(transaction) {
  if (transaction.per === "W") return Number(transaction.weight) || 0;
  if (transaction.per === "M") return Number(transaction.meters) || 0;
  return Number(transaction.pcs) || 0;
}

function aggregateByParty(transactions) {
  const parties = new Map();

  for (const transaction of transactions) {
    const party = transaction.party || "Unknown";
    const isReturn = transaction.code.endsWith("R");
    const direction = isReturn ? -1 : 1;

    if (!parties.has(party)) {
      parties.set(party, { party, revenue: 0, quantity: 0 });
    }

    const entry = parties.get(party);
    entry.revenue += direction * (Number(transaction.totalAmount) || 0);
    entry.quantity += direction * getQuantity(transaction);
  }

  return Array.from(parties.values()).sort((a, b) => b.revenue - a.revenue);
}

export default function PartyRevenueQuantityChart({ transactions }) {
  const data = useMemo(
    () => aggregateByParty(transactions || []),
    [transactions],
  );

  if (!data.length) {
    return (
      <div className="mb-6 rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70">
        No party data available.
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-display text-sm font-bold text-slate-900">
          Revenue &amp; Quantity by Party
        </h3>
        <p className="text-xs text-slate-500">Net of returns</p>
      </div>
      <div className="h-[420px] w-full px-2 py-4">
        <ResponsiveContainer width="100%" height="100%" debounce={100}>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="party"
              angle={-40}
              textAnchor="end"
              interval={0}
              height={90}
              tick={{ fontSize: 11, fill: "#475569" }}
            />
            <YAxis
              yAxisId="revenue"
              tickFormatter={fmtCompact}
              tick={{ fontSize: 11, fill: "#475569" }}
              label={{
                value: "Revenue (₹)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#475569" },
              }}
            />
            <YAxis
              yAxisId="quantity"
              orientation="right"
              tick={{ fontSize: 11, fill: "#475569" }}
              label={{
                value: "Quantity",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 11, fill: "#475569" },
              }}
            />
            <Tooltip
              formatter={(value, name) =>
                name === "Revenue" ? [fmtINR(value), name] : [value, name]
              }
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              name="Revenue"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Line
              yAxisId="quantity"
              type="monotone"
              dataKey="quantity"
              name="Quantity"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
