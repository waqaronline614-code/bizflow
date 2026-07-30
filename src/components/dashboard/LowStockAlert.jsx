import { FiAlertTriangle } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    stock: 3,
  },
  {
    id: 2,
    name: "Samsung S25",
    stock: 5,
  },
  {
    id: 3,
    name: "AirPods Pro",
    stock: 2,
  },
  {
    id: 4,
    name: "Sony Headphones",
    stock: 4,
  },
];

function LowStockAlert() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold text-slate-800">
          Low Stock Alert
        </h2>

        <FiAlertTriangle
          size={22}
          className="text-amber-500"
        />

      </div>

      {/* Products */}

      <div className="space-y-4">

        {products.map((product) => (

          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition"
          >

            <div>

              <h3 className="font-medium text-slate-800">
                {product.name}
              </h3>

              <p className="text-sm text-slate-500">
                Product Inventory
              </p>

            </div>

            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
              {product.stock} Left
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LowStockAlert;