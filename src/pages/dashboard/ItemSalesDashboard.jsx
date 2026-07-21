import { useState, useMemo } from "react";
import useSalesItemData from "../../utils/fetch/salesItemData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Ruler,
  Scale,
  Receipt,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

const COLORS = {
  ink: "#12162a",
  paper: "#f3f4f8",
  gold: "#c69a3e",
  indigo: "#3a4a9f",
  teal: "#0f9d78",
  grid: "#e3e5ee",
  muted: "#6b7280",
};

const CATEGORY_COLOR = {
  "Weight-based": COLORS.gold,
  "Length-based": COLORS.indigo,
  "Unit-based": COLORS.teal,
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
function getCategory({ weight, meters }) {
  if (weight > 0) return "Weight-based";
  if (meters > 0) return "Length-based";
  return "Unit-based";
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <Icon size={15} style={{ color: accent || COLORS.gold }} />
      </div>
      <div className="mt-2 font-display text-2xl font-bold text-slate-900">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function ItemSalesDashboard() {
  const { summary, topItems, message, reload, status } = useSalesItemData();
  console.log(topItems);
  const items = useMemo(
    () =>
      topItems.map((it) => {
        const pcs = toNum(it.pcs);
        const meters = toNum(it.meters);
        const weight = toNum(it.weight);
        const revenue = toNum(it.revenue);
        return {
          name: it.itemName,
          pcs,
          meters,
          weight,
          revenue,
          category: getCategory({ weight, meters }),
        };
      }),
    [topItems],
  );

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
    .sort((a, b) => b.revenue - a.revenue)
    .map((it) => ({
      name: it.name.length > 18 ? it.name.slice(0, 17) + "…" : it.name,
      fullName: it.name,
      revenue: it.revenue,
      fill: CATEGORY_COLOR[it.category],
    }));

  const columns = [
    ["name", "Item"],
    ["category", "UOM"],
    ["pcs", "Pcs"],
    ["meters", "Meters"],
    ["weight", "Weight (kg)"],
    ["revenue", "Revenue"],
  ];

  return (
    <div className="min-h-screen" style={{ background: COLORS.paper }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-num { font-family: 'IBM Plex Mono', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="font-body">
        {/* Hero header */}
        <div style={{ background: COLORS.ink }} className="px-4 py-8 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-px w-8"
                    style={{ background: COLORS.gold }}
                  />
                  <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    Item Sales Register
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                  Fabric &amp; Saree Ledger
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  {summary.totalUniqueItems} SKUs ·{" "}
                  {fmtNumber(toNum(summary.totalPcs))} pcs ·{" "}
                  {fmtNumber(toNum(summary.totalMeters))} mtr moved
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Sales
                </div>
                <div
                  className="font-display text-4xl font-bold"
                  style={{ color: COLORS.gold }}
                >
                  {fmtCompact(summary.totalSales)}
                </div>
                <div className="mt-0.5 font-mono-num text-xs text-slate-500">
                  {fmtINR(summary.totalSales)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              icon={Package}
              label="Total Pcs"
              value={fmtQty(toNum(summary.totalPcs))}
              sub={`${fmtNumber(toNum(summary.totalPcs))} pieces`}
              accent={COLORS.teal}
            />
            <StatCard
              icon={Ruler}
              label="Total Meters"
              value={fmtQty(toNum(summary.totalMeters))}
              sub={`${fmtNumber(toNum(summary.totalMeters))} mtr`}
              accent={COLORS.indigo}
            />
            <StatCard
              icon={Scale}
              label="Total Weight"
              value={`${fmtNumber(toNum(summary.totalWeight), 1)} kg`}
              sub="weight-based SKUs only"
              accent={COLORS.gold}
            />
            <StatCard
              icon={Receipt}
              label="Taxable Value"
              value={fmtCompact(toNum(summary.totalTaxable))}
              sub={fmtINR(toNum(summary.totalTaxable))}
            />
            <StatCard
              icon={TrendingUp}
              label="Total Sales"
              value={fmtCompact(summary.totalSales)}
              sub="incl. tax"
              accent={COLORS.gold}
            />
          </div>

          {/* Charts */}
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 lg:col-span-2">
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
                  margin={{ left: 8, right: 24 }}
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
                    width={150}
                    tick={{ fontSize: 11, fill: COLORS.ink }}
                  />
                  <Tooltip
                    formatter={(v) => fmtINR(v)}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.fullName
                    }
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${COLORS.grid}`,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
                      <td className="px-5 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: `${CATEGORY_COLOR[it.category]}1a`,
                            color: CATEGORY_COLOR[it.category],
                          }}
                        >
                          {it.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono-num text-slate-700">
                        {fmtNumber(it.pcs)}
                      </td>
                      <td className="px-5 py-3 font-mono-num text-slate-700">
                        {it.meters > 0 ? fmtNumber(it.meters, 1) : "—"}
                      </td>
                      <td className="px-5 py-3 font-mono-num text-slate-700">
                        {it.weight > 0 ? fmtNumber(it.weight, 2) : "—"}
                      </td>
                      <td className="px-5 py-3 font-mono-num font-medium text-slate-900">
                        {fmtINR(it.revenue)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono-num text-slate-600">
                        {((it.revenue / summary.totalSales) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 font-medium">
                    <td className="px-5 py-3 text-slate-900" colSpan={2}>
                      Total
                    </td>
                    <td className="px-5 py-3 font-mono-num text-slate-900">
                      {fmtNumber(toNum(summary.totalPcs))}
                    </td>
                    <td className="px-5 py-3 font-mono-num text-slate-900">
                      {fmtNumber(toNum(summary.totalMeters), 1)}
                    </td>
                    <td className="px-5 py-3 font-mono-num text-slate-900">
                      {fmtNumber(toNum(summary.totalWeight), 2)}
                    </td>
                    <td className="px-5 py-3 font-mono-num text-slate-900">
                      {fmtINR(summary.totalSales)}
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
      </div>
    </div>
  );
}
