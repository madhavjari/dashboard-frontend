import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { fmtCompact } from "../../../utils/format";
import CustomTooltip from "../../../components/dashboard/CustomTooltip";

import ChartCard from "../../../components/dashboard/ChartCard";

export default function NetChart({ COLORS, salesVsReturns }) {
  return (
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
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
  );
}
