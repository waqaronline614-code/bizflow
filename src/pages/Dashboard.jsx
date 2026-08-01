import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import TopCustomersChart from "../components/dashboard/TopCustomersChart";
import RecentOrders from '../components/dashboard/RecentOrders'
import TopProducts from "../components/dashboard/TopProducts";
import LowStockAlert from "../components/dashboard/LowStockAlert";


function Dashboard() {
  return (
    <div>
      {/* Heading */}
      <div className="mb-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2">
             <SalesChart />
          </div>
              <TopCustomersChart />
      </div> 

          {/* ===================== */}
              {/* RecentOrders*/}
         {/* ===================== */}

         <div>         
              <RecentOrders/>
         </div>
           {/* ===================== */}
              {/*TopProducts ,LowStockAlert */}
         {/* ===================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
              <TopProducts/>
              <LowStockAlert/>
          </div>
    </div>
  );
}

export default Dashboard;