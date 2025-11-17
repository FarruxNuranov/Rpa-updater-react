import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Tag, notification } from "antd";
import {
  fetchTicketsThunk,
  updateTicketStatusThunk,
  updateTicketStatusLocal,
  assignTicketThunk,
} from "../../../api/tickets/ticketsSlice";
import { fetchTicketByIdThunk } from "../../../api/tickets/ticketDetailSlice";
import { CATEGORIES, STATUSES, STATUS_COLORS } from "../../../config/tickets";
import TaskHeader from "../../../components/TaskHeader/TaskHeader";
import TaskBoard from "../../../components/TaskBoard/TaskBoard";
import TaskDetailModal from "../../../components/TaskDetailModal/TaskDetailModal";
import { useThemeMode } from "../../../context/ThemeContext";

const Tasks = () => {
  const dispatch = useDispatch();
  const { id: selectedId } = useParams();
  const { token } = useThemeMode();

  // ✅ Данные из Redux (loading временно не используем)
  const { items } = useSelector((s) => s.tickets);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // === Загружаем тикеты при монтировании ===
  useEffect(() => {
    dispatch(fetchTicketsThunk());
  }, [dispatch]);

  // === Проверяем ID из URL и открываем нужный тикет ===
  useEffect(() => {
    if (selectedId) {
      const localTask = items.find((t) => t.id === selectedId);
      if (localTask) {
        setSelectedTask(localTask);
      } else {
        dispatch(fetchTicketByIdThunk(selectedId)).then((res) => {
          if (res.payload) setSelectedTask(res.payload);
        });
      }
    } else {
      setSelectedTask(null);
    }
  }, [selectedId, items, dispatch]);

  // === Колонки Kanban ===
  const columns = {
    todo: { title: "TODO", status: 0 },
    blocked: { title: "BLOCKED", status: 1 },
    inprogress: { title: "IN PROGRESS", status: 2 },
    done: { title: "DONE", status: 3 },
    
  };

  // === Drag & Drop ===
  const onDragEnd = async (result) => {
    const { destination } = result;
    if (!destination) return;

    const movedTask = items.find((t) => t.id === result.draggableId);
    if (!movedTask) return;

    const newStatus = columns[destination.droppableId]?.status;
    if (movedTask.status === newStatus) return;

    dispatch(updateTicketStatusLocal({ id: movedTask.id, status: newStatus }));

    try {
      // если перетащили в In Progress — назначаем на текущего пользователя
      if (newStatus === 2 && movedTask.status !== 2) {
        dispatch(assignTicketThunk(movedTask.id));
      }
      await dispatch(updateTicketStatusThunk({ id: movedTask.id, status: newStatus }));

      notification.success({
        message: "Task Updated",
        description: (
          <>
            <strong>{movedTask.text}</strong> moved to{" "}
            <Tag color={STATUS_COLORS[newStatus]}>{STATUSES[newStatus]}</Tag>
          </>
        ),
        placement: "bottomRight",
        style: {
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          color: token.colorText,
        },
      });
      // мгновенный тихий рефетч
      dispatch(fetchTicketsThunk());
    } catch (err) {
      notification.error({
        message: "Failed to update task",
        description: err.message || "Something went wrong",
        placement: "bottomRight",
        style: {
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          color: token.colorText,
        },
      });
    }
  };

  // === Фильтрация тикетов ===
  const filteredItems = items.filter((t) => {
    const matchCategory = selectedCategory
      ? t.department === Number(selectedCategory)
      : true;
    const matchText = searchQuery
      ? t.text?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCategory && matchText;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 🔹 Верхняя панель */}
      <TaskHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      {/* 🔹 Канбан-доска (скелетон временно отключён) */}
      <TaskBoard
        columns={columns}
        filteredItems={filteredItems}
        onDragEnd={onDragEnd}
        setSelectedTask={setSelectedTask}
        loading={false} // временно отключаем скелетон
      />

      {/* 🔹 Модалка деталей задачи */}
      <TaskDetailModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onCloseWithRefresh={() => {
          setSelectedTask(null);
          dispatch(fetchTicketsThunk());
        }}
        ticketId={selectedTask?.id}
      />
    </div>
  );
};

export default Tasks;