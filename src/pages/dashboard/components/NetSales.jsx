import ChartCard from "../../../components/dashboard/ChartCard";
import { fmtCompact } from "../../../utils/format";
import CustomTooltip from "../../../components/dashboard/CustomTooltip";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function NetSales({ COLORS, customerChartData, context }) {
  return (
    <ChartCard title={`Net ${context} by Party`}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="netAmount"
            name={`Net ${context}`}
            fill={COLORS.green}
            radius={[0, 6, 6, 0]}
            maxBarSize={34}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
