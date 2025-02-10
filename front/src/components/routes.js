// src/routes.js

import Dashboard from "../pages/dashboard";
import Register from "../pages/register";
import Logs from "../pages/logs";
import Reports from "../pages/reports";
import Salespersons from "../pages/salespersons";
import Expenses from "../pages/expenses";
import Products from "../pages/products";
import Sales from "../pages/sales";
import Customers from "../pages/customers";

const routes = [
  { key: "0", path: "/", component: Dashboard, label: "Dashboard" },
  { key: "1", path: "/products", component: Products, label: "Inventory" },
  { key: "2", path: "/sales", component: Sales, label: "Sales" },
  { key: "3", path: "/customers", component: Customers, label: "Customers" },
  { key: "4", path: "/expenses", component: Expenses, label: "Expenses" },
  {
    key: "5",
    path: "/salespersons",
    component: Salespersons,
    label: "Salespersons",
  },
  { key: "6", path: "/reports", component: Reports, label: "Reports" },
  { key: "7", path: "/logs", component: Logs, label: "Logs" },
  { key: "8", path: "/register", component: Register, label: "Add User" },
  { key: "9", path: "/log-out", component: Dashboard, label: "Log Out" },
];

export default routes;
