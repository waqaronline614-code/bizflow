import { useMemo } from "react";
import { getAuth } from "firebase/auth";
import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiCreditCard,
  FiPieChart,
  FiTrendingDown,
} from "react-icons/fi";

import StatCard from "../components/dashboard/StatCard";
import SalesChart from "../components/dashboard/SalesChart";
import TopCustomersChart from "../components/dashboard/TopCustomersChart";
import RecentOrders from "../components/dashboard/RecentOrders";
import TopProducts from "../components/dashboard/TopProducts";
import LowStockAlert from "../components/dashboard/LowStockAlert";

import { useAccounts } from "../hooks/Useaccounts";
import useExpenses from "../hooks/Useexpenses";
import useDashboardData from "../hooks/useDashboardData";

import {
  money,
  monthKey,
  growthLabel,
  orderDate,
  orderTotal,
  monthlySales,
  topCustomers,
  topProducts,
  lowStockProducts,
  recentOrders,
} from "../utils/dashboardUtils";

function Dashboard() {
  const { totalCash, totalBank, loading: accountsLoading } = useAccounts();

  const { expenses, loading: expensesLoading } = useExpenses();

  const {
    customers,
    products,
    orders,
    loading,
    error,
  } = useDashboardData();

  // Firebase logged-in user
  const auth = getAuth();
  const user = auth.currentUser;

  const username =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  // Expenses
  const exp = useMemo(() => {
    const now = new Date();

    const thisKey = monthKey(now);

    const lastKey = monthKey(
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      )
    );

    let thisMonth = 0;
    let lastMonth = 0;

    expenses.forEach((expense) => {
      const key = (expense.date || "").slice(0, 7);

      if (key === thisKey) {
        thisMonth += Number(expense.amount) || 0;
      }

      if (key === lastKey) {
        lastMonth += Number(expense.amount) || 0;
      }
    });

    return {
      thisMonth,
      lastMonth,
    };
  }, [expenses]);

  // Sales
  const sales = useMemo(() => {
    const now = new Date();

    const thisKey = monthKey(now);

    const lastKey = monthKey(
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      )
    );

    const result = {
      revThis: 0,
      revLast: 0,
      ordThis: 0,
      ordLast: 0,
    };

    orders.forEach((order) => {
      const date = orderDate(order);

      if (!date) return;

      const key = monthKey(date);

      if (key === thisKey) {
        result.revThis += orderTotal(order);
        result.ordThis += 1;
      }

      if (key === lastKey) {
        result.revLast += orderTotal(order);
        result.ordLast += 1;
      }
    });

    return result;
  }, [orders]);

  // Dashboard data
  const chartData = useMemo(
    () => monthlySales(orders, 6),
    [orders]
  );

  const topCust = useMemo(
    () => topCustomers(orders, customers, 5),
    [orders, customers]
  );

  const topProds = useMemo(
    () => topProducts(orders, 5),
    [orders]
  );

  const lowStock = useMemo(
    () => lowStockProducts(products),
    [products]
  );

  const recent = useMemo(
    () => recentOrders(orders, customers, 6),
    [orders, customers]
  );

  const dash = "…";

  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Back, {username} 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Here's what's happening in your business today.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Financial Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Cash in Hand"
          accent="green"
          icon={<FiDollarSign />}
          value={
            accountsLoading
              ? dash
              : money(totalCash)
          }
        />

        <StatCard
          title="Bank Balance"
          accent="blue"
          icon={<FiCreditCard />}
          value={
            accountsLoading
              ? dash
              : money(totalBank)
          }
        />

        <StatCard
          title="Total Balance"
          accent="violet"
          icon={<FiPieChart />}
          value={
            accountsLoading
              ? dash
              : money(totalCash + totalBank)
          }
        />

        <StatCard
          title="Expenses This Month"
          accent="rose"
          invertGrowth
          icon={<FiTrendingDown />}
          value={
            expensesLoading
              ? dash
              : money(exp.thisMonth)
          }
          growth={
            expensesLoading
              ? undefined
              : growthLabel(
                  exp.thisMonth,
                  exp.lastMonth
                )
          }
        />

      </div>

      {/* Business Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Revenue This Month"
          accent="green"
          icon={<FiDollarSign />}
          value={
            loading
              ? dash
              : money(sales.revThis)
          }
          growth={
            loading
              ? undefined
              : growthLabel(
                  sales.revThis,
                  sales.revLast
                )
          }
        />

        <StatCard
          title="Customers"
          accent="blue"
          icon={<FiUsers />}
          value={
            loading
              ? dash
              : customers.length.toLocaleString()
          }
        />

        <StatCard
          title="Products"
          accent="amber"
          icon={<FiPackage />}
          value={
            loading
              ? dash
              : products.length.toLocaleString()
          }
        />

        <StatCard
          title="Orders This Month"
          accent="violet"
          icon={<FiShoppingCart />}
          value={
            loading
              ? dash
              : sales.ordThis.toLocaleString()
          }
          growth={
            loading
              ? undefined
              : growthLabel(
                  sales.ordThis,
                  sales.ordLast
                )
          }
        />

      </div>

      {/* Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <SalesChart
            data={chartData}
            loading={loading}
          />
        </div>

        <TopCustomersChart
          data={topCust}
          loading={loading}
        />

      </div>

      {/* Recent Orders */}
      <RecentOrders
        orders={recent}
        loading={loading}
      />

      {/* Products */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

        <TopProducts
          data={topProds}
          loading={loading}
        />

        <LowStockAlert
          products={lowStock}
          loading={loading}
        />

      </div>

    </div>
  );
}

export default Dashboard;
