// src/Layout/Auth/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Card, ConfigProvider, theme, Typography } from "antd";
import { motion } from "framer-motion";

const { Text } = Typography;

const AuthLayout = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#262962",
          borderRadius: 12,
          fontFamily: "Inter, sans-serif",
          colorBgBase: "#f7f8fa",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f0f2f5, #e6ebf1)",
          flexDirection: "column",
          padding: 20,
        }}
      >
        {/* 🔹 Логотип и название */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Text
            strong
            style={{
              fontSize: 22,
              color: "#1677FF",
              letterSpacing: 0.3,
            }}
          >
            RPA Updater
          </Text>
        </div>

        {/* 🔹 Карточка логина с анимацией */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card
            style={{
              width: 500,
              padding: "24px 24px 16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.02)",
              background: "#fff",
              borderRadius: 12,
              textAlign: "center",
            }}
            bodyStyle={{ padding: 0 }}
          >
            {/* 🔹 Контент формы логина */}
            <div style={{ padding: "20px 24px 16px" }}>
              <Outlet />
            </div>
          </Card>
        </motion.div>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;