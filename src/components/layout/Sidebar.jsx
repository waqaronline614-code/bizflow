import { useState } from "react";
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
  FiX,
  FiTrendingUp,
  FiRotateCcw,
  FiDollarSign,
  FiChevronDown,
  FiBriefcase
} from "react-icons/fi";

import { NavLink, useLocation } from "react-router-dom";
import { logOut } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const nevigate = useNavigate();
  const location = useLocation();
  const [isSalesOpen, setIsSalesOpen] = useState(true);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(true);

  const isSalesActive = location.pathname.startsWith("/sales");
  const isPurchasesActive = location.pathname.startsWith("/purchases");

  const handleSubmitt = async () => {
    try {
      await logOut();
      nevigate("/login");
    } catch (err) {
      console.error("Log out failed:", err);
    }
  };

  const subLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition cursor-pointer
     ${isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`;

  return (
    <aside
      className={`
            fixed top-16 left-0 z-50
            w-64 h-[calc(100vh-4rem)] bg-slate-900 text-slate-300 flex flex-col
            transform transition-transform duration-300
          ${isSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
        }
              lg:translate-x-0`}>


      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold">
          <span className="text-blue-500">Biz</span>
          <span className="text-white">Flow</span>
        </h1>
        <button className=" md:hidden text-white text-2xl hover:text-blue-400"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FiX />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">

        {/* MAIN */}
        <p className="px-6 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Main
        </p>

        <NavLink to='/dashboard' end onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) => `${isActive ? "bg-blue-600" : " hover:bg-slate-800"} mx-3 mb-1 flex
           items-center gap-3 rounded-lg px-4 py-3 text-white cursor-pointer`} >
          <FiHome size={20} />
          <span>Dashboard</span>
        </NavLink>


        <NavLink to='/customers' onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) => `mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition cursor-pointer
            ${isActive ? "bg-blue-600" : " hover:bg-slate-800"}
        `}>
          <FiUsers size={20} />
          <span>Customers</span>
        </NavLink>

        <NavLink to='/products' onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) => `mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition cursor-pointer
            ${isActive ? "bg-blue-600" : " hover:bg-slate-800"}
        `}>
          <FiBox size={20} />
          <span>Products</span>
        </NavLink>

        <NavLink to='/suppliers' onClick={() => setIsSidebarOpen(false)}
          className={({ isActive }) => `mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition cursor-pointer
            ${isActive ? "bg-blue-600" : " hover:bg-slate-800"}
        `}>
          <FiTruck size={20} />
          <span>Suppliers</span>
        </NavLink>

        {/* MANAGEMENT */}

        <p className="px-6 mt-8 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Management
        </p>

        {/* Sales - collapsible group */}
        <button
          type="button"
          onClick={() => setIsSalesOpen((prev) => !prev)}
          className={`w-full mx-3 mb-1 flex items-center justify-between gap-3 rounded-lg px-4 py-3
           transition cursor-pointer ${isSalesActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
          style={{ width: "calc(100% - 1.5rem)" }}
        >
          <span className="flex items-center gap-3">
            <FiTrendingUp size={20} />
            <span>Sales</span>
          </span>
          <FiChevronDown
            size={16}
            className={`transition-transform duration-200 ${isSalesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isSalesOpen && (
          <div className="ml-6 mr-3 mb-2 flex flex-col gap-1 border-l border-slate-700 pl-3">
            <NavLink to="/orders" onClick={() => setIsSidebarOpen(false)} className={subLinkClass}>
              <FiShoppingCart size={17} />
              <span>Orders</span>
            </NavLink>

            <NavLink to="/returns" onClick={() => setIsSidebarOpen(false)} className={subLinkClass}>
              <FiRotateCcw size={17} />
              <span>Returns</span>
            </NavLink>

            <NavLink to="/receivedPayments" onClick={() => setIsSidebarOpen(false)} className={subLinkClass}>
              <FiDollarSign size={17} />
              <span>Payments received</span>
            </NavLink>
          </div>
        )}

        {/* Purchases - collapsible group */}
        <button
          type="button"
          onClick={() => setIsPurchasesOpen((prev) => !prev)}
         className={`w-full mx-3 mb-1 flex items-center justify-between gap-3 rounded-lg px-4 py-3
           transition cursor-pointer ${isSalesActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}
          style={{ width: "calc(100% - 1.5rem)" }}
        >
          <span className="flex items-center gap-3">
            <FiTruck size={20} />
            <span>Goods receiving</span>
          </span>
          <FiChevronDown
            size={16}
            className={`transition-transform duration-200 ${isPurchasesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isPurchasesOpen && (
          <div className="ml-6 mr-3 mb-2 flex flex-col gap-1 border-l border-slate-700 pl-3">
            <NavLink to="/purchases" onClick={() => setIsSidebarOpen(false)} className={subLinkClass}>
              <FiBox size={17} />
              <span>Purchases</span>
            </NavLink>

            <NavLink to="/returns" onClick={() => setIsSidebarOpen(false)} className={subLinkClass}>
              <FiRotateCcw size={17} />
              <span>Returns</span>
            </NavLink>

            <NavLink to="/madePayments" onClick={() => setIsSidebarOpen(false)} className={subLinkClass}>
              <FiCreditCard size={17} />
              <span>Make a payment</span>
            </NavLink>
          </div>
        )}

        {/* Accounts */}

        <p className="px-6 mt-8 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Accounts
        </p>

        <NavLink to="/accounts"
          className={({ isActive }) => `mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition cursor-pointer
            ${isActive ? "bg-blue-600" : " hover:bg-slate-800"}
        `}>
          <FiBriefcase size={20} />
          <span>Accounts</span>
        </NavLink>

        {/* Expenses */}

        <p className="px-6 mt-8 mb-3 text-xs uppercase tracking-widest text-slate-500">
          Expenses
        </p>

        <NavLink to="/expenses"
          className={({ isActive }) => `mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition cursor-pointer
            ${isActive ? "bg-blue-600" : " hover:bg-slate-800"}
        `}>
          <FiBriefcase size={20} />
          <span>Expenses</span>
        </NavLink>

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
        <div className="flex items-center gap-3 rounded-lg px-4 py-3
         hover:bg-red-600 transition cursor-pointer"
         onClick={handleSubmitt}
         >
          <FiLogOut size={20} />
          <span>Logout</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;