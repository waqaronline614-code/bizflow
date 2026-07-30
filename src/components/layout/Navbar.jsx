import {
  FiSearch,
  FiBell,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

function Navbar({setIsSidebarOpen}) {
  return (
    <header className="bg-slate-200 border-b border-slate-300 shadow-sm px-4  fixed top-0 left-0 right-0 h-16 z-50
     md:px-6 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button className="md:hidden text-2xl text-slate-700 hover:text-blue-600" onClick={() => setIsSidebarOpen(true)}>
          <FiMenu />
        </button>

        {/* Page Title */}
        <h2 className="hidden md:block text-2xl font-semibold text-blue-600">
          Dashboard
        </h2>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* Search */}
        <div className="relative hidden lg:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />

          <input
            type="text"
            placeholder="Search customers, orders, products"
            className="w-80 xl:w-96 pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notification */}
        <button className="text-slate-600 hover:text-blue-600 text-2xl transition">
          <FiBell />
        </button>

        {/* Settings */}
        <button className="hidden sm:block text-slate-600 hover:text-blue-600 text-2xl transition">
          <FiSettings />
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-8 border-l border-slate-400"></div>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            WS
          </div>

          <div className="hidden md:block leading-tight">
            <p className="font-semibold text-slate-800">
              Waqar Shah
            </p>

            <p className="text-sm text-slate-500">
              Administrator
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;