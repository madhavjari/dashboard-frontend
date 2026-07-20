import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from "recharts";

import StatCard from "../../components/dashboard/StatCard";
import ChartCard from "../../components/dashboard/ChartCard";
import CustomTooltip from "../../components/dashboard/CustomTooltip";
import { fmtCompact, fmtINR } from "../../utils/format";
import useSalesData from "../../utils/fetch/salesData";

const COLORS = {
  ink: "#1e293b",
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  grid: "#e2e8f0",
};

export default function SalesDashboard() {
  const { summary, customers, status, message, reload } = useSalesData();
  const [taxView, setTaxView] = useState("sales");

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
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

  const returnRate = summary.grossSales
    ? ((summary.returns / summary.grossSales) * 100).toFixed(2)
    : "0.00";

  const salesVsReturns = [
    { label: "Gross Sales", value: summary.grossSales, fill: COLORS.ink },
    { label: "Returns", value: summary.returns, fill: COLORS.red },
    { label: "Net Sales", value: summary.netSales, fill: COLORS.green },
  ];

  const gstRows = [
    {
      label: "CGST",
      sales: summary.cgstSales,
      returns: summary.cgstSalesReturn,
    },
    {
      label: "SGST",
      sales: summary.sgstSales,
      returns: summary.sgstSalesReturn,
    },
    {
      label: "IGST",
      sales: summary.igstSales,
      returns: summary.igstSalesReturn,
    },
  ];

  const pieData = gstRows
    .map((r, i) => ({
      name: r.label,
      value: taxView === "sales" ? r.sales : r.returns,
      fill: [COLORS.blue, COLORS.green, COLORS.amber][i],
    }))
    .filter((d) => d.value > 0);

  const customerChartData = customers.map((c) => ({
    ...c,
    returnRate: c.salesAmount
      ? +((c.returnAmount / c.salesAmount) * 100).toFixed(1)
      : 0,
  }));

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {summary.invoiceCount} invoices · {summary.returnCount} returns
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Gross Sales"
            value={fmtCompact(summary.grossSales)}
            sub={fmtINR(summary.grossSales)}
          />
          <StatCard
            label="Returns"
            value={fmtCompact(summary.returns)}
            sub={`${summary.returnCount} returns · ${returnRate}%`}
            tone="text-red-600"
          />
          <StatCard
            label="Net Sales"
            value={fmtCompact(summary.netSales)}
            sub={fmtINR(summary.netSales)}
            tone="text-green-600"
          />
          <StatCard
            label="Invoices"
            value={summary.invoiceCount}
            sub={
              summary.invoiceCount > 0
                ? `Avg ${fmtCompact(
                    summary.grossSales / summary.invoiceCount,
                  )}/invoice`
                : "No invoices"
            }
          />
          <StatCard
            label="Total Tax (Sales)"
            value={fmtCompact(
              summary.cgstSales + summary.sgstSales + summary.igstSales,
            )}
            sub="CGST + SGST + IGST"
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Gross · Returns · Net">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={salesVsReturns}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: COLORS.grid }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={fmtCompact}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={65}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar
                  dataKey="value"
                  name="Amount"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={70}
                >
                  {salesVsReturns.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="GST Composition"
            action={
              <div className="flex gap-1 rounded-full bg-gray-100 p-1 text-xs">
                <button
                  onClick={() => setTaxView("sales")}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    taxView === "sales"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setTaxView("returns")}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    taxView === "returns"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Returns
                </button>
              </div>
            }
          >
            {pieData.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-gray-500">
                No tax data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {pieData.map((d) => (
                      <Cell
                        key={d.name}
                        fill={d.fill}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Tax Head Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-2">Tax Head</th>
                  <th className="py-2 text-right">On Sales</th>
                  <th className="py-2 text-right">On Returns</th>
                  <th className="py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {gstRows.map((r) => (
                  <tr key={r.label} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-gray-900">
                      {r.label}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {fmtINR(r.sales, 2)}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {fmtINR(r.returns, 2)}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {fmtINR(r.sales - r.returns, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Net Sales by Party">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={customerChartData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={fmtCompact}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: COLORS.grid }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="party"
                  width={140}
                  tick={{ fontSize: 12, fill: "#1e293b", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar
                  dataKey="netSales"
                  name="Net Sales"
                  fill={COLORS.green}
                  radius={[0, 6, 6, 0]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sales vs Returns by Party">
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart
                data={customerChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="party"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: COLORS.grid }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={fmtCompact}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  unit="%"
                  tick={{ fontSize: 11, fill: COLORS.amber }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  yAxisId="left"
                  dataKey="salesAmount"
                  name="Sales"
                  fill={COLORS.ink}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  yAxisId="left"
                  dataKey="returnAmount"
                  name="Returns"
                  fill={COLORS.red}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="returnRate"
                  name="Return %"
                  stroke={COLORS.amber}
                  strokeWidth={2}
                  dot={{ r: 4, fill: COLORS.amber }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Party-wise Register
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-2">Party</th>
                  <th className="py-2 text-right">Invoices</th>
                  <th className="py-2 text-right">Sales</th>
                  <th className="py-2 text-right">Returns</th>
                  <th className="py-2 text-right">Net Sales</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No customer sales data available.
                  </p>
                ) : (
                  customers.map((c) => (
                    <tr key={c.party} className="border-b border-gray-100">
                      <td className="py-2 font-medium text-gray-900">
                        {c.party}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {c.invoiceCount}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {fmtINR(c.salesAmount)}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {fmtINR(c.returnAmount)}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {fmtINR(c.netSales)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
