import ChartCard from "../../../components/dashboard/ChartCard";
import { fmtCompact } from "../../../utils/format";
import CustomTooltip from "../../../components/dashboard/CustomTooltip";
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
} from "recharts";

export default function SalesVsParty({ COLORS, customerChartData }) {
  return (
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
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
  );
}
