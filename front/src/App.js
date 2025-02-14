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
import Register from "./pages/register";
import Login from "./pages/login";
import AddProduct from "./pages/products/addProduct";
import AddSale from "./pages/sales/addSale";
import UpdateProduct from "./pages/products/updateProduct";
import UpdateSale from "./pages/sales/updateSale";

//axios.defaults.baseURL = "http://localhost:3001/EasyManager";
axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  "https://easy-manager2-0-server.vercel.app/EasyManager";

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/salespersons" element={<Salespersons />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-sale" element={<AddSale />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/update-sale/:id" element={<UpdateSale />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
