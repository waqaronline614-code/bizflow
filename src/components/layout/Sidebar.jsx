function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        BizFlow
      </h1>

      <nav className="space-y-4">
        <p>🏠 Dashboard</p>
        <p>👥 Customers</p>
        <p>📦 Products</p>
        <p>🚚 Suppliers</p>
        <p>🛒 Purchases</p>
        <p>🧾 Orders</p>
        <p>💳 Payments</p>
        <p>📊 Reports</p>
        <p>⚙ Settings</p>
      </nav>
    </aside>
  );
}

export default Sidebar;