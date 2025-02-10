import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
