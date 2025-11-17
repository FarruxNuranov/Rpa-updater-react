import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = useSelector((s) => s.auth.token) || localStorage.getItem("token");

  // 🔒 если токена нет — на страницу логина
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ если токен есть — показываем вложенные маршруты
  return <Outlet />;
};

export default PrivateRoute;