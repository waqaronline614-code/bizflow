import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import RevenueChart from "../components/dashboard/RevenueChart";

function Dashboard() {
  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Back, Waqar 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Here's what's happening in your business today.
        </p>
      </div>

      {/* ===================== */}
      {/* Statistics Cards */}
      {/* ===================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Revenue"
          value="$58,450"
          growth="+12%"
          icon={<FiDollarSign />}
        />

        <StatCard
          title="Customers"
          value="1,284"
          growth="+8%"
          icon={<FiUsers />}
        />

        <StatCard
          title="Products"
          value="432"
          growth="+15%"
          icon={<FiPackage />}
        />

        <StatCard
          title="Orders"
          value="356"
          growth="+6%"
          icon={<FiShoppingCart />}
        />

      </div>

      {/* ===================== */}
      {/* Charts */}
      {/* ===================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
             <SalesChart />
          </div>
              <RevenueChart />
          </div> 
    </div>
  );
}

export default Dashboard;