import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

//axios.defaults.baseURL = "http://localhost:3001/EasyManager";
axios.defaults.baseURL =
  "https://easy-manager2-0-server.vercel.app/EasyManager";
axios.defaults.withCredentials = true;

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
            setIsAuthenticated(true);
          }
        })
        .catch((err) => {
          console.log("Error during user verification:", err);
        });
    }
  }, []);

  return (
    <>
      <UserContext.Provider
        value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoutes>
                  <Products />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoutes>
                  <Sales />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoutes>
                  <Customers />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoutes>
                  <Expenses />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/salespersons"
              element={
                <ProtectedRoutes>
                  <Salespersons />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoutes>
                  <Reports />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoutes>
                  <Logs />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoutes>
                  <Register />
                </ProtectedRoutes>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/add-product"
              element={
                <ProtectedRoutes>
                  <AddProduct />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-sale"
              element={
                <ProtectedRoutes>
                  <AddSale />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-product/:id"
              element={
                <ProtectedRoutes>
                  <UpdateProduct />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/update-sale/:id"
              element={
                <ProtectedRoutes>
                  <UpdateSale />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/add-expense"
              element={
                <ProtectedRoutes>
                  <AddExpense />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
