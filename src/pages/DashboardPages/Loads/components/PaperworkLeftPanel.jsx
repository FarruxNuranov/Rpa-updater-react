import React from "react";
import { Typography } from "antd";
import {
  ExclamationCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useThemeMode } from "../../../../context/ThemeContext";

const { Text } = Typography;

const PaperworkLeftPanel = () => {
  const { token, isDark } = useThemeMode();

  return (
    <div
      style={{
        padding: "16px 24px 24px 24px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* small status chips */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          { type: "ok", label: "Weight: 45,000 lbs" },
          { type: "ok", label: "Signature" },
          { type: "error", label: "PO number missing" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "16px",
              borderRadius: "12px",
              background: isDark ? "#26262C" : "#F9FAFB",
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            {item.type === "ok" ? (
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 20 }} />
            ) : (
              <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 20 }} />
            )}
            <Text
              style={{
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: "0%",
                color: token.colorText,
              }}
            >
              {item.label}
            </Text>
          </div>
        ))}
      </div>

      {/* big address cards examples */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {[
          { type: "error", title: "Pickup address" },
          { type: "ok", title: "Delivery address" },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              borderRadius: 16,
              background: isDark ? "#26262C" : "#F9FAFB",
              border: `1px solid ${token.colorBorderSecondary}`,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {item.type === "ok" ? (
                  <CheckCircleFilled
                    style={{ color: "#52c41a", fontSize: 20 }}
                  />
                ) : (
                  <CloseCircleFilled
                    style={{ color: "#ff4d4f", fontSize: 20 }}
                  />
                )}
                <Text strong style={{ fontSize: 14 }}>
                  {item.title}
                </Text>
              </div>

              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  color: token.colorPrimary,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Compare in map
              </button>
            </div>

            {/* body */}
            <div
              style={{
                marginTop: 4,
                paddingTop: 8,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
                fontSize: 13,
                lineHeight: "20px",
                color: token.colorText,
              }}
            >
              <div style={{ marginBottom: 6 }}>
                <strong>Rate Confirmation:</strong>
                <br />
                Industrial Park, 221 AVERANT IND. PARK, PARKERSBURG, WV, 26104
              </div>
              <div>
                <strong>BOL:</strong>
                <br />
                KIK Custom Products, 1601 Industrial BLVD NW, Conyers, GA, 30012
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperworkLeftPanel;
