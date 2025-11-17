const config = {
  API_URL: import.meta.env.VITE_API_URL,
  MEDIA_URL: import.meta.env.VITE_MEDIA_URL,
  SIGNALR_URL: import.meta.env.VITE_SIGNALR_URL, // optional override for SignalR hub base URL
  SIGNALR_HUB_PATH: import.meta.env.VITE_SIGNALR_HUB_PATH || "/hubs/notifications", // default hub path
};

export default config;