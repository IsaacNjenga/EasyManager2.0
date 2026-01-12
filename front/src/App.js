import React, { createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Dashboard from "./pages/dashboard/dashboard";
import Products from "./pages/products/products";
import Sales from "./pages/sales/sales";
import Customers from "./pages/customers/customers";
import Expenses from "./pages/expenses/expenses";
import Salespersons from "./pages/salespersons/salespersons";
import Reports from "./pages/reports/reports";
import Logs from "./pages/logs/logs";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import AddProduct from "./pages/products/addProduct";
import AddSale from "./pages/sales/addSale";
import UpdateProduct from "./pages/products/updateProduct";
import UpdateSale from "./pages/sales/updateSale";
import AddExpense from "./pages/expenses/addExpense";
import ProtectedRoutes from "./components/protectedRoutes";
import Navbar from "./components/navbar";
import { Spin } from "antd";
import { useAuth } from "./contexts/AuthContext";

//axios.defaults.baseURL = "http://localhost:3001/EasyManager";
axios.defaults.baseURL =
  "https://easy-manager2-0-server.vercel.app/EasyManager";
axios.defaults.withCredentials = true;

export const UserContext = createContext();

function App() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spin fullscreen tip="Authenticating..." size="large" />;

  return (
    <>
      {!isAuthenticated ? (
        <Login />
      ) : (
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Navbar />
              </ProtectedRoutes>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="salespersons" element={<Salespersons />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logs" element={<Logs />} />
            <Route path="register" element={<Register />} />{" "}
            <Route path="add-product" element={<AddProduct />} />
            <Route path="add-sale" element={<AddSale />} />
            <Route path="update-product/:id" element={<UpdateProduct />} />
            <Route path="update-sale/:id" element={<UpdateSale />} />
            <Route path="add-expense" element={<AddExpense />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
