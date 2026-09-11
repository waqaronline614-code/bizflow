import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Signup from "../pages/SignUp"
import NotFound from '../pages/NotFound'
import DashboardLayout from '../layouts/DashboardLayout'
import Customers from '../pages/Customers'
import Products from "../pages/products";
import Suppliers from "../pages/Suppliers";
import Purchases from "../pages/Purchases";
import ProtectedRoute from "../routes/ProtectedRoute";
import Orders from "../pages/Orders"

function AppRoutes()
{
    return(
        <Routes>
           <Route path="/" element={<Navigate to="/login" replace />} />
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute>
            <DashboardLayout/></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard/>} />  
            <Route path="/customers" element={<Customers/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/suppliers" element={<Suppliers/>}/>
            <Route path="/purchases" element={<Purchases/>}/>
            <Route path="/orders" element={<Orders/>}/>
            </Route>
           <Route path="*" element={<NotFound/>} />
        </Routes>
    );
}

export default AppRoutes;