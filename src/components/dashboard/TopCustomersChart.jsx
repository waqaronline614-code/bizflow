import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Ali Khan",
    value: 38,
  },
  {
    name: "Ahmad Ali",
    value: 27,
  },
  {
    name: "Waqar Shah",
    value: 20,
  },
  {
    name: "Bilal",
    value: 15,
  },
];

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

function TopCustomersChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold text-slate-800">
          Top Customers
        </h2>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </button>

      </div>

      {/* Chart */}

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}%`, "Contribution"]}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default TopCustomersChart;