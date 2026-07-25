import {
  FiHome,
  FiUsers,
  FiBox,
  FiTruck,
  FiShoppingCart,
  FiCreditCard,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold">
          <span className="text-blue-500">Biz</span>
          <span className="text-white">Flow</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">

        {/* MAIN */}
        <p className="px-6 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Main
        </p>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 bg-blue-600 text-white cursor-pointer">
          <FiHome size={20} />
          <span>Dashboard</span>
        </div>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiUsers size={20} />
          <span>Customers</span>
        </div>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiBox size={20} />
          <span>Products</span>
        </div>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiTruck size={20} />
          <span>Suppliers</span>
        </div>

        {/* MANAGEMENT */}

        <p className="px-6 mt-8 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Management
        </p>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiShoppingCart size={20} />
          <span>Orders</span>
        </div>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiTruck size={20} />
          <span>Purchases</span>
        </div>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiCreditCard size={20} />
          <span>Payments</span>
        </div>

        {/* REPORTS */}

        <p className="px-6 mt-8 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Reports
        </p>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiBarChart2 size={20} />
          <span>Reports</span>
        </div>

        {/* SYSTEM */}

        <p className="px-6 mt-8 mb-3 text-xs uppercase tracking-widest text-slate-500">
          System
        </p>

        <div className="mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition cursor-pointer">
          <FiSettings size={20} />
          <span>Settings</span>
        </div>

      </nav>

      {/* Logout */}

      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-red-600 transition cursor-pointer">
          <FiLogOut size={20} />
          <span>Logout</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;