import React, { useMemo, useState } from "react";
import { Typography } from "antd";
import { useThemeMode } from "../../../context/ThemeContext";
import EmailsLeftPanel from "./components/EmailsLeftPanel";
import EmailsRightPanel from "./components/EmailsRightPanel";

const { Text } = Typography;

const BASE_EMAILS = [
  {
    senderName: "Clayton Kwiatkowski",
    subject: "RateCon: 520935 Email subject",
    preview:
      "Hello! 10-4, thank you! Sincerely. Clayton Kwiatkowski from Grass Freight...",
    status: "ok",
    tags: ["Summary issue", "Summary issue"],
  },
  {
    senderName: "Clayton Kwiatkowski",
    subject: "RateCon: 520936 Email subject",
    preview:
      "We are 15 miles away rolling towards shipper. Could you please send the link...",
    status: "warning",
    tags: ["Summary issue"],
  },
  {
    senderName: "Clayton Kwiatkowski",
    subject: "RateCon: 520937 Email subject",
    preview:
      "Signed attached. Best regards, Mark Brian, Dispatch Department...",
    status: "critical",
    tags: [],
  },
];

const MOCK_EMAILS = Array.from({ length: 18 }).map((_, index) => {
  const base = BASE_EMAILS[index % BASE_EMAILS.length];
  return {
    id: index + 1,
    ...base,
  };
});

const STATUS_COLOR = {
  ok: "#52c41a",
  warning: "#faad14",
  critical: "#ff4d4f",
};

const Emails = () => {
  const { token, isDark } = useThemeMode();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  const filteredEmails = useMemo(() => {
    const lower = search.toLowerCase();
    return MOCK_EMAILS.filter((email) => {
      if (!lower) return true;
      return (
        email.senderName.toLowerCase().includes(lower) ||
        email.subject.toLowerCase().includes(lower) ||
        email.preview.toLowerCase().includes(lower)
      );
    });
  }, [search]);

  const selectedEmail = useMemo(
    () => MOCK_EMAILS.find((e) => e.id === selectedEmailId) || null,
    [selectedEmailId]
  );

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 64px)",
        background: isDark ? "#26262C" : "#FFFFFF",
      }}
    >
      <EmailsLeftPanel
        emails={filteredEmails}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        search={search}
        onChangeSearch={setSearch}
        selectedEmailId={selectedEmailId}
        onSelectEmail={setSelectedEmailId}
        statusColorMap={STATUS_COLOR}
        token={token}
        isDark={isDark}
      />

      <EmailsRightPanel
        selectedEmail={selectedEmail}
        token={token}
        isDark={isDark}
      />
    </div>
  );
};

export default Emails;
