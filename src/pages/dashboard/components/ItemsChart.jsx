import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fmtCompact, fmtINR } from "../../../utils/format";

function getQuantity(t) {
  if (t.per === "W") return Number(t.weight) || 0;
  if (t.per === "M") return Number(t.meters) || 0;
  return Number(t.pcs) || 0;
}

function aggregateByItem(transactions) {
  const map = new Map();

  for (const t of transactions) {
    const key = t.itemName || "Unknown";
    const amount = Number(t.totalAmount) || 0;
    const qty = getQuantity(t);
    const isReturn = t.code === "SR";

    if (!map.has(key)) {
      map.set(key, {
        itemName: key,
        amount: 0,
        quantity: 0,
        per: t.per,
        invoiceCount: 0,
      });
    }

    const entry = map.get(key);
    entry.amount += isReturn ? -amount : amount;
    entry.quantity += isReturn ? -qty : qty;
    entry.invoiceCount += 1;
  }

  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

export default function ItemsChart({ transactions }) {
  const data = useMemo(
    () => aggregateByItem(transactions || []),
    [transactions],
  );

  if (!data.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70">
        No item data available.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-display text-sm font-bold text-slate-900">
          Items — Value &amp; Quantity
        </h3>
        <p className="text-xs text-slate-500">
          Net of returns · {data.length} distinct items
        </p>
      </div>

      <div className="h-[420px] w-full px-2 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="itemName"
              angle={-40}
              textAnchor="end"
              interval={0}
              height={90}
              tick={{ fontSize: 11, fill: "#475569" }}
            />
            <YAxis
              yAxisId="amount"
              orientation="left"
              tickFormatter={(v) => fmtCompact(v)}
              tick={{ fontSize: 11, fill: "#475569" }}
              label={{
                value: "Amount (₹)",
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
              formatter={(value, name) => {
                if (name === "Amount") return [fmtINR(value), name];
                return [
                  new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 1,
                  }).format(value),
                  name,
                ];
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              yAxisId="amount"
              dataKey="amount"
              name="Amount"
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
