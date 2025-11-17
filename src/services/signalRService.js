import * as signalR from "@microsoft/signalr";
import { notification } from "antd";
import config from "../config/config";

/**
 * SignalR service for real-time notifications
 * Connects to /hubs/notifications
 * Events: ReceiveNotification, UnreadCountUpdated
 */
class SignalRService {
  constructor() {
    this.connection = null; // notifications hub
    this.ticketsConnection = null; // tickets hub
    this.started = false;
    this.handlers = {
      onNotification: [],
      onUnreadCountUpdated: [],
      onConnectionChanged: [],
      onNewTicket: [],
      onTicketUpdated: [],
    };
    this.DEBUG = true;
  }

  /**
   * Start SignalR connection with authentication
   */
  async start() {
    if (
      this.started ||
      this.connection?.state === signalR.HubConnectionState.Connected
    ) {
      console.log("✅ SignalR already connected");
      return;
    }

    const token = localStorage.getItem("token");
    if (this.DEBUG) {
      console.info("[SignalR] start() called", {
        online: navigator?.onLine,
        visibility: document?.visibilityState,
        hasToken: Boolean(token),
        apiUrl: config.API_URL,
      });
    }
    if (!token) {
      console.warn("⚠️ No token found, skipping SignalR connection");
      return;
    }

    // Build hub URL strictly from API_URL (prod/back-end provided URL)
    // Many backends expose REST at /api while SignalR hub lives at root.
    // If API_URL ends with '/api', trim it for hub base.
    const baseRaw = (config.API_URL || "").replace(/\/$/, "");
    const baseUrl = baseRaw.endsWith("/api") ? baseRaw.slice(0, -4) : baseRaw;
    const hubUrl = `${baseUrl}/hubs/notifications`;
    const ticketsHubUrl = `${baseUrl}/hubs/tickets`;

    if (!baseUrl) {
      console.error(
        "❌ SIGNALR_URL or API_URL is not configured. Cannot connect to SignalR."
      );
      return;
    }

    if (this.DEBUG) {
      console.info(
        "🔌 SignalR hub URL:",
        hubUrl,
        "(from API_URL:",
        config.API_URL,
        ")"
      );
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.LongPolling,
        withCredentials: false,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry delays
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Event: ReceiveNotification
    this.connection.on("ReceiveNotification", (notification) => {
      if (this.DEBUG) console.log("🔔 New notification:", notification);
      this.handlers.onNotification.forEach((handler) => handler(notification));
    });

    // Event: UnreadCountUpdated
    this.connection.on("UnreadCountUpdated", (count) => {
      if (this.DEBUG) console.log("📊 Unread count updated:", count);
      this.handlers.onUnreadCountUpdated.forEach((handler) => handler(count));
    });

    // Connection state handlers
    this.connection.onreconnecting((error) => {
      if (this.DEBUG) console.warn("🔄 SignalR reconnecting...", error);
      this.notifyConnectionChanged("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      if (this.DEBUG) console.log("✅ SignalR reconnected:", connectionId);
      this.notifyConnectionChanged("connected");
    });

    this.connection.onclose((error) => {
      if (this.DEBUG) console.error("❌ SignalR connection closed:", error);
      this.notifyConnectionChanged("disconnected");
    });

    // Helper to start and report
    const startWithLog = async (urlLabel) => {
      try {
        await this.connection.start();
        if (this.DEBUG)
          console.log(
            `✅ SignalR connected [${urlLabel}]:`,
            this.connection.connectionId
          );
        this.notifyConnectionChanged("connected");
        return true;
      } catch (err) {
        if (this.DEBUG)
          console.error(`❌ SignalR connection failed [${urlLabel}]:`, err);
        return false;
      }
    };

    // 1) Try primary URL
    let ok = await startWithLog("primary");

    // 2) Fallback to /api/hubs/notifications if failed and base had /api trimmed
    if (!ok) {
      const baseRaw2 = (config.API_URL || "").replace(/\/$/, "");
      const altBase = baseRaw2; // keep /api if present
      const altHubUrl = `${altBase}/hubs/notifications`;
      if (altHubUrl !== hubUrl) {
        if (this.DEBUG)
          console.info(
            "↩️ Trying fallback hub URL:",
            altHubUrl,
            "(from API_URL:",
            config.API_URL,
            ")"
          );
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(altHubUrl, {
            accessTokenFactory: () => token,
            transport:
              signalR.HttpTransportType.WebSockets |
              signalR.HttpTransportType.LongPolling,
            withCredentials: false,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Re-register handlers on fallback connection
        this.connection.on("ReceiveNotification", (notification) => {
          if (this.DEBUG) console.log("🔔 New notification:", notification);
          this.handlers.onNotification.forEach((handler) =>
            handler(notification)
          );
        });
        this.connection.on("UnreadCountUpdated", (count) => {
          if (this.DEBUG) console.log("📊 Unread count updated:", count);
          this.handlers.onUnreadCountUpdated.forEach((handler) =>
            handler(count)
          );
        });
        this.connection.onreconnecting((e) => {
          if (this.DEBUG) console.warn("🔄 SignalR reconnecting...", e);
          this.notifyConnectionChanged("reconnecting");
        });
        this.connection.onreconnected(() => {
          if (this.DEBUG) console.log("✅ SignalR reconnected (fallback)");
          this.notifyConnectionChanged("connected");
        });
        this.connection.onclose((e) => {
          if (this.DEBUG)
            console.error("❌ SignalR connection closed (fallback):", e);
          this.notifyConnectionChanged("disconnected");
        });

        ok = await startWithLog("fallback");
      }
    }

    // 3) As a last resort, try WebSockets-only (skip negotiate)
    if (!ok) {
      const wsUrls = [];
      const baseRaw3 = (config.API_URL || "").replace(/\/$/, "");
      const wsBase1 = baseRaw3.endsWith("/api")
        ? baseRaw3.slice(0, -4)
        : baseRaw3;
      wsUrls.push(`${wsBase1}/hubs/notifications`);
      if (!wsBase1.endsWith("/api"))
        wsUrls.push(`${baseRaw3}/hubs/notifications`);

      for (const url of wsUrls) {
        if (this.DEBUG)
          console.info("🧪 Trying WebSockets-only (skip negotiate):", url);
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(url, {
            accessTokenFactory: () => token,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            withCredentials: false,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Re-register handlers
        this.connection.on("ReceiveNotification", (notification) => {
          if (this.DEBUG) console.log("🔔 New notification:", notification);
          this.handlers.onNotification.forEach((handler) =>
            handler(notification)
          );
        });
        this.connection.on("UnreadCountUpdated", (count) => {
          if (this.DEBUG) console.log("📊 Unread count updated:", count);
          this.handlers.onUnreadCountUpdated.forEach((handler) =>
            handler(count)
          );
        });
        this.connection.onreconnecting((e) => {
          if (this.DEBUG) console.warn("🔄 SignalR reconnecting...", e);
          this.notifyConnectionChanged("reconnecting");
        });
        this.connection.onreconnected(() => {
          if (this.DEBUG) console.log("✅ SignalR reconnected (ws-only)");
          this.notifyConnectionChanged("connected");
        });
        this.connection.onclose((e) => {
          if (this.DEBUG)
            console.error("❌ SignalR connection closed (ws-only):", e);
          this.notifyConnectionChanged("disconnected");
        });

        ok = await startWithLog("ws-only");
        if (ok) break;
      }
    }

    // 4) As a last resort, try LongPolling-only (bypasses WS restrictions, works behind strict proxies)
    if (!ok) {
      const lpUrls = [];
      const baseRaw4 = (config.API_URL || "").replace(/\/$/, "");
      const lpBase1 = baseRaw4.endsWith("/api")
        ? baseRaw4.slice(0, -4)
        : baseRaw4;
      lpUrls.push(`${lpBase1}/hubs/notifications`);
      if (!lpBase1.endsWith("/api"))
        lpUrls.push(`${baseRaw4}/hubs/notifications`);

      for (const url of lpUrls) {
        if (this.DEBUG) console.info("🧪 Trying LongPolling-only:", url);
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(url, {
            accessTokenFactory: () => token,
            transport: signalR.HttpTransportType.LongPolling,
            withCredentials: false,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Re-register handlers
        this.connection.on("ReceiveNotification", (notification) => {
          if (this.DEBUG) console.log("🔔 New notification:", notification);
          this.handlers.onNotification.forEach((handler) =>
            handler(notification)
          );
        });
        this.connection.on("UnreadCountUpdated", (count) => {
          if (this.DEBUG) console.log("📊 Unread count updated:", count);
          this.handlers.onUnreadCountUpdated.forEach((handler) =>
            handler(count)
          );
        });
        this.connection.onreconnecting((e) => {
          if (this.DEBUG) console.warn("🔄 SignalR reconnecting...", e);
          this.notifyConnectionChanged("reconnecting");
        });
        this.connection.onreconnected(() => {
          if (this.DEBUG) console.log("✅ SignalR reconnected (lp-only)");
          this.notifyConnectionChanged("connected");
        });
        this.connection.onclose((e) => {
          if (this.DEBUG)
            console.error("❌ SignalR connection closed (lp-only):", e);
          this.notifyConnectionChanged("disconnected");
        });

        ok = await startWithLog("long-polling");
        if (ok) break;
      }
    }

    if (!ok) {
      this.notifyConnectionChanged("disconnected");
      throw new Error(
        "SignalR connection failed for all attempts (primary, fallback, ws-only, long-polling)"
      );
    }

    // --- Tickets hub (NewTicket) ---
    try {
      this.ticketsConnection = new signalR.HubConnectionBuilder()
        .withUrl(ticketsHubUrl, {
          accessTokenFactory: () => token,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
          withCredentials: false,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.ticketsConnection.on("NewTicket", (ticket) => {
        if (this.DEBUG) console.log("🎟️ NewTicket:", ticket);
        this.handlers.onNewTicket.forEach((h) => h(ticket));
      });

      // TicketUpdated: { id, status?, department?, priority? }
      this.ticketsConnection.on("TicketUpdated", (update) => {
        if (this.DEBUG) console.log("♻️ TicketUpdated:", update);
        this.handlers.onTicketUpdated.forEach((h) => h(update));
      });

      await this.ticketsConnection.start();
      if (this.DEBUG)
        console.log(
          "✅ Tickets hub connected:",
          this.ticketsConnection.connectionId
        );
    } catch (e) {
      console.error("❌ Tickets hub connection failed:", e);
      // do not throw: notifications hub is already working
    }

    this.started = true;
  }

  /**
   * Stop SignalR connection
   */
  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("🛑 SignalR disconnected");
        this.notifyConnectionChanged("disconnected");
      } catch (error) {
        console.error("❌ Error stopping SignalR:", error);
      }
    }
    if (this.ticketsConnection) {
      try {
        await this.ticketsConnection.stop();
        console.log("🛑 Tickets hub disconnected");
      } catch (error) {
        console.error("❌ Error stopping Tickets hub:", error);
      }
      this.ticketsConnection = null;
    }
    this.started = false;
  }

  /**
   * Subscribe to new notifications
   */
  onNotification(handler) {
    this.handlers.onNotification.push(handler);
    return () => {
      this.handlers.onNotification = this.handlers.onNotification.filter(
        (h) => h !== handler
      );
    };
  }

  /**
   * Subscribe to unread count updates
   */
  onUnreadCountUpdated(handler) {
    this.handlers.onUnreadCountUpdated.push(handler);
    return () => {
      this.handlers.onUnreadCountUpdated =
        this.handlers.onUnreadCountUpdated.filter((h) => h !== handler);
    };
  }

  /**
   * Subscribe to new ticket events
   */
  onNewTicket(handler) {
    this.handlers.onNewTicket.push(handler);
    return () => {
      this.handlers.onNewTicket = this.handlers.onNewTicket.filter(
        (h) => h !== handler
      );
    };
  }

  /**
   * Subscribe to ticket updates (status/department/priority)
   */
  onTicketUpdated(handler) {
    this.handlers.onTicketUpdated.push(handler);
    return () => {
      this.handlers.onTicketUpdated = this.handlers.onTicketUpdated.filter(
        (h) => h !== handler
      );
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionChanged(handler) {
    this.handlers.onConnectionChanged.push(handler);
    return () => {
      this.handlers.onConnectionChanged =
        this.handlers.onConnectionChanged.filter((h) => h !== handler);
    };
  }

  /**
   * Notify all connection state subscribers
   */
  notifyConnectionChanged(state) {
    this.handlers.onConnectionChanged.forEach((handler) => handler(state));
  }

  /**
   * Get current connection state
   */
  getState() {
    const s = this.connection?.state;
    // Map enum to string for UI
    switch (s) {
      case signalR.HubConnectionState.Connected:
        return "connected";
      case signalR.HubConnectionState.Connecting:
      case signalR.HubConnectionState.Reconnecting:
        return "reconnecting";
      case signalR.HubConnectionState.Disconnecting:
      case signalR.HubConnectionState.Disconnected:
      default:
        return "disconnected";
    }
  }
}

// Singleton instance
const signalRService = new SignalRService();

export default signalRService;
