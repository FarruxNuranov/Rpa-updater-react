import React, { useEffect } from "react";
import { Mentions, theme } from "antd";

/**
 * Reusable Mentions with themed dropdown styles
 * Props: width, maxHeight, className, style, ...Mentions props
 */
const StyledMentions = ({ width = 267, maxHeight = 136, className, style, ...props }) => {
  const { token } = theme.useToken();

  useEffect(() => {
    const id = "styled-mentions-dropdown-css";
    let styleEl = document.getElementById(id);
    const css = `
      .ant-mentions-dropdown { width: ${width}px !important; }
      .ant-mentions-dropdown .ant-mentions-dropdown-menu { max-height: ${maxHeight}px; overflow-y: auto; }
      .ant-mentions-dropdown .ant-mentions-dropdown-menu-item { color: ${token.colorText}; background-color: ${token.colorBgContainer}; }
      .ant-mentions-dropdown .ant-mentions-dropdown-menu-item:hover { background-color: ${token.colorPrimaryBg}; border-radius: 8px; }
      .ant-mentions-dropdown .ant-mentions-dropdown-menu-item-active { background-color: ${token.colorPrimaryBg}; color: ${token.colorPrimary}; border-radius: 8px; }
    `;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = id;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
    return () => {
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    };
  }, [token, width, maxHeight]);

  return <Mentions className={className} style={style} {...props} />;
};

export default StyledMentions;

// Re-export Option for convenience
StyledMentions.Option = Mentions.Option;
