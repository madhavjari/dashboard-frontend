import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Apr", revenue: 42 },
  { month: "May", revenue: 51 },
  { month: "Jun", revenue: 48 },
  { month: "Jul", revenue: 62 },
  { month: "Aug", revenue: 70 },
  { month: "Sep", revenue: 82 },
];

const cashFlowData = [
  { name: "Collected", value: 68, fill: "#0f766e" },
  { name: "Outstanding", value: 22, fill: "#f59e0b" },
  { name: "Returns", value: 10, fill: "#fda4af" },
];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{payload[0].payload.month}</p>
      <p className="mt-1 text-teal-700">₹{payload[0].value}L revenue</p>
    </div>
  );
}

export default function DemoAnalytics() {
  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-[2rem] border border-white/70 bg-white p-4 shadow-2xl shadow-teal-950/15 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Business pulse</p>
          <p className="mt-1 text-xs text-slate-500">A live view of what matters today</p>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          September overview
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Net revenue
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">₹82.4L</p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              +17.6%
            </span>
          </div>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -18 }}>
                <defs>
                  <linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(value) => `₹${value}L`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f766e"
                  strokeWidth={3}
                  fill="url(#revenueArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Cash flow
          </p>
          <div className="relative mt-1 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cashFlowData}
                  dataKey="value"
                  innerRadius={47}
                  outerRadius={68}
                  paddingAngle={4}
                  stroke="none"
                >
                  {cashFlowData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">₹56L</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">Collected</span>
            </div>
          </div>
          <div className="mt-3 space-y-2 border-t border-white/10 pt-4 text-xs">
            {cashFlowData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="h-2 w-2 rounded-full" style={{ background: entry.fill }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
