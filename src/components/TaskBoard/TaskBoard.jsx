import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, Space, Tag, Skeleton } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./TaskBoard.module.scss";
import { useThemeMode } from "../../context/ThemeContext";

const TaskBoard = ({
  columns,
  filteredItems,
  onDragEnd,
  setSelectedTask,
  loading = false, // 🔹 флаг загрузки
  recentlyMovedId = null, // 🔹 временно закрепляем наверху
}) => {
  const { token, isDark } = useThemeMode();
  const [maxHeight, setMaxHeight] = useState(0);
  const colRefs = useRef({});

  // 🔹 вычисляем максимальную высоту колонок
  useEffect(() => {
    const heights = Object.values(colRefs.current).map(
      (el) => el?.scrollHeight || 0
    );
    const max = Math.max(...heights);
    if (max > 0) setMaxHeight(max);
  }, [filteredItems]);

  // === 🔹 Скелетон-состояние ===
  if (loading) {
    return (
      <div
        className={styles.wrapper}
        style={{
          padding: "16px 20px 24px",
        }}
      >
        <Row gutter={[16, 16]}>
          {Object.entries(columns).map(([colId]) => (
            <Col span={6} key={colId}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 8,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: isDark ? "#131316" : "#FFFFFF",
              
                }}
                title={
                  <Space align="center">
                    <Skeleton.Button
                      active
                      size="small"
                      style={{
                        width: 100,
                        height: 20,
                        borderRadius: 6,
                      }}
                    />
                    <Skeleton.Button
                      active
                      size="small"
                      style={{
                        width: 24,
                        height: 20,
                        borderRadius: 4,
                      }}
                    />
                  </Space>
                }
              >
                <div
                  style={{
                    minHeight: maxHeight || 700,
                  }}
                >
                  {/* 🔹 Фейковые карточки */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <TaskCard key={i} loading={true} />
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // === 🔹 Основной контент Kanban ===
  return (
    <div
      className={styles.wrapper}
      style={{
        padding: "16px 20px 24px",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[16, 16]}>
          {Object.entries(columns).map(([colId, col]) => {
            const tasks = filteredItems
              .filter((t) => t.status === col.status)
              .sort((a, b) => {
                // 1) Пинним только что перетянутую карточку наверх
                if (recentlyMovedId) {
                  if (a.id === recentlyMovedId) return -1;
                  if (b.id === recentlyMovedId) return 1;
                }
                // 2) Остальные — по updatedAt по убыванию (свежие сверху)
                const ta = new Date(a.updatedAt || 0).getTime();
                const tb = new Date(b.updatedAt || 0).getTime();
                return tb - ta;
              });

            return (
              <Col span={6} key={colId}>
                <Card
                  title={
                    <Space align="center">
                      <span
                        className={styles.columnTitle}
                        style={{
                          color: token.colorTextTertiary,
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                      >
                        {col.title.toUpperCase()}
                      </span>
                      <Tag
                        style={{
                          fontSize: 12,
                          borderRadius: 4,
                          fontWeight: 500,
                          padding: "1px 8px",
                          border: `1px solid ${token.colorBorderSecondary}`,
                          background: isDark ? "#26262C" : "#FFFFFF",
                          color: token.colorText,
                        }}
                      >
                        {tasks.length}
                      </Tag>
                    </Space>
                  }
                  bordered={false}
                  style={{
                    borderRadius: 8,
                    color: token.colorText,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  
                  }}
                  headStyle={{
                    background: isDark ? "#131316" : "#F5F5F5",
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    fontWeight: 600,
                    fontSize: 14,
                    color: token.colorTextHeading,
                  }}
                  bodyStyle={{
                    padding: 8,
                    background: isDark ? "#131316" : "#F5F5F5",
                    minHeight: maxHeight || 700,
                  }}
                >
                  <Droppable droppableId={colId}>
                    {(provided, snapshot) => (
                      <div
                        ref={(el) => {
                          provided.innerRef(el);
                          colRefs.current[colId] = el;
                        }}
                        {...provided.droppableProps}
                        className={styles.droppableArea}
                        style={{
                          background: snapshot.isDraggingOver
                            ? token.colorFillTertiary
                            : "transparent",
                          borderRadius: 8,
                          minHeight: maxHeight || 650,
                        }}
                      >
                        {tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  marginBottom: 8,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => setSelectedTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </Col>
            );
          })}
        </Row>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
