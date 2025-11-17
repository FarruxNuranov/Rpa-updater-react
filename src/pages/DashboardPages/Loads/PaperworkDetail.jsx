import React from "react";
import { Modal, Button, Typography } from "antd";
import { PhoneOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useThemeMode } from "../../../context/ThemeContext";
import PaperworkLeftPanel from "./components/PaperworkLeftPanel";
import PaperworkRightPanel from "./components/PaperworkRightPanel";

const PaperworkDetail = ({ open, onClose, load }) => {
  const { token, isDark } = useThemeMode();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1260}
  
      centered
      closable={false}
      styles={{
        content: {
          background: isDark ? "#26262C" : "#FFFFFF",
          borderRadius: 8,
          padding: 0,
        },
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography.Text
            strong
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: "0%",
              color: token.colorTextHeading,
            }}
          >
            Paperwork
          </Typography.Text>

          <Button
            onClick={onClose}
            style={{
              borderRadius: 8,
              width: 40,
              height: 40,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark ? "#26262C" : "#FFFFFF",
            }}
          >
            X
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
    
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: "0 0 760px",
        
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            boxSizing: "border-box",
          }}
        >
          {/* header actions */}
          <div
            style={{
              padding: "16px 24px 0 24px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Button
                type="default"
                size="large"
                style={{
                  width: 156,
                  borderRadius: 8,
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: "0%",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                icon={<PhoneOutlined />}
              >
                Call to Driver
              </Button>

              <Button
                type="default"
                size="large"
                style={{
                  width: 140,
                  borderRadius: 8,
                  height: 40,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: token.colorPrimary,
                }}
              >
                Go to Chat
                <ArrowRightOutlined style={{ fontSize: 16 }} />
              </Button>

              <Button
                type="primary"
                size="large"
                style={{
                  width: 243,
                  borderRadius: 8,
                  height: 40,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Send Reminder to Driver
                <ArrowRightOutlined style={{ fontSize: 16 }} />
              </Button>
            </div>
          </div>

          {/* main left content */}
          <PaperworkLeftPanel />
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: "1 1 500px",
          
            
          }}
        >
          <PaperworkRightPanel />
        </div>
      </div>
    </Modal>
  );
};

export default PaperworkDetail;
