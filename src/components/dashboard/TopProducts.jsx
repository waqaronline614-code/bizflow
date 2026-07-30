import { FiTrendingUp } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    sold: 245,
  },
  {
    id: 2,
    name: "Samsung S25",
    sold: 210,
  },
  {
    id: 3,
    name: "AirPods Pro",
    sold: 198,
  },
  {
    id: 4,
    name: "Apple Watch",
    sold: 180,
  },
  {
    id: 5,
    name: "Sony Headphones",
    sold: 165,
  },
];

function TopProducts() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold text-slate-800">
          Top Products
        </h2>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200">

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Rank
              </th>

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Product
              </th>

              <th className="text-right py-3 text-sm font-semibold text-slate-500">
                Sold
              </th>

            </tr>

          </thead>

          <tbody>

            {products.map((product, index) => (

              <tr
                key={product.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >

                <td className="py-4">

                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                </td>

                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <FiTrendingUp className="text-blue-600" />

                    <span className="font-medium text-slate-800">
                      {product.name}
                    </span>

                  </div>

                </td>

                <td className="py-4 text-right">

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                    {product.sold}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TopProducts;