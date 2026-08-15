import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import DashboardLayout from '../layouts/DashboardLayout'
import Customers from '../pages/Customers'
import Products from "../pages/products";

function AppRoutes()
{
    return(
        <Routes>
           <Route path="/" element={<Navigate to="/login" replace />} />
           <Route path="/login" element={<Login />} />
            <Route element={<DashboardLayout/>}>
            <Route path="/dashboard" element={<Dashboard/>} />  
            <Route path="/customers" element={<Customers/>}/>
            <Route path="/products" element={<Products/>}/>

            </Route>
           <Route path="*" element={<NotFound/>} />
        </Routes>
    );
}


export default AppRoutes;