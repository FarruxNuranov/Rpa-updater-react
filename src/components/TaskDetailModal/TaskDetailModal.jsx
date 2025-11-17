import React, { useEffect, useState } from "react";
import { PRIORITY, STATUSES, CATEGORIES } from "../../config/tickets";
import { fetchTicketsThunk, updateTicketStatusThunk } from "../../api/tickets/ticketsSlice";
import {
  askAiThunk,
  fetchAiHistoryThunk,
} from "../../api/tickets/aiSuggestionSlice";
import styles from "./TaskDetailModal.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import AskGPTPanel from "../AskGPTPanel/AskGPTPanel";
import CommentsSection from "../CommentsSection/CommentsSection";
import TicketInfoSection from "../TicketInfoSection/TicketInfoSection";
import {
  Modal,
  Button,
  Space,
  Typography,
  Dropdown,
  Tooltip,
  message,
  Select,
} from "antd";
import { useThemeMode } from "../../context/ThemeContext";
import {
  DoubleRightOutlined,
  DownOutlined,
  ShareAltOutlined,
  ExpandOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTicketByIdThunk,
  updateTicketDepartmentThunk,
  updateTicketPriorityThunk,
} from "../../api/tickets/ticketDetailSlice";
import { AI } from "../../utils/getImage";

const { Title } = Typography;

const TaskDetailModal = ({ open, onClose, ticketId }) => {
  const dispatch = useDispatch();
  const [localMessages, setLocalMessages] = useState([]);
  const chatEndRef = React.useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const { ticket, loading } = useSelector((s) => s.ticketDetail);
  const { token, isDark } = useThemeMode(); // ✅ глобальная тема
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Highest");
  const { messages } = useSelector((s) => s.aiSuggestion);
  const user = useSelector((s) => s.profile?.profile); // Get current user
  const [prompt, setPrompt] = useState("");
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [category, setCategory] = useState(0);
  // Extract external message URL from ticket.messageId like 'https://... (ID: 409)'
  const messageUrl = React.useMemo(
    () =>
      String(ticket?.messageId || "")
        .split(" (ID:")[0]
        .trim(),
    [ticket?.messageId]
  );
  const handleOpenMessage = React.useCallback(() => {
    if (!messageUrl) return;
    window.open(messageUrl, "_blank", "noopener,noreferrer");
  }, [messageUrl]);

  // Load ticket data when modal opens
  useEffect(() => {
    if (ticketId && open) {
      dispatch(fetchTicketByIdThunk(ticketId));
    }
  }, [ticketId, open, dispatch]);

  // Load AI history when AI drawer opens
  useEffect(() => {
    if (ticketId && open && aiDrawerOpen) {
      dispatch(fetchAiHistoryThunk(ticketId));
      setLocalMessages([]); // Clear local messages, use messages from Redux
    }
  }, [ticketId, open, aiDrawerOpen, dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages, messages, isTyping]);

  // 🔹 После загрузки тикета — инициализируем локальные состояния
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      // initialize local category from server field 'department'
      if (typeof ticket.department === "number") setCategory(ticket.department);
    }
  }, [ticket]);
  // 🔹 Обновление статуса на сервере
  const handleStatus = async (newStatus) => {
    setStatus(newStatus);
    if (!ticket?.id) return;
    await dispatch(updateTicketStatusThunk({ id: ticket.id, status: newStatus }));
    // refresh detail to keep state in sync
    dispatch(fetchTicketByIdThunk(ticket.id));
    message.success(`Статус изменён на "${STATUSES[newStatus]}"`);
  };

  const handlePriority = async (newPriority) => {
    setPriority(newPriority);
    if (!ticket?.id) return;
    await dispatch(updateTicketPriorityThunk({ id: ticket.id, priority: newPriority }));
    dispatch(fetchTicketByIdThunk(ticket.id));
    message.success(`Приоритет изменён на "${PRIORITY[newPriority]}"`);
  };

  // 🔹 Мгновенное обновление категории: отправляем текущий статус + новую категорию
  const handleCategoryChange = async (newCategory) => {
    setCategory(newCategory);
    if (!ticket?.id) return;
    await dispatch(updateTicketDepartmentThunk({ id: ticket.id, department: newCategory }));
    dispatch(fetchTicketByIdThunk(ticket.id));
    message.success(`Категория изменена: ${CATEGORIES[newCategory]}`);
  };

  const handleAskAI = async () => {
    if (!prompt.trim() || isAskingAI) return;

    setIsAskingAI(true);
    const userPrompt = prompt.trim();
    const newMessage = {
      id: Date.now(),
      prompt: userPrompt,
      response: null,
      timestamp: new Date(),
      suggestions: [],
    };

    // ✅ сразу показываем сообщение в чате
    setLocalMessages((prev) => [...prev, newMessage]);
    setPrompt("");
    setIsTyping(true);

    try {
      const result = await dispatch(
        askAiThunk({
          prompt: userPrompt,
          ticketId: ticket?.id || ticketId,
          userId: user?.id || "",
        })
      ).unwrap();
      setIsTyping(false);

      // ✅ добавляем ответ AI к последнему сообщению
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? {
                ...msg,
                response: result.response,
                suggestions: result.suggestions,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("AI error:", error);
      message.error("Failed to get AI response");
      setIsTyping(false);
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        dispatch(fetchTicketsThunk()); //  обновляем список тикетов
        setLocalMessages([]); // Очищаем историю чата
        setPrompt("");
        setAiDrawerOpen(false);
        onClose();
      }}
      footer={null}
      closable={false}
      width={1260}
      centered
      maskClosable
      transitionName="ant-zoom"
      maskTransitionName="ant-fade"
      styles={{
        content: {
          borderRadius: 12,
          background: isDark ? "#26262C" : "#FFFFFF",
          border: `1px solid ${token.colorBorderSecondary}`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        height: "700px",
      }}
    >
      {/* === HEADER === */}
      <div
        style={{
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: "14px 20px",
          background: isDark ? "#26262C" : "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title
          level={5}
          style={{
            margin: 0,
            color: token.colorTextHeading,
            fontWeight: 600,
          }}
        >
          Issue detail
        </Title>

        <Space size={8} align="center">
          {/* 🔹 STATUS BUTTON (To Do / In Progress / Done) */}
          {/* 🔹 STATUS BUTTON */}
          <Dropdown
            menu={{
              items: [
                { key: 0, label: "To Do" },
                { key: 1, label: "Blocked" },
                { key: 2, label: "In Progress" },
                { key: 3, label: "Done" },
              ],
              onClick: ({ key }) => handleStatus(Number(key)),
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              style={{
                borderRadius: 8,
                height: 36,
                padding: "0 14px",
                fontWeight: 500,
                color: "#fff",
                background:
                  status === 0
                    ? "#bfbfbf" // To Do
                    : status === 1
                    ? "#faad14" // Blocked (orange)
                    : status === 2
                    ? "#597ef7" // In Progress (blue)
                    : "#95de64", // Done (green)
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {status === 0
                ? "To Do"
                : status === 1
                ? "Blocked"
                : status === 2
                ? "In Progress"
                : status === 3
                ? "Done"
                : "—"}
              <DownOutlined style={{ fontSize: 10, color: "#fff" }} />
            </Button>
          </Dropdown>

          {/* PRIORITY BUTTON */}
          {/* 🔹 PRIORITY BUTTON */}
          <Dropdown
            menu={{
              items: [
                { key: 0, label: "High" },
                { key: 1, label: "Medium" },
                { key: 2, label: "Low" },
              ],
              onClick: ({ key }) => handlePriority(Number(key)),
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              style={{
                borderRadius: 8,
                height: 36,
                fontWeight: 500,
                border: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color:
                  priority === 0
                    ? "#ff4d4f"
                    : priority === 1
                    ? "#faad14"
                    : "#52c41a",
                background: isDark ? "#26262C" : "#FFFFFF",
              }}
            >
              <DoubleRightOutlined
                rotate={priority === 0 ? -90 : priority === 1 ? 0 : 90}
                style={{
                  color:
                    priority === 0
                      ? "#ff4d4f"
                      : priority === 1
                      ? "#faad14"
                      : "#52c41a",
                  fontSize: 16,
                }}
              />
              {PRIORITY[priority] || "Medium"}
              <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>

          {/* 🔹 Expand */}
          <Tooltip title="Expand">
            <Button
              icon={<ExpandOutlined style={{ fontSize: 15 }} />}
              style={{
                borderRadius: 8,
                height: 36,
                width: 36,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            />
          </Tooltip>

          {/* 🔹 Share */}
          <Tooltip title="Share">
            <Button
              icon={<ShareAltOutlined style={{ fontSize: 15 }} />}
              style={{
                borderRadius: 8,
                height: 36,
                width: 36,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            />
          </Tooltip>

          {/* 🔹 Close */}
          {/* 🔹 Close */}
          <Tooltip title="Close">
            <Button
              icon={<CloseOutlined style={{ fontSize: 15 }} />}
              onClick={() => {
                dispatch(fetchTicketsThunk()); // ✅ обновляем список задач
                onClose(); // ✅ закрываем модалку
              }}
              style={{
                borderRadius: 8,
                height: 36,
                width: 36,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            />
          </Tooltip>
        </Space>
      </div>
      {/* === TOP SUBJECT BLOCK === */}
      <div
        style={{
          padding: "16px 22px",
          borderBottom: `1px dashed ${token.colorBorderSecondary}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Левая часть — заголовок */}
        <Typography.Text
          strong
          style={{
            fontSize: 16,
            color: token.colorTextHeading,
            fontWeight: 600,
          }}
        >
          {ticket?.text || "Без названия"}
        </Typography.Text>

        {/* Правая часть — аватар и кнопка */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}></div>
      </div>
      {/* === MAIN CONTENT === */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          overflow: "hidden",
          height: "100%",
          position: "relative",
        }}
      >
        {/* 🔹 LEFT SIDE — основное содержимое */}
        <motion.div
          style={{
            padding: "14px 20px",
            paddingRight: aiDrawerOpen ? 520 : 20,
            transition: "padding-right 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            overflowY: "auto",
            borderRight: aiDrawerOpen
              ? `1px dashed ${token.colorBorderSecondary}`
              : "none",
          }}
        >
          {/* === ACTION BAR === */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {/* 🔹 Call to Driver */}
            <Button
              icon={<i className="ri-phone-line" />} // если используешь remixicon; если нет — поставь свою иконку
              style={{
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                background: isDark ? "#26262C" : "#FFFFFF",
                gap: 6,
              }}
            >
              Call to Driver
            </Button>

            {/* 🔹 Category Select (sends numeric code with status update) */}
            <Select
              value={category}
              onChange={handleCategoryChange}
              options={Object.entries(CATEGORIES).map(([value, label]) => ({ value: Number(value), label }))}
              suffixIcon={<DownOutlined style={{ color: token.colorText }} />}
              dropdownStyle={{
                background: isDark ? "#26262C" : "#FFFFFF",
                borderRadius: 8,
              }}
              style={{
                width: 140,
                height: 40,
                borderRadius: 8,
                background: isDark ? "#26262C" : "#FFFFFF",
              }}
            />

            {/* 🔹 Go to Message */}
            <Button
              type="link"
              icon={<ArrowRightOutlined />}
              style={{
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                color: token.dashed, // 🔹 синий текст
                border: `1px solid ${token.colorBorder}`, // 🔹 бордер
                background: isDark ? "#26262C" : "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onClick={handleOpenMessage}
              disabled={!messageUrl}
              title={messageUrl ? `Open: ${messageUrl}` : "No message link"}
            >
              Go to Message
            </Button>

            {/* 🔹 Ask GPT Button */}
            <Button
            className={styles.aiButton}
             type="primary"
              icon={<img src={AI} alt="AI" style={{ width: 16, height: 16 }} />}
              onClick={() => {
                setAiDrawerOpen(!aiDrawerOpen);
              }}
             
            >
              {aiDrawerOpen ? "Close AI" : "Ask GPT"}
            </Button>
          </div>
          {/* === TICKET INFO SECTION === */}
          <TicketInfoSection ticket={ticket} loading={loading} />
          {/* === COMMENTS SECTION === */}
          <CommentsSection ticket={ticket} />
        </motion.div>

        {/* 🔹 RIGHT SIDE - AI Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{
            x: aiDrawerOpen ? 0 : "100%",
            opacity: aiDrawerOpen ? 1 : 0,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 500,
            height: "100%",
            zIndex: 10,
          }}
        >
          {aiDrawerOpen && (
            <AskGPTPanel
              prompt={prompt}
              setPrompt={setPrompt}
              handleAskAI={handleAskAI}
              localMessages={localMessages}
              chatEndRef={chatEndRef}
              isAskingAI={isAskingAI}
            />
          )}
        </motion.div>
      </div>

      <style>
        {`
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(150, 150, 150, 0.8);
        animation: blink 1.4s infinite both;
      }
      .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes blink {
        0% { opacity: 0.2; transform: translateY(0); }
        20% { opacity: 1; transform: translateY(-2px); }
        100% { opacity: 0.2; transform: translateY(0); }
      }
    `}
      </style>
    </Modal>
  );
};

export default TaskDetailModal;
