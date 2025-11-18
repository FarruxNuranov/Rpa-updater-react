import React from "react";
import { Avatar, Input, Typography, Button } from "antd";
import {
  AppstoreOutlined,
  FilePdfOutlined,
  CloudDownloadOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  PaperClipOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Scan } from "iconsax-react";

const { Text } = Typography;

const EmailsRightPanel = ({ selectedEmail, token, isDark }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: isDark ? "#26262C" : "#F5F5F7",
      }}
    >
      {!selectedEmail ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: token.colorTextSecondary,
            fontSize: 14,
          }}
        >
          Select a chat to start messaging
        </div>
      ) : (
        <>
          {/* Header */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              background: isDark ? "#26262C" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                size={40}
                style={{ backgroundColor: token.colorPrimary, fontWeight: 500 }}
              >
                {selectedEmail.senderName[0]}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: 15 }}>
                  {selectedEmail.senderName}
                </Text>
                <div
                  style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    marginTop: 2,
                  }}
                >
                  clayton.kwiatkowski@tallgrassfreight.com
                </div>
              </div>
            </div>
<Button
type="default"
size="large"
 icon={<Scan color={token.colorPrimary} size={18} type="bold"/> }/>
            {/* <button
              type="button"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: isDark ? "#26262C" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <AppstoreOutlined
                style={{ fontSize: 16, color: token.colorPrimary }}
              />
            </button> */}
          </div>

          {/* Conversation body (упрощённый мок) */}
          <div
            style={{
              flex: 1,
              padding: 24,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Incoming email with PDF attachment */}
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: 678,
                width: "100%",
                background: isDark ? "#1f1f23" : "#FFFFFF",
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 1px 3px rgba(15,15,15,0.06)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid #f0f0f0",
              }}
            >
              {/* top row: pdf info + download */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 40,
                      borderRadius: 8,
                      background: "#ff4d4f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <FilePdfOutlined />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: token.colorText,
                      }}
                    >
                      Rate Confirmation.pdf
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: token.colorTextSecondary,
                        marginTop: 2,
                      }}
                    >
                      200 KB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    border: "none",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: token.colorPrimary,
                  }}
                >
                  <CloudDownloadOutlined style={{ fontSize: 18 }} />
                </button>
              </div>

              {/* email text */}
              <div
                style={{
                  fontSize: 13,
                  color: token.colorText,
                  lineHeight: 1.6,
                }}
              >
                Signed attached
                <br />
                <br />
                Kind Regards
                <br />
                Mark Brian
                <br />
                Dispatch Department
                <br />
                US DOT # 3927167
                <br />
                MC # 1454425
                <br />
                Phone: (513) 653-0671 ext: 135
                <br />
                Direct: (513) 493 0500
              </div>
            </div>

            {/* time under incoming */}
            <div
              style={{
                fontSize: 11,
                color: token.colorTextSecondary,
              }}
            >
              Today, 12:19
            </div>

            {/* Our reply bubble */}
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: 678,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <div
                style={{
                  background: "#E6F4FF",
                  borderRadius: 18,
                  padding: 16,
                  fontSize: 13,
                  color: token.colorText,
                  lineHeight: 1.6,
                }}
              >
                Team we are 15 miles away rolling towards shipper
                <br />
                <br />
                Could you please send the link of adress to driver as you always
                do @Clayton Kwiatkowski
                <br />
                <br />
                Phone: (513) 653-0671 EXT119
                <br />
                Fax: (513) 572-7421
                <br />
                MC#: 1454425
                <br />
                US DOT# 3927167
                <br />
                E-mail: james@ss/trucking.com
                <br />
                Address: 6933 Highland Greens DR #305A West Chester, OH 45069
              </div>

              {/* time under reply */}
              <div
                style={{
                  fontSize: 11,
                  color: token.colorTextSecondary,
                  marginTop: 2,
                  textAlign: "right",
                }}
              >
                Jan 19 2024, 12:19
              </div>
            </div>

            {/* Another incoming short message */}
            <div
              style={{
                alignSelf: "flex-start",
                maxWidth: 678,
                background: isDark ? "#1f1f23" : "#FFFFFF",
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 1px 3px rgba(15,15,15,0.06)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: token.colorText,
                  lineHeight: 1.6,
                }}
              >
                The correct address is directly on the rate con... what do you
                mean?
                <br />
                <br />
                Sincerely,
                <br />
                Clayton Kwiatkowski
              </div>
            </div>

            <div
              style={{
                fontSize: 11,
                color: token.colorTextSecondary,
              }}
            >
              Today, 12:27
            </div>

            {/* Our short follow-up reply */}
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: 678,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <div
                style={{
                  background: "#E6F4FF",
                  borderRadius: 18,
                  padding: 12,
                  fontSize: 13,
                  color: token.colorText,
                  lineHeight: 1.6,
                }}
              >
                Got it, thank you! We'll forward the rate con to the driver.
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: token.colorTextSecondary,
                  marginTop: 2,
                  textAlign: "right",
                }}
              >
                Jan 19 2024, 12:29
              </div>
            </div>
          </div>

          {/* Input area (пока без логики отправки) */}
          <div
            style={{
              padding: 16,
              borderTop: `1px solid ${token.colorBorderSecondary}`,
              background: isDark ? "#26262C" : "#FFFFFF",
            }}
          >
            {/* toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <Button type="text" size="small" icon={<BoldOutlined />} />
              <Button type="text" size="small" icon={<ItalicOutlined />} />
              <Button type="text" size="small" icon={<UnderlineOutlined />} />

              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#000",
                  margin: "0 4px 0 8px",
                }}
              />

              <Button
                type="text"
                size="small"
                icon={<UnorderedListOutlined />}
              />
              <Button type="text" size="small" icon={<OrderedListOutlined />} />

              <Button type="text" size="small" icon={<LinkOutlined />} />
              <Button type="text" size="small" icon={<PaperClipOutlined />} />
              <Button type="text" size="small" icon={<StarOutlined />} />
            </div>

            <Input.TextArea
              rows={3}
              placeholder="Write a message..."
              style={{
                borderRadius: 12,
                resize: "none",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EmailsRightPanel;
