import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { notification } from "antd";
import { store } from "./store/store";
import { router } from "./routes/Routes";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ подключаем твой ThemeProvider
import { setAuth, logout } from "./api/auth/authSlice";

import "antd/dist/reset.css";
import "./styles/main.scss";

notification.config({
  getContainer: () => document.body,
  placement: "bottomRight",
  duration: 3,
});

// 🔄 Синхронизация авторизации между вкладками через localStorage
// Срабатывает только в ДРУГИХ вкладках, где произошли изменения
window.addEventListener("storage", (e) => {
  if (e.key === "token") {
    const newToken = e.newValue;
    if (newToken) {
      const expireDate = localStorage.getItem("expireDate");
      store.dispatch(setAuth({ accessToken: newToken, expireDate }));
    } else {
      store.dispatch(logout());
    }
  }
  if (e.key === "expireDate") {
    const token = localStorage.getItem("token");
    const expireDate = e.newValue;
    if (token) {
      store.dispatch(setAuth({ accessToken: token, expireDate }));
    }
  }
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* ✅ Всё приложение теперь получает тему */}
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>
);