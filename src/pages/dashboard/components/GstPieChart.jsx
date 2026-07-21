import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import CustomTooltip from "../../../components/dashboard/CustomTooltip";
import ChartCard from "../../../components/dashboard/ChartCard";

export default function GstPieChart({ taxView, setTaxView, pieData }) {
  return (
    <ChartCard
      title="GST Composition"
      action={
        <div className="flex gap-1 rounded-full bg-gray-100 p-1 text-xs">
          <button
            onClick={() => setTaxView("sales")}
            className={`rounded-full px-3 py-1 font-medium transition ${
              taxView === "sales" ? "bg-blue-600 text-white" : "text-gray-500"
            }`}
          >
            Sales
          </button>
          <button
            onClick={() => setTaxView("returns")}
            className={`rounded-full px-3 py-1 font-medium transition ${
              taxView === "returns" ? "bg-blue-600 text-white" : "text-gray-500"
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
  );
}
