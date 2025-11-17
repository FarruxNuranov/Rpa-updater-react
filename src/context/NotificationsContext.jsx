import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, notification, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notifier";
import {
  fetchNotifications,
  markAllNotificationsRead,
  addIncoming,
} from "../api/notifications/notificationsSlice";
import { addTicket, updateTicketFields } from "../api/tickets/ticketsSlice";
import signalRService from "../services/signalRService";

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children, onOpenTicket }) => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((s) => s.notifications);
  const token = useSelector((s) => s.auth.token);
  const [connectionState, setConnectionState] = useState("disconnected");
  const navigate = useNavigate();

  const addNotification = useCallback(
    (notif) => {
      const id = notif.id || Date.now() + Math.random();
      const item = { id, read: false, actionText: "View work", ...notif };
      dispatch(addIncoming(item));
    },
    [dispatch]
  );

  const markAllRead = useCallback(() => {
    dispatch(markAllNotificationsRead());
  }, [dispatch]);

  useEffect(() => {
    let unsubscribeNotification;
    let unsubscribeCount;
    let unsubscribeConnection;
    let unsubscribeNewTicket;
    let unsubscribeTicketUpdated;

    const init = async () => {
      if (!token) {
        // no auth -> ensure disconnected and cleanup
        setConnectionState("disconnected");
        signalRService.stop();
        return;
      }
      // initial load via REST
      dispatch(fetchNotifications());

      // subscribe to connection and events
      unsubscribeConnection = signalRService.onConnectionChanged((state) => {
        setConnectionState(state);
      });

      // Update Kanban instantly on TicketUpdated (status/department/priority)
      unsubscribeTicketUpdated = signalRService.onTicketUpdated((update) => {
        if (!update || !update.id) return;
        dispatch(updateTicketFields(update));
      });
      unsubscribeNotification = signalRService.onNotification((n) => {
        addNotification(n);
        notification.open({
          message: n?.title || "Notification",
          description: n?.message || n?.text || "",
          placement: "bottomLeft",
          zIndex: 2000,
          duration: 3,
        });
      });
      unsubscribeCount = signalRService.onUnreadCountUpdated(() => {
        // optional: could fetch count or adjust locally
      });
      unsubscribeNewTicket = signalRService.onNewTicket((ticket) => {
        console.log("[Notifications] onNewTicket received:", ticket);
        // 1) Положим тикет в TODO лист (redux)
        dispatch(addTicket(ticket));
        // 2) Покажем тост с действием "View work"
        const openTicket = () => {
          if (onOpenTicket) onOpenTicket(ticket?.id);
          else navigate(`/dashboard/tasks/${ticket?.id}`);
        };
        notify({
          message: "New Ticket",
          description: (
            <span>
              <strong>{ticket?.writerName || "New message"}</strong>:{" "}
              {ticket?.text || ""}
            </span>
          ),
          btn: (
            <Button type="link" onClick={openTicket} style={{ padding: 0 }}>
              View work
            </Button>
          ),
        });

        // 3) Системное уведомление (Web Notifications) с запросом разрешения один раз
        try {
          if (typeof window !== "undefined" && "Notification" in window) {
            const launchSystem = () => {
              try {
                const n = new Notification("New Ticket", {
                  body: `${ticket?.writerName || "New message"}: ${
                    ticket?.text || ""
                  }`,
                  tag: ticket?.id,
                });
                n.onclick = () => {
                  window.focus?.();
                  openTicket();
                  n.close?.();
                };
              } catch {}
            };
            if (Notification.permission === "granted") {
              launchSystem();
            } else if (Notification.permission === "default") {
              Notification.requestPermission().then((p) => {
                if (p === "granted") launchSystem();
              });
            }
          }
        } catch {}
      });

      try {
        await signalRService.start();
        setConnectionState(signalRService.getState());
      } catch {
        setConnectionState("error");
      }
    };

    init();

    return () => {
      unsubscribeNotification?.();
      unsubscribeCount?.();
      unsubscribeConnection?.();
      unsubscribeNewTicket?.();
      unsubscribeTicketUpdated?.();
      signalRService.stop();
    };
  }, [dispatch, addNotification, token]);

  const value = useMemo(
    () => ({
      items,
      addNotification,
      markAllRead,
      unreadCount,
      connectionState,
      onOpenTicket,
    }),
    [
      items,
      addNotification,
      markAllRead,
      unreadCount,
      connectionState,
      onOpenTicket,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
};
