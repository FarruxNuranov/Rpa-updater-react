import React, { useMemo, useState } from "react";
import { Badge, Button, Popover, List, Typography, Switch, Space } from "antd";
import {
  BellOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useNotifications } from "../../context/NotificationsContext";
import { useDispatch } from "react-redux";
import { markNotificationRead } from "../../api/notifications/notificationsSlice";

const { Text, Link } = Typography;

const NotificationsBell = ({ isDark, token, count, onOpenTicket }) => {
  const [open, setOpen] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const { items, unreadCount } = useNotifications();
  const dispatch = useDispatch();

  const list = useMemo(() => {
    const prepared = items.map((n) => ({
      id: n.id,
      type: n.type || "info",
      title: n.message || n.title,
      description: n.description || "",
      unread: !n.read,
      actionText: n.actionText || "View work",
      ticketId: n?.metadata?.ticketId || n?.relatedEntityId || n?.id,
    }));
    return onlyUnread ? prepared.filter((n) => n.unread) : prepared;
  }, [items, onlyUnread]);

  const iconByType = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleFilled style={{ color: token.colorSuccess }} />;
      case "warning":
        return (
          <ExclamationCircleFilled style={{ color: token.colorWarning }} />
        );
      case "error":
      default:
        return <CloseCircleFilled style={{ color: token.colorError }} />;
    }
  };

  const content = (
    <div
      style={{
        width: 412,

        background: isDark ? "#1f1f1f" : "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text
          strong
          style={{
            color: token.colorText,
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "150%",
          }}
        >
          Notifications
        </Text>
        <Space size={8}>
          <Switch size="small" checked={onlyUnread} onChange={setOnlyUnread} />
          <Text
            type="secondary"
            style={{
              color: token.colorText,
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "157%",
            }}
          >
            Only show unread
          </Text>
        </Space>
      </div>
      <div
        style={{
          minHeight: 272,
          maxHeight: 472,
          overflowY: "auto",
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={list}
          split
          renderItem={(item) => (
            <List.Item style={{ padding: "12px 24px" }}>
              <List.Item.Meta
                avatar={
                  <div style={{ fontSize: 18 }}>{iconByType(item.type)}</div>
                }
                title={
                  <Text
                    style={{
                      color: token.colorText,
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: "157%",
                    }}
                  >
                    {item.title}
                  </Text>
                }
                description={
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <Text
                      style={{
                        whiteSpace: "pre-line",
                        color: token.colorTextDescription,
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: "157%",
                      }}
                    >
                      {item.description}
                    </Text>
                    <div style={{ display: "flex", gap: 12 }}>
                      <Link
                        style={{
                          width: "fit-content",
                          color: token.colorPrimary,
                          fontSize: 14,
                          fontWeight: 400,
                          lineHeight: "157%",
                        }}
                        onClick={() => {
                          if (item.ticketId && onOpenTicket) {
                            onOpenTicket(item.ticketId);
                            setOpen(false);
                          }
                        }}
                      >
                        View work
                      </Link>
                      <Button
                        type="link"
                        size="small"
                        disabled={!item.unread}
                        onClick={() => {
                          dispatch(markNotificationRead(item.id));
                        }}
                      >
                        Mark as read
                      </Button>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      overlayInnerStyle={{ padding: 0 }}
      content={content}
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
    >
      <Badge count={count ?? unreadCount} offset={[-5, 5]}>
        <Button
          type="default"
          icon={<BellOutlined />}
          style={{
            width: 44,
            height: 44,
            background: isDark ? "#26262C" : "#FFFFFF",
            color: token.colorText,
            fontSize: 18,
          }}
          onClick={() => setOpen(!open)}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationsBell;
