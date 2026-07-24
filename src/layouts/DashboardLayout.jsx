import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1">

        <Sidebar />

        <main className="flex-1 bg-slate-100 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;