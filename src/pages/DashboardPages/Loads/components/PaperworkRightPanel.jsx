import React from "react";
import { Typography } from "antd";
import {
  FilePdfOutlined,
  FileImageOutlined,
  CloudDownloadOutlined,
  EyeOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useThemeMode } from "../../../../context/ThemeContext";
import { Maximize2 } from "iconsax-react";

const { Text } = Typography;

const mockFiles = [
  {
    id: 1,
    name: "Rate Confirmation.pdf",
    size: "200 KB",
    type: "pdf",
    url: "#",
  },
  {
    id: 2,
    name: "BOL-68126738.pdf",
    size: "200 KB",
    type: "pdf",
    url: "#",
  },
  {
    id: 3,
    name: "BOL-68126738.jpeg",
    size: "200 KB",
    type: "img",
    url: "#",
  },
];

const PaperworkRightPanel = () => {
  const { token, isDark } = useThemeMode();

  const handleOpen = (file) => {
    if (!file?.url || file.url === "#") return;
    window.open(file.url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (file) => {
    if (!file?.url || file.url === "#") return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  const renderFileIcon = (type) => {
    const baseStyle = {
      width: 32,
      height: 40,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 18,
      flexShrink: 0,
    };

    if (type === "pdf") {
      return (
        <div style={{ ...baseStyle, background: "#ff4d4f" }}>
          <FilePdfOutlined />
        </div>
      );
    }

    return (
      <div style={{ ...baseStyle, background: "#1677ff" }}>
        <FileImageOutlined />
      </div>
    );
  };

  return (
    <div
      style={{
        height: "100%",
        padding: "16px 24px 24px 24px",
        boxSizing: "border-box",
        borderRadius: 8,
       
        background: isDark ? "#1f1f23" : "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* header */}
      <Text
        strong
        style={{
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        Documents
      </Text>

      {/* files list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {mockFiles.map((file, index) => (
          <div
            key={file.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                index === mockFiles.length - 1
                  ? "none"
                  : `1px solid ${token.colorBorderSecondary}`,
              gap: 12,
            }}
          >
            {renderFileIcon(file.type)}

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "22px",
                  letterSpacing: "0%",
                }}
              >
                {file.name}
              </div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "20px",
                  letterSpacing: "0%",
                  color: token.colorTextSecondary,
                  marginTop: 2,
                }}
              >
                {file.size}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
           

              <button
                type="button"
                onClick={() => handleDownload(file)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: file.url === "#" ? "default" : "pointer",
                  color: token.colorPrimary,
                  padding: 0,
                }}
              >
                
                <CloudDownloadOutlined fontSize={20} />
              </button>
                 <button
                type="button"
                onClick={() => handleOpen(file)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: file.url === "#" ? "default" : "pointer",
                  color: token.colorPrimary,
                  padding: 0,
                }}
              >
                <Maximize2  color={token.colorPrimary} size={14}  />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* upload area */}
      <div
        style={{
          marginTop: 16,
          borderRadius: 12,
          border: `1px dashed ${token.colorBorderSecondary}`,
          background: isDark ? "rgba(0,0,0,0.35)" : "#FAFAFA",
          padding: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <InboxOutlined
            style={{
              fontSize: 28,
              color: token.colorPrimary,
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: token.colorText,
            }}
          >
            Click or drag file to this area to upload
          </div>
          <div
            style={{
              fontSize: 12,
              color: token.colorTextSecondary,
            }}
          >
            Supported formats: Images, PDF
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperworkRightPanel;
