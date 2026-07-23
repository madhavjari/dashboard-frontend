import { useState, useMemo } from "react";
import useItemData from "../../utils/fetch/itemData";
import StatCard from "../../components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { ArrowUpDown } from "lucide-react";

const COLORS = {
  ink: "#12162a",
  paper: "#f3f4f8",
  gold: "#c69a3e",
  indigo: "#3a4a9f",
  teal: "#0f9d78",
  grid: "#e3e5ee",
  muted: "#6b7280",
  blue: "#2563eb",
};

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
function fmtNumber(n, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
  }).format(n);
}
function fmtINR(n) {
  return "₹" + fmtNumber(Math.round(n));
}
function fmtCompact(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
  if (n >= 1e3) return "₹" + (n / 1e3).toFixed(1) + "K";
  return "₹" + fmtNumber(n);
}
function fmtQty(n) {
  if (n >= 1e5) return (n / 1e5).toFixed(2) + " L";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return fmtNumber(n);
}

export default function ItemDashboard({ ITEMS_URL }) {
  const { summary, topItems, message, reload, status } = useItemData(ITEMS_URL);
  const items = useMemo(
    () =>
      topItems.map((it) => {
        const pcs = toNum(it.pcs);
        const meters = toNum(it.meters);
        const weight = toNum(it.weight);
        const transaction = toNum(it.transaction);
        const per = it.per || "p";
        let quantity;
        if (per.toLowerCase().includes("w")) quantity = weight;
        else if (per.toLowerCase().includes("m")) quantity = meters;
        else quantity = pcs;
        let category;
        if (per.toLowerCase().includes("w")) category = "kg";
        else if (per.toLowerCase().includes("m")) category = "metre";
        else category = "pcs";
        return {
          name: it.itemName,
          pcs,
          meters,
          weight,
          transaction,
          per,
          quantity,
          category,
        };
      }),
    [topItems],
  );
  const CATEGORY_COLOR = {
    kg: COLORS.gold,
    metre: COLORS.indigo,
    pcs: COLORS.teal,
  };

  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");

  const sortedItems = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
  }, [items, sortKey, sortDir]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">Item Dashboard</h1>
          <div className="mt-6">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-blue-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">Item Dashboard</h1>
          <div className="mt-6">
            <p className="text-red-600">{message}</p>
            <button
              onClick={reload}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const barData = [...items]
    .sort((a, b) => b.transaction - a.transaction)
    .map((it) => ({
      name: it.name.length > 30 ? it.name.slice(0, 30) + "…" : it.name,
      fullName: it.name,
      transaction: it.transaction,
      fill: CATEGORY_COLOR[it.category],
    }));

  const columns = [
    ["name", "Item"],
    ["category", "UOM"],
    ["quantity", "Qty"],
    ["transaction", "Transaction"],
  ];
  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);
  const categoryTotals = items.reduce((acc, it) => {
    acc[it.category] = (acc[it.category] || 0) + it.transaction;
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    fill: CATEGORY_COLOR[name],
  }));

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      {/* Hero header */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Item Sales Register
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {summary.totalUniqueItems} SKUs · {fmtNumber(totalQuantity)} units
            moved
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Total Quantity"
          value={fmtQty(totalQuantity)}
          sub="based on unit of measure"
        />
        <StatCard
          label="Total Sales"
          value={fmtCompact(summary.totalTransaction)}
          sub={fmtINR(summary.totalTransaction)}
          tone="text-green-600"
        />
        <StatCard
          label="Taxable Value"
          value={fmtCompact(toNum(summary.totalTaxable))}
          sub={fmtINR(toNum(summary.totalTaxable))}
        />
        <StatCard
          label="Total Items"
          value={summary.totalUniqueItems}
          sub="items sold"
        />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 ">
          <h3 className="font-display text-sm font-bold text-slate-900">
            Revenue by Item
          </h3>
          <p className="mb-3 text-xs text-slate-500">
            Ranked highest to lowest
          </p>
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
                formatter={(v) => fmtINR(v)}
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
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h3 className="font-display text-sm font-bold text-slate-900">
            Sales Mix
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
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => fmtINR(v)}
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${COLORS.grid}`,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {pieData.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: d.fill }}
                  />
                  {d.name}
                </span>
                <span className="font-mono-num font-medium text-slate-800">
                  {((d.value / toNum(summary.totalTransaction)) * 100).toFixed(
                    1,
                  )}
                  %
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-display text-sm font-bold text-slate-900">
            Item-wise Register
          </h3>
          <p className="text-xs text-slate-500">Click a column to sort</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
                {columns.map(([key, label]) => (
                  <th
                    key={key}
                    className="cursor-pointer select-none px-5 py-3 hover:text-slate-800"
                    onClick={() => handleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <ArrowUpDown
                        size={11}
                        className={
                          sortKey === key ? "opacity-100" : "opacity-30"
                        }
                      />
                    </span>
                  </th>
                ))}
                <th className="px-5 py-3 text-right">% of Sales</th>
                <th className="px-5 py-3 text-right">Net Rate(inc. GST)</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((it) => (
                <tr
                  key={it.name}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {it.name}
                  </td>
                  <td className="px-5 py-3 font-mono-num text-slate-700">
                    {it.category}
                  </td>
                  <td className="px-5 py-3 font-mono-num text-slate-700">
                    {fmtNumber(it.quantity, 1)}
                  </td>

                  <td className="px-5 py-3 font-mono-num font-medium text-slate-900">
                    {fmtINR(it.transaction)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono-num text-slate-600">
                    {(
                      (it.transaction / summary.totalTransaction) *
                      100
                    ).toFixed(1)}
                    %
                  </td>
                  <td className="px-5 py-3 text-right font-mono-num text-slate-600">
                    {it.quantity > 0
                      ? "₹" + (it.transaction / it.quantity).toFixed(2)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 font-medium">
                <td className="px-5 py-3 text-slate-900" colSpan={3}>
                  Total
                </td>

                <td className="px-5 py-3 font-mono-num text-slate-900">
                  {fmtINR(summary.totalTransaction)}
                </td>
                <td className="px-5 py-3 text-right font-mono-num text-slate-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
