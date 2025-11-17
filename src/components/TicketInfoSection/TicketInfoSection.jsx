import React from "react";
import { Typography, Space, Avatar, Skeleton } from "antd";
import {
  DoubleRightOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useThemeMode } from "../../context/ThemeContext";
import { PRIORITY } from "../../config/tickets";

const TicketInfoSection = ({ ticket, loading }) => {
  const { token } = useThemeMode();

  if (loading) {
    return (
      <div
        style={{
          paddingBottom: 20,
          borderBottom: `1px dashed ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN SKELETON */}
          <div>
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="default" style={{ width: 200, marginBottom: 20 }} />
            
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="default" style={{ width: 100, marginBottom: 20 }} />
            
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <Skeleton.Avatar active size="small" />
              <Skeleton.Input active size="default" style={{ width: 120 }} />
            </div>
          </div>

          {/* RIGHT COLUMN SKELETON */}
          <div
            style={{
              borderLeft: `1px dashed ${token.colorBorderSecondary}`,
              paddingLeft: 24,
            }}
          >
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="default" style={{ width: 180, marginBottom: 20 }} />
            
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="default" style={{ width: 100, marginBottom: 20 }} />
            
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="default" style={{ width: 250, marginBottom: 20 }} />
            
            <Skeleton.Input active size="small" style={{ width: 150, marginBottom: 8 }} />
            <Skeleton.Input active size="default" style={{ width: 250 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingBottom: 20,
        borderBottom: `1px dashed ${token.colorBorderSecondary}`,
      }}
    >
      {/* === INFO GRID (left/right) === */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          {/* 🔹 CREATED DATE */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            Created issue date
          </Typography.Title>
          <Typography.Text style={{ display: "block", marginTop: 8 }}>
            {ticket?.createdAt
              ? new Date(ticket.createdAt).toLocaleString()
              : "—"}
          </Typography.Text>

          <div style={{ height: 20 }} />

          {/* 🔹 PRIORITY */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            Priority
          </Typography.Title>
          <Space size={8} style={{ marginTop: 8 }}>
            <DoubleRightOutlined
              rotate={
                ticket?.priority === 0 ? -90 : ticket?.priority === 1 ? 0 : 90
              }
              style={{
                color:
                  ticket?.priority === 0
                    ? "#ff4d4f"
                    : ticket?.priority === 1
                    ? "#faad14"
                    : "#52c41a",
                fontSize: 16,
              }}
            />
            <Typography.Text style={{ fontWeight: 500 }}>
              {PRIORITY[ticket?.priority] || "—"}
            </Typography.Text>
          </Space>

          <div style={{ height: 20 }} />

          {/* 🔹 ASSIGN */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            Assign
          </Typography.Title>
          <Space size={8} style={{ marginTop: 8 }}>
            <Avatar size="small">
              {ticket?.writerName?.slice(0, 2).toUpperCase() || "?"}
            </Avatar>
            <Typography.Text>
              {ticket?.writerName || "Unassigned"}
            </Typography.Text>
          </Space>
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            borderLeft: `1px dashed ${token.colorBorderSecondary}`,
            paddingLeft: 24,
          }}
        >
          {/* 🔹 LOAD ID */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            Load ID
          </Typography.Title>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              padding: "4px 8px",
              background: token.colorBgContainerDisabled,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: 6,
            }}
          >
            <Typography.Text strong style={{ fontSize: 13 }}>
              {ticket?.loadId || "AD12347"}
            </Typography.Text>
            <CopyOutlined
              style={{
                fontSize: 12,
                color: token.colorTextSecondary,
                cursor: "pointer",
              }}
            />
          </div>

          <div style={{ height: 20 }} />

          {/* 🔹 ETA */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            ETA
          </Typography.Title>
          <Space size={6} style={{ marginTop: 8 }}>
            <Typography.Text>{ticket?.eta || "1h 12m"}</Typography.Text>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ color: token.colorPrimary, fontSize: 14 }}>
                =============
              </div>
              <CarOutlined
                style={{ color: token.colorPrimary, fontSize: 16 }}
              />
              <div style={{ color: token.colorTextTertiary, fontSize: 14 }}>
                =============
              </div>
            </div>
          </Space>

          <div style={{ height: 20 }} />

          {/* 🔹 CURRENT LOCATION */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            Current location
          </Typography.Title>
          <Space size={6} style={{ marginTop: 8 }}>
            <EnvironmentOutlined style={{ color: token.colorPrimary }} />
            <Typography.Text>
              {ticket?.currentLocation || "147 Airport Loop Allendale SC 29810"}
            </Typography.Text>
          </Space>

          <div style={{ height: 20 }} />

          {/* 🔹 DROP OFF LOCATION */}
          <Typography.Title level={5} style={{ margin: 0 }}>
            Drop off location
          </Typography.Title>
          <Space size={6} style={{ marginTop: 8 }}>
            <EnvironmentOutlined style={{ color: token.colorError }} />
            <Typography.Text>
              {ticket?.dropOffLocation || "119 W.Main St. Haviland OH 45851"}
            </Typography.Text>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default TicketInfoSection;
