import React from "react";
import { Button, Space, Typography, Avatar, Tabs } from "antd";
import { useThemeMode } from "../../context/ThemeContext";
import { useCallback, useMemo, useRef, useState } from "react";
import { searchUsersLocal, FAKE_USERS } from "../../mock/users";
import StyledMentions from "./StyledMentions";

const CommentsSection = ({ ticket }) => {
  const { token, isDark } = useThemeMode();
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  void ticket;

  const [comments, setComments] = useState([]);

  // Styles of dropdown are now handled inside StyledMentions via theme tokens

  const extractMentionUsers = useCallback((text) => {
    const handles = Array.from(text.matchAll(/@(\S+)/g)).map((m) =>
      m[1].toLowerCase()
    );
    if (!handles.length) return [];
    const uniq = Array.from(new Set(handles));
    // Match against username, email, fullName slug
    const toSlug = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/\s+/g, "");
    return FAKE_USERS.filter((u) => {
      const cand = [u.username, u.email, u.fullName, toSlug(u.fullName)];
      const bucket = cand.map(toSlug);
      return uniq.some((h) => bucket.includes(toSlug(h)));
    });
  }, []);

  const onSave = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    const mentioned = extractMentionUsers(text);
    const now = new Date();
    setComments((prev) => [
      {
        id: now.getTime(),
        author: "You",
        createdAt: now,
        text,
        mentions: mentioned,
      },
      ...prev,
    ]);
    setValue("");
  }, [value, extractMentionUsers]);

  const onCancel = useCallback(() => setValue(""), []);

  const renderWithMentions = useCallback((text) => {
    const parts = [];
    const regex = /@(\S+)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      if (start > lastIndex) parts.push(text.slice(lastIndex, start));
      const handle = match[1];
      parts.push(
        <span
          key={`${start}-${end}`}
          style={{
            background: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: 4,
            padding: "1px 8px",
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "167%",
            display: "inline-block",
            color: token.colorText,
          }}
        >
          @{handle}
        </span>
      );
      lastIndex = end;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  }, []);

  const handleSearch = useCallback((search) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const q = (search || "").trim();
      if (!q) {
        // Show full list when only '@' is typed
        setOptions(
          FAKE_USERS.map((u) => ({
            key: String(u.id),
            value: String(u.username ?? u.email ?? u.fullName),
            label: String(u.fullName ?? u.username ?? u.email ?? "User"),
            avatar: u.avatarUrl,
          }))
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const items = searchUsersLocal(q);
        setOptions(
          items.map((u) => ({
            key: String(u.id),
            value: String(u.username ?? u.email ?? u.fullName),
            label: String(u.fullName ?? u.username ?? u.email ?? "User"),
            avatar: u.avatarUrl,
          }))
        );
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const mentionStyle = useMemo(
    () => ({
      borderRadius: 6,
      background: isDark ? "#26262C" : "#FFFFFF",
      height: 76,
      marginBottom: 8,
    }),
    []
  );

  return (
    <div>
      <Tabs
        defaultActiveKey="comments"
        items={[
          { key: "comments", label: "Comments" },
          { key: "history", label: "History" },
          { key: "mail", label: "Broker mail history" },
        ]}
        tabBarStyle={{
          fontWeight: 500,
        }}
      />

      {/* Comment input */}
      <StyledMentions
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
        placeholder="Add a comment or @ to mention and notify someone"
        autoSize={{ minRows: 3, maxRows: 5 }}
        style={mentionStyle}
        loading={loading}
        prefix={["@"]}
      >
        {options.map((opt) => (
          <StyledMentions.Option key={opt.key} value={opt.value}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar size={24} src={opt.avatar}>
                {opt.label?.[0]?.toUpperCase?.()}
              </Avatar>
              <span>{opt.label}</span>
            </div>
          </StyledMentions.Option>
        ))}
      </StyledMentions>

      <Space>
        <Button type="primary" style={{ borderRadius: 6 }} onClick={onSave}>
          Save
        </Button>
        <Button style={{ borderRadius: 6,
          background: isDark ? "#26262C" : "#FFFFFF",
         }} onClick={onCancel}>
          Cancel
        </Button>
      </Space>

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            marginTop: 30,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <Avatar size={36}>{c.author?.[0]?.toUpperCase?.() || "U"}</Avatar>
          <div>
            <Typography.Text
              strong
              style={{
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "157%",
                color: token.colorText,
              }}
            >
              {c.author}
            </Typography.Text>
            <div
              style={{
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "157%",
                color: token.colorTextSecondary,
              }}
            >
              just now
            </div>
            <div style={{ fontWeight: 400, fontSize: 14, lineHeight: "157%", color: token.colorText }}>
              {renderWithMentions(c.text)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsSection;
