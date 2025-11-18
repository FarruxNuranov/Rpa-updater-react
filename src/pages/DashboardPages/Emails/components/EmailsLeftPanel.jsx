import React from "react";
import { Segmented, Input, Avatar, Tag, Typography } from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  ExclamationOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const EmailsLeftPanel = ({
  emails,
  activeTab,
  onChangeTab,
  search,
  onChangeSearch,
  selectedEmailId,
  onSelectEmail,
  statusColorMap,
  token,
  isDark,
}) => {
  return (
    <div
      style={{
        width: 360,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        flexDirection: "column",
        background: isDark ? "#1f1f23" : "#FFFFFF",
      }}
    >
      <div
        style={{
          padding: "20px",
        }}
      >
        <Segmented
          size="large"
          value={activeTab}
          onChange={onChangeTab}
          options={[
            { label: "All Emails", value: "all" },
            { label: "RateCons", value: "ratecons" },
            { label: "Critical", value: "critical" },
          ]}
          style={{
            width: "100%",
            background: isDark ? "#1f1f23" : "#f5f5f5",
            borderRadius: 6,
            padding: 2,
            border: "none",
          }}
          block
        />
      </div>

      <div style={{ padding: "0 16px 12px 16px" }}>
        <Input
          type="default"
          size="large"
          allowClear
          placeholder="Search"
          suffix={
            <SearchOutlined
              style={{ color: token.colorTextSecondary, fontSize: 16 }}
            />
          }
          value={search}
          onChange={(e) => onChangeSearch(e.target.value)}
          style={{
            borderRadius: 6,
            borderColor: "#d9d9d9",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 8px 12px 8px",
        }}
      >
        {emails.map((email) => {
          const isActive = email.id === selectedEmailId;
          return (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              style={{
                display: "flex",
                padding: "10px 8px",
                borderRadius: 10,
                cursor: "pointer",
                background: isActive
                  ? isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#F5F5F5"
                  : "transparent",
                marginBottom: 4,
              }}
            >
              <Avatar type="default" style={{ marginRight: 12,backgroundColor: token.colorPrimary, }}>{email.senderName[0]}</Avatar>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text strong ellipsis style={{ maxWidth: 180, fontSize: 14 }}>
                    {email.senderName}
                  </Text>
                  {(() => {
                    if (!email.status) return null;

                    let color =
                      statusColorMap[email.status] || token.colorPrimary;
                    let icon = null;

                    if (email.status === "ok") {
                      icon = (
                        <CheckOutlined
                          style={{ fontSize: 12, color: "#52c41a" }}
                        />
                      );
                      color = "#52c41a";
                    } else if (email.status === "warning") {
                      icon = (
                        <ExclamationOutlined
                          style={{ fontSize: 12, color: "#faad14" }}
                        />
                      );
                      color = "#faad14";
                    } else if (email.status === "critical") {
                      icon = (
                        <AppstoreOutlined
                          style={{ fontSize: 12, color: token.colorPrimary }}
                        />
                      );
                      color = token.colorPrimary;
                    }

                    return (
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 8,
                          border: `1px solid ${color}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isDark ? "#1f1f23" : "#FFFFFF",
                        }}
                      >
                        {icon}
                      </span>
                    );
                  })()}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: token.colorText,
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {email.subject}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {email.preview}
                </div>

                {email.tags?.length ? (
                  <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                    {email.tags.map((tag, idx) => (
                      <Tag key={idx} color="#e6f4ff" style={{ margin: 0 }}>
                        <span style={{ fontSize: 11, color: token.colorText }}>
                          {tag}
                        </span>
                      </Tag>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmailsLeftPanel;
