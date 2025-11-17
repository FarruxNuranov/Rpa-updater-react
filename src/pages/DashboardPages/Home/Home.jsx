import React, { useEffect, useMemo } from "react";
import { Card, Row, Col, Typography, Spin } from "antd";
import {
  CheckCircleFilled,
  ThunderboltFilled,
  CheckSquareFilled,
  DropboxSquareFilled,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTicketStatusStatsThunk,
  fetchTicketCategoryStatsThunk,
} from "../../../api/tickets/ticketStatsSlice";
import { CATEGORIES, STATUS_COLORS } from "../../../config/tickets";

const { Title, Text } = Typography;

// use STATUS_COLORS from config (0: To Do, 1: Blocked, 2: In Progress, 3: Done)

const Home = () => {
  const dispatch = useDispatch();
  const { statusStats, categoryStats, loading } = useSelector(
    (s) => s.ticketStats
  );

  // 🔹 Загружаем статистику при монтировании
  useEffect(() => {
    dispatch(fetchTicketStatusStatsThunk());
    dispatch(fetchTicketCategoryStatsThunk());
  }, [dispatch]);

  // === 🔹 Метрики (верхний ряд карточек)
  const metrics = useMemo(() => {
    return [
      {
        title: "Done Tickets",
        value: statusStats?.doneTicketsCount ?? 0,
        color: "#95de64",
        bg: "rgba(149, 222, 100, 0.15)",
        icon: <CheckCircleFilled />,
      },
      {
        title: "High Priority Tickets",
        value: statusStats?.highPriorityTicketsCount ?? 0,
        color: "#faad14",
        bg: "rgba(250, 173, 20, 0.15)",
        icon: <ThunderboltFilled />,
      },
      {
        title: "Unassigned Tickets",
        value: statusStats?.unassignedTicketsCount ?? 0,
        color: "#597ef7",
        bg: "rgba(89, 126, 247, 0.15)",
        icon: <CheckSquareFilled />,
      },
      {
        title: "Today’s Tickets",
        value: statusStats?.todayTicketsCount ?? 0,
        color: "#262962",
        bg: "rgba(38, 41, 98, 0.15)",
        icon: <DropboxSquareFilled />,
      },
    ];
  }, [statusStats]);

  // === 🔹 Данные для графика (нижний ряд)
  const chartData = useMemo(() => {
    if (!categoryStats || !Array.isArray(categoryStats)) return [];

    return categoryStats.map((cat) => {
      const name = CATEGORIES[cat.department] || `Category ${cat.department}`;
      const todo = cat.statuses.find((s) => s.status === 0)?.count || 0;
      const blocked = cat.statuses.find((s) => s.status === 1)?.count || 0;
      const inProgress = cat.statuses.find((s) => s.status === 2)?.count || 0;
      const done = cat.statuses.find((s) => s.status === 3)?.count || 0;

      return { name, todo, blocked, inProgress, done };
    });
  }, [categoryStats]);

  // === 🔹 Рендеры для цифр внутри сегментов
  const makeCenterLabel = (textColor = "#fff") => (props) => {
    const { value, x, y, width, height } = props;
    if (!value || height < 18) return null; // скрыть мелкие
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        style={{ fontSize: 12, fontWeight: 600 }}
      >
        {value}
      </text>
    );
  };

  // === 🔹 Кастомная легенда (порядок: To Do, Blocked, In Progress, Done)
  const renderLegend = () => {
    const items = [
      { key: "todo", name: "To Do", color: STATUS_COLORS[0] },
      { key: "blocked", name: "Blocked", color: STATUS_COLORS[1] },
      { key: "inProgress", name: "In Progress", color: STATUS_COLORS[2] },
      { key: "done", name: "Done", color: STATUS_COLORS[3] },
    ];
    return (
      <div style={{ display: "flex", gap: 16, justifyContent: "center", paddingBottom: 20 }}>
        {items.map((it) => (
          <div key={it.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: it.color,
              }}
            />
            <span style={{ color: "#2e2e2e" }}>{it.name}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading && !statusStats) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{padding:24,}}>
      {/* === ВЕРХНИЕ КАРТОЧКИ === */}
      <Row gutter={[16, 16]}>
        {metrics.map((item, i) => (
          <Col xs={24} sm={12} md={12} lg={6} key={i}>
            <Card
              bordered={false}
              style={{
                
                borderRadius: 12,
                height: 120,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    
                    background: item.bg,
                    color: item.color,
                    borderRadius: "50%",
                    fontSize: 22,
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <Text style={{ color: "#595959" }}>{item.title}</Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {item.value}
                  </Title>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* === НИЖНИЙ ГРАФИК === */}
      <Card
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 12,

          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <ResponsiveContainer width="100%" height={340}>
         <BarChart data={chartData} barSize={40} barGap={6}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
              contentStyle={{
                borderRadius: 10,
                fontSize: 13,
                padding: 10,
              }}
            />
            <Legend verticalAlign="top" align="center" content={renderLegend} />

            <Bar
              dataKey="todo"
              name="To Do"
              fill={STATUS_COLORS[0]}
              stackId="a"
            >
              <LabelList dataKey="todo" content={makeCenterLabel("#ffffff")} />
            </Bar>
            <Bar
              dataKey="inProgress"
              name="In Progress"
              fill={STATUS_COLORS[2]}
              stackId="a"
            >
              <LabelList dataKey="inProgress" content={makeCenterLabel("#ffffff")} />
            </Bar>
            <Bar
              dataKey="done"
              name="Done"
              fill={STATUS_COLORS[3]}
              stackId="a"
            >
              <LabelList dataKey="done" content={makeCenterLabel("#0B53CE")} />
            </Bar>
            <Bar
              dataKey="blocked"
              name="Blocked"
              fill={STATUS_COLORS[1]}
              stackId="a"
            >
              <LabelList dataKey="blocked" content={makeCenterLabel("#2E3A59")} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Home;
