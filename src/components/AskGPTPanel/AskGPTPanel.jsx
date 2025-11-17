import React from "react";
import JSON5 from "json5";
import { parse as secureParse } from "secure-json-parse";
import { Button, Input, Space, Typography, Skeleton, Avatar } from "antd";
import {
  ArrowUpOutlined,
  AudioOutlined,
  FileTextOutlined,
  BulbOutlined,
  MailOutlined,
  MessageOutlined,
  PaperClipOutlined,
  EditOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeMode } from "../../context/ThemeContext";
import { useSelector } from "react-redux";

const AskGPTPanel = ({
  prompt,
  setPrompt,
  handleAskAI,
  chatEndRef,
  isAskingAI = false,
}) => {
  const { token, isDark } = useThemeMode();
  const { loading: ailoading, messages } = useSelector((s) => s.aiSuggestion);

  const sanitizeResponse = (text) => {
    if (typeof text !== "string") return text;
    const escapeHtml = (s) => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Normalize code fences label
    let t = text.replace(/```\s*json\s*/gi, "```");

    // Extract code blocks first and replace with placeholders
    const codeBlocks = [];
    t = t.replace(/```\s*\n([\s\S]*?)\n```/g, (m, inner) => {
      const trimmed = inner.trim();
      let pretty = trimmed;
      try {
        const parsed = secureParse(trimmed, null, {
          protoAction: "remove",
          constructorAction: "remove",
        });
        pretty = JSON.stringify(parsed, null, 2);
      } catch {
        try {
          const parsed5 = JSON5.parse(trimmed);
          pretty = JSON.stringify(parsed5, null, 2);
        } catch {
          pretty = inner;
        }
      }
      const html = `<pre><code>${escapeHtml(pretty)}</code></pre>`;
      codeBlocks.push(html);
      return `%%CODE_BLOCK_${codeBlocks.length - 1}%%`;
    });

    // Ensure numbered items start on new line
    t = t.replace(/\s*(\d+\.\s+\*\*[^*]+?\*\*)/g, (m, p1, offset) => (offset === 0 ? "" : "\n") + p1);
    t = t.replace(/(^|[^\n])\s*(\d+\.\s+)/g, (m, p1, p2, offset) => (offset === 0 ? p2 : p1 + "\n" + p2));
    t = t.replace(/^\n+/, "");

    // Escape remaining and convert bold (**text**) to <strong>
    t = escapeHtml(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Restore code blocks
    t = t.replace(/%%CODE_BLOCK_(\d+)%%/g, (m, idx) => codeBlocks[Number(idx)] || "");

    // Remove any remaining stray triple backticks (e.g., trailing ```)
    t = t.replace(/```/g, "").trim();

    return t;
  };

  const quickActions = [
    { icon: <EditOutlined />, label: "Summary issue", color: "#fa8c16" },
    { icon: <BulbOutlined />, label: "Suggest solution", color: "#52c41a" },
    {
      icon: <MailOutlined />,
      label: "Write mail for broker",
      color: "#722ed1",
    },
    {
      icon: <CommentOutlined />,
      label: "Write message for driver",
      color: "#1890ff",
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: isDark ? "#2F2F37" : "#FAFAFA",
        borderLeft: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          
        }}
      >
        <Typography.Title
          level={5}
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: token.colorTextHeading,
          }}
        >
          ✦ Ask Ai
        </Typography.Title>
      </div>

      {/* Welcome Message & Quick Actions */}
      {(!messages || messages.length === 0) && (
        <div
          style={{
            padding: "60px 24px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Typography.Title
            level={3}
            style={{
              textAlign: "center",
              marginBottom: 4,
              fontWeight: 600,
              fontSize: 24,
              color: token.colorTextHeading,
            }}
          >
            Good to see you, Sean!
          </Typography.Title>
          <Typography.Text
            style={{
              textAlign: "center",
              marginBottom: 48,
              fontSize: 16,
              color: token.colorTextSecondary,
            }}
          >
            Ask me anything.
          </Typography.Text>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              width: "100%",
            }}
          >
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                onClick={() => {
                  setPrompt(action.label);
                  handleAskAI();
                }}
                style={{
                  height: 38,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  paddingLeft: 14,
                  paddingRight: 14,
                  borderRadius: 10,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: token.colorBgContainer,
                  color: token.colorText,
                  fontWeight: 500,
                  fontSize: 15,
                }}
                icon={
                  <span style={{ color: action.color, fontSize: 18 }}>
                    {action.icon}
                  </span>
                }
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Chat History */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <AnimatePresence>
          {Array.isArray(messages) && messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* User message */}
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <Typography.Text
                  style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    marginBottom: 4,
                  }}
                >
                  You • {new Date(msg.timestamp).toLocaleTimeString()}
                </Typography.Text>
                <div
                  style={{
                    background: token.colorPrimaryBg,
                    color: token.colorTextBase,
                    padding: "10px 14px",
                    borderRadius: 10,
                    display: "inline-block",
                    maxWidth: "85%",
                    fontSize: 14,
                    textAlign: "left",
                  }}
                >
                  {msg.prompt}
                </div>
              </div>

              {/* AI response */}
              {msg.response ? (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Avatar
                      size={32}
                      style={{
                        background: token.colorPrimary,
                        fontSize: 14,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      AI
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Typography.Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextSecondary,
                          marginBottom: 4,
                          display: "block",
                        }}
                      >
                        AI Bot • {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography.Text>
                      <div
                        style={{
                          background: token.colorBgContainer,
                          color: token.colorText,
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: `1px solid ${token.colorBorderSecondary}`,
                          fontSize: 14,
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                        }}
                      dangerouslySetInnerHTML={{ __html: sanitizeResponse(msg.response) }}
                      >
                      </div>
                    </div>
                  </div>

                  {msg.suggestions?.length > 0 && (
                    <Space wrap style={{ marginTop: 8 }}>
                      {msg.suggestions.map((s, idx) => (
                        <Button
                          key={idx}
                          size="small"
                          onClick={() => {
                            setPrompt(s);
                            handleAskAI();
                          }}
                          style={{
                            borderRadius: 6,
                            fontSize: 13,
                            border: `1px solid ${token.colorBorderSecondary}`,
                          }}
                        >
                          {s}
                        </Button>
                      ))}
                    </Space>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 4,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    width: "fit-content",
                  }}
                >
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ position: "relative" }}>
          <Input.TextArea
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey && !isAskingAI) {
                e.preventDefault();
                handleAskAI();
              }
            }}
            disabled={isAskingAI}
            autoSize={{ minRows: 3, maxRows: 8 }}
            style={{
              borderRadius: 12,
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              fontSize: 15,
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 42,
              paddingRight: 92,
              resize: "none",
            }}
          />
          {/* Attachment icon bottom-left */}
          <PaperClipOutlined
            style={{
              position: "absolute",
              left: 14,
              bottom: 12,
              color: token.colorTextSecondary,
              fontSize: 18,
              cursor: "pointer",
            }}
          />
          {/* Right controls: mic + send */}
          <Space
            size={8}
            style={{
              position: "absolute",
              right: 12,
              bottom: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: token.colorPrimaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="Voice input"
            >
              <AudioOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
            </div>
            <Button
              type="primary"
              shape="circle"
              icon={<ArrowUpOutlined />}
              loading={ailoading || isAskingAI}
              disabled={isAskingAI || !prompt.trim()}
              onClick={handleAskAI}
              style={{ width: 36, height: 36 }}
            />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default AskGPTPanel;
