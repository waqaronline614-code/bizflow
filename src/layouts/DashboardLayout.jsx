import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

      {/* Body */}
      <div className="flex">

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 p-8 overflow-x-auto min-h-full">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;