import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Signup from "../pages/SignUp"
import NotFound from '../pages/NotFound'
import DashboardLayout from '../layouts/DashboardLayout'
import Customers from '../pages/Customers'
import Products from "../pages/Products";
import Suppliers from "../pages/Suppliers";
import Purchases from "../pages/Purchases";
import ProtectedRoute from "../routes/ProtectedRoute";
import Orders from "../pages/Orders"
import ReceivedPayments from "../pages/ReceivedPayments"
import MadePayments from "../pages/Madepayments";
import Accounts from "../pages/Accounts";
import Expenses from "../pages/Expenses";
import ReportsHome from "../pages/reports/Reportshome"
import ProfitLossReport from "../pages/reports/ProfitLossReport"
import ReceivablesReport from "../pages/reports/Receivablesreport"
import PayablesReport from "../pages/reports/Payablesreport"
import StockReport from "../pages/reports/StockReport";
import SalesReport from "../pages/reports/SaleReports";
import PurchasesReport from "../pages/reports/PurchasesReport";



function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute>
                <DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/receivedPayments" element={<ReceivedPayments />} />
                <Route path="/madePayments" element={<MadePayments />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/reports" element={<ReportsHome />} />
                <Route path="/reports/profit-loss" element={<ProfitLossReport />} />
                <Route path="/reports/receivables" element={<ReceivablesReport />} />
                <Route path="/reports/payables" element={<PayablesReport />} />
                <Route path="/reports/stock" element={<StockReport />} />
                <Route path="/reports/sales" element={<SalesReport />} />
                <Route path="/reports/purchases" element={<PurchasesReport />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;