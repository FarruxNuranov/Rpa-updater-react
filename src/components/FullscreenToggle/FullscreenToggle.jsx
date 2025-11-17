import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "antd";
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

/**
 * 🔹 Компонент для включения / выключения полноэкранного режима браузера
 */
const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Обработчик для синхронизации состояния при ESC / выходе
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  return (
    <Tooltip
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      placement="bottom"
    >
      <Button
        type="text"
        onClick={toggleFullscreen}
        icon={
          isFullscreen ? (
            <FullscreenExitOutlined style={{ fontSize: 18 }} />
          ) : (
            <FullscreenOutlined style={{ fontSize: 18 }} />
          )
        }
        style={{
          borderRadius: 8,
          height: 36,
          width: 36,
        }}
      />
    </Tooltip>
  );
};

export default FullscreenToggle;