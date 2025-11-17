# SignalR Integration Guide

## Overview
Real-time notifications using SignalR with .NET API.

## Configuration
- **Hub URL**: `/hubs/notifications`
- **Base URL**: Configured in `src/config/config.js` → `API_URL`
- **Authentication**: Bearer token from `localStorage.getItem("token")`

## Events

### Server → Client
1. **ReceiveNotification**
   - Triggered when a new notification is sent to the user
   - Payload: `notification` object
   - Handled in: `NotificationsContext` → adds to notification list

2. **UnreadCountUpdated**
   - Triggered when unread notification count changes
   - Payload: `count` (number)
   - Handled in: `NotificationsContext` → logs count (optional sync)

## Architecture

### Files
```
src/
├── services/
│   └── signalRService.js         # SignalR connection management (singleton)
├── context/
│   └── NotificationsContext.jsx  # Integrates SignalR with React state
├── components/
│   └── ConnectionStatus/
│       └── ConnectionStatus.jsx  # UI indicator for connection state
```

### Flow
1. **App Start** → `NotificationsProvider` mounts
2. **SignalR Connect** → `signalRService.start()` establishes WebSocket/LongPolling
3. **Events** → Server sends `ReceiveNotification` → Context adds to `items[]`
4. **UI Updates** → `NotificationsBell` shows count + list
5. **Connection Status** → `ConnectionStatus` badge (green/yellow/red)

## Connection States
- **connected** (green) – WebSocket active
- **reconnecting** (yellow) – Auto-reconnect in progress
- **disconnected** (red) – No connection
- **error** (red) – Connection failed

## Automatic Reconnection
SignalR retries with delays: `[0, 2s, 5s, 10s, 30s]`

## Usage in Components

### Get Notifications
```jsx
import { useNotifications } from "../context/NotificationsContext";

const MyComponent = () => {
  const { items, unreadCount, connectionState } = useNotifications();
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      <p>Status: {connectionState}</p>
      {items.map(notif => <div key={notif.id}>{notif.title}</div>)}
    </div>
  );
};
```

### Manually Control Connection
```jsx
import signalRService from "../services/signalRService";

// Start/stop
await signalRService.start();
await signalRService.stop();

// Subscribe to custom events
const unsubscribe = signalRService.onNotification((notif) => {
  console.log("New notification:", notif);
});
// Later: unsubscribe();
```

## Troubleshooting

### No Connection
- Check `localStorage.getItem("token")` exists
- Verify `config.API_URL` is correct
- Open browser console → look for SignalR logs
- Check CORS settings on backend

### Events Not Received
- Confirm backend hub method names: `ReceiveNotification`, `UnreadCountUpdated`
- Check SignalR server logs
- Use browser Network tab → WS/SSE connections

## Backend Requirements
Ensure .NET hub exposes:
```csharp
public async Task SendNotification(string userId, object notification)
{
    await Clients.User(userId).SendAsync("ReceiveNotification", notification);
}

public async Task UpdateUnreadCount(string userId, int count)
{
    await Clients.User(userId).SendAsync("UnreadCountUpdated", count);
}
```

## Production Checklist
- [ ] Environment variable for hub URL
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Graceful degradation if SignalR unavailable
- [ ] Token refresh handling
- [ ] HTTPS in production

---

**Package**: `@microsoft/signalr` (v8.x)
**Docs**: https://learn.microsoft.com/aspnet/core/signalr/javascript-client
