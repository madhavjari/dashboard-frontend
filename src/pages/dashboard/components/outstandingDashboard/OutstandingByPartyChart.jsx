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
import { preparePartyChartData } from "../summaryDashboard/partyChartData";

export default function OutstandingByPartyChart({ partySummary, context }) {
  const outstandingLabel = context === "Sales" ? "To Collect" : "To Pay";
  const chart = preparePartyChartData(partySummary, "amountOutstanding", {
    regularLimit: 10,
    skewedLimit: 10,
  });
  const chartHeight = Math.max(240, chart.data.length * 38);
  const partyAxisWidth = Math.min(
    280,
    Math.max(170, ...chart.data.map((party) => party.party.length * 7.5)),
  );
  const largestAmount = Math.max(
    1,
    ...chart.data.map(
      (party) => Math.abs(Number(party.amountOutstanding)) || 0,
    ),
  );

  return (
    <ChartCard
      title={`${outstandingLabel} by Party`}
      action={
        chart.hiddenPartyCount > 0 ? (
          <span className="text-xs font-medium text-slate-500">
            Top {chart.visibleLimit} + {chart.hiddenPartyCount} others
          </span>
        ) : null
      }
    >
      {chart.data.length === 0 ? (
        <div className="flex h-[230px] items-center justify-center text-sm text-slate-500">
          No outstanding balances.
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {chart.data.map((party, index) => {
              const amount = Number(party.amountOutstanding) || 0;
              const width = `${(Math.abs(amount) / largestAmount) * 100}%`;

              return (
                <div key={party.party}>
                  <div className="mb-1 flex items-start justify-between gap-3 text-xs">
                    <span className="min-w-0 break-words font-medium text-slate-700">
                      {index + 1}. {party.party}
                    </span>
                    <span className="shrink-0 font-mono-num text-slate-500">
                      {fmtCompact(amount)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block">
            <ResponsiveContainer width="100%" height={chartHeight} debounce={100}>
              <BarChart
                data={chart.data}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
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
                  width={partyAxisWidth}
                  tick={{ fontSize: 12, fill: "#1e293b", fontWeight: 500 }}
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
          </div>
        </>
      )}
    </ChartCard>
  );
}
