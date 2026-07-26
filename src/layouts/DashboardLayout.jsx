import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";


function DashboardLayout() {
    
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

      {/* Sidebar + Content */}
      <div className="flex flex-1">

        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 bg-slate-100 p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;