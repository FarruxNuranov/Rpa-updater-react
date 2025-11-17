import { notification } from "antd";

let apiRef = null;

export function setNotifier(api) {
  apiRef = api;
}

export function notify(options) {
  const defaults = { placement: "bottomLeft", duration: 5, zIndex: 2000 };
  const opts = { ...defaults, ...(options || {}) };
  try {
    if (apiRef && typeof apiRef.open === "function") {
      apiRef.open(opts);
    } else {
      notification.open(opts);
    }
  } catch {
    // no-op
  }
}
