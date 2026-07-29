import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Retail", value: 45 },
  { name: "Wholesale", value: 30 },
  { name: "Online", value: 25 },
];

const COLORS = [
  "#2563eb",
  "#38bdf8",
  "#60a5fa",
];

function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Revenue Sources
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;