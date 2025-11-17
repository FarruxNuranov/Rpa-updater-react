import { createBrowserRouter, Navigate } from "react-router-dom";

import Home from "../pages/DashboardPages/Home/Home";
import Tasks from "../pages/DashboardPages/Tasks/Tasks";
import LoginPage from "../pages/Auth/LoginPage";
import Loads from "../pages/DashboardPages/Loads/Loads";
import Reports from "../pages/DashboardPages/Reports/Reports";
import Users from "../pages/DashboardPages/Users/Users";
import UsersDetail from "../pages/DashboardPages/Users/UsersDetail";
import Emails from "../pages/DashboardPages/Emails/Emails";
import Brokers from "../pages/DashboardPages/Brokers/Brokers";
import Drivers from "../pages/DashboardPages/Drivers/Drivers";
import Equipments from "../pages/DashboardPages/Equipments/Equipments";
import Companies from "../pages/DashboardPages/Companies/Companies";
import Settings from "../pages/DashboardPages/Settings/Settings";
import Support from "../pages/DashboardPages/Support/Support";

import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  // 🔓 Публичная часть — логин
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },

  // 🔒 Приватная часть — только для авторизованных
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "tasks", element: <Tasks /> }, // ✅ список тикетов
          { path: "loads", element: <Loads /> },
          { path: "reports", element: <Reports /> },
          { path: "emails", element: <Emails /> },
          { path: "users", element: <Users /> },
          { path: "users/:id", element: <UsersDetail /> },
          { path: "brokers", element: <Brokers /> },
          { path: "drivers", element: <Drivers /> },
          { path: "equipments", element: <Equipments /> },
          { path: "companies", element: <Companies /> },
          { path: "settings", element: <Settings /> },
          { path: "support", element: <Support /> },
        ],
      },
    ],
  },

  // 🔁 Неизвестные пути → редиректим на /login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
