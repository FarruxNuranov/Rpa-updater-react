import React from "react";
import { Avatar, Button, Tag, Typography, Space, Skeleton } from "antd";
import {
  DoubleRightOutlined,
  StopOutlined,
  CopyOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import styles from "./TaskCard.module.scss";
import { CATEGORIES } from "../../config/tickets";
import { useThemeMode } from "../../context/ThemeContext"; // ✅ глобальная тема

const { Text } = Typography;

const TaskCard = ({ task, onClick, loading = false }) => {
  const { token, isDark } = useThemeMode();

  // === 🔹 Скелетон состояния ===
  if (loading) {
    return (
      <div
        className={styles.card}
        style={{
          background: isDark ? "#26262C" : "#FFFFFF",
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: 10,
          boxShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.45)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          padding: 16,
          marginBottom: 8,
        }}
      >
        {/* Заголовок */}
        <Skeleton.Input
          active
          size="small"
          style={{
            width: "70%",
            height: 20,
            marginBottom: 12,
            borderRadius: 4,
          }}
        />

        {/* Info Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Левая часть - категория и ID */}
          <Space direction="vertical" size={6}>
            <Skeleton.Button
              active
              size="small"
              style={{
                width: 80,
                height: 22,
                borderRadius: 6,
              }}
            />
            <Skeleton.Button
              active
              size="small"
              style={{
                width: 90,
                height: 24,
                borderRadius: 6,
              }}
            />
          </Space>

          {/* Правая часть - аватар и кнопка */}
          <Space direction="vertical" size={6} align="end">
            <Space size={6}>
              <Skeleton.Avatar
                active
                size="small"
                shape="circle"
              />
            </Space>
            <Skeleton.Button
              active
              size="small"
              style={{
                width: 110,
                height: 22,
                borderRadius: 4,
              }}
            />
          </Space>
        </div>
      </div>
    );
  }

  // === 🔹 Если нет данных (например, пустая задача)
  if (!task) return null;

  // === 🔹 Обработчик копирования
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(task.id);
  };

  // === 🔹 Открыть ссылку messageId в новой вкладке
  const messageUrl = String(task?.messageId || "").split(" (ID:")[0].trim();
  const handleOpenMessage = (e) => {
    e.stopPropagation();
    if (!messageUrl) return;
    window.open(messageUrl, "_blank", "noopener,noreferrer");
  };

  // === 🔹 Основной рендер карточки
  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{
        background: isDark ? "#26262C" : "#FFFFFF",
        border: `1px solid ${token.colorBorderSecondary}`,
       
        color: token.colorText,
        cursor: "pointer",
        borderRadius: 10,
      }}

    >
      {/* 🔹 Заголовок */}
      <Text
        strong
        className={styles.title}
        style={{
          color: token.colorTextHeading,
        }}
      >
        {task.text || "No title"}
      </Text>

      <div className={styles.infoRow}>
        {/* 🔹 Левая часть */}
        <Space direction="vertical" size={6}>
          <Tag
            className={styles.category}
            style={{
              background: isDark
                ? "rgba(146, 84, 222, 0.15)"
                : "rgba(146, 84, 222, 0.08)",
              color: isDark ? "#b998ff" : "#722ed1",
              borderColor: "transparent",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {CATEGORIES[task.department] || "—"}
          </Tag>

          <div
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              background: isDark ? "#141414" : "#fafafa",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "2px 6px",
              cursor: "pointer",
            }}
            className={styles.idBox}
            onClick={handleCopy}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = token.colorPrimary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = token.colorBorderSecondary)
            }
          >
            <Text
              strong
              className={styles.idText}
              style={{
                color: token.colorText,
                fontSize: 13,
              }}
            >
              {task.id.slice(0, 6).toUpperCase()}
            </Text>
            <CopyOutlined
              className={styles.copyIcon}
              style={{ color: token.colorTextSecondary, fontSize: 13 }}
            />
          </div>
        </Space>

        {/* 🔹 Правая часть */}
        <div className={styles.RightBox}>
          <Space direction="horizontal" align="end" size={6}>
            {task.status === 3 ? (
              <StopOutlined
                className={styles.statusIconGrey}
                style={{
                  color: token.colorTextSecondary,
                }}
              />
            ) : (
              <DoubleRightOutlined
                rotate={task.priority === 0 ? -90 : task.priority === 1 ? 0 : 90}
                className={styles.priorityIcon}
                style={{
                  color:
                    task.priority === 0
                      ? "#ff4d4f"
                      : task.priority === 1
                      ? "#faad14"
                      : "#52c41a",
                  fontSize: 16,
                }}
              />
            )}

            <Avatar
              size="small"
              className={styles.avatar}
              style={{
                background: token.colorPrimary,
                color: "#fff",
              }}
            >
              {(task.writerName || "?").slice(0, 2).toUpperCase()}
            </Avatar>
          </Space>

          <Button
            type="link"
            icon={<ArrowRightOutlined />}
            className={styles.linkBtn}
            style={{
              color: token.colorPrimary,
              fontWeight: 500,
            }}
            onClick={handleOpenMessage}
            disabled={!messageUrl}
            title={messageUrl ? `Open: ${messageUrl}` : "No message link"}
          >
            Go to Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;