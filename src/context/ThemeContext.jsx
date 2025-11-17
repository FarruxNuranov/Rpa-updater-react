import React, { createContext, useContext, useState, useMemo } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🔹 Конфиг для Ant Design
  const themeConfig = useMemo(
    () => ({
      algorithm: isDark
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
      token: {
        
        fontFamily: "Inter, sans-serif",
      },
    }),
    [isDark]
  );

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};

// ✅ экспорт именованного провайдера
export const useThemeMode = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { token } = antdTheme.useToken();
  return { isDark, toggleTheme, token };
};