import ChartCard from "../../../../components/dashboard/ChartCard";
import { fmtCompact } from "../../../../utils/format";
import CustomTooltip from "../../../../components/dashboard/CustomTooltip";
import {
  preparePartyChartData,
  truncatePartyName,
} from "./partyChartData";
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Line,
} from "recharts";

export default function SalesVsParty({ COLORS, customerChartData, context }) {
  const chart = preparePartyChartData(customerChartData, "grossAmount");
  const hasReturns = chart.data.some(
    (party) => Number(party.returnAmount) > 0,
  );

  return (
    <ChartCard
      title={hasReturns ? `${context} vs Returns by Party` : `${context} by Party`}
      action={
        hasReturns ? (
          chart.hiddenPartyCount > 0 ? (
            <span className="text-xs font-medium text-slate-500">
              Top {chart.visibleLimit} + {chart.hiddenPartyCount} others
            </span>
          ) : null
        ) : (
          <span className="text-xs font-medium text-slate-500">No returns recorded</span>
        )
      }
    >
      {hasReturns && (
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.ink }} />
            {context}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.red }} />
            Returns
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t-2" style={{ borderColor: COLORS.amber }} />
            Return %
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={250} debounce={100}>
        <ComposedChart
          data={chart.data}
          margin={{ top: 10, right: 10, left: -10, bottom: 8 }}
        >
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis
            dataKey="party"
            tickFormatter={(party) => truncatePartyName(party, 10)}
            interval={0}
            tickMargin={10}
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
          {hasReturns && (
            <YAxis
              yAxisId="right"
              orientation="right"
              unit="%"
              tick={{ fontSize: 11, fill: COLORS.amber }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            yAxisId="left"
            dataKey="grossAmount"
            name={context}
            fill={COLORS.ink}
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
          {hasReturns && (
            <Bar
              yAxisId="left"
              dataKey="returnAmount"
              name="Returns"
              fill={COLORS.red}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          )}
          {hasReturns && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="returnRate"
              name="Return %"
              stroke={COLORS.amber}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS.amber }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
