import React, { useEffect } from "react";
import { notification } from "antd";
import { setNotifier } from "../../utils/notifier";

const NotifierHost = () => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setNotifier(api);
    return () => setNotifier(null);
  }, [api]);

  return contextHolder;
};

export default NotifierHost;
