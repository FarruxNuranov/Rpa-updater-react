import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Segmented,
  Table,
  Button,
  Tag,
  Dropdown,
  Checkbox,
  Badge,
} from "antd";
import {
  FireFilled,
  WarningFilled,
  CarFilled,
  CheckCircleFilled,
  CloudDownloadOutlined,
  PlusOutlined,

  UnorderedListOutlined,
  AppstoreOutlined,
  ColumnWidthOutlined,

} from "@ant-design/icons";
import { useThemeMode } from "../../../context/ThemeContext";
import PaperworkDetail from "./PaperworkDetail";
import { Setting4, DocumentText } from "iconsax-react";
import LoadsFilterDropdown from "./components/LoadsFilterDropdown";

const { Title, Text } = Typography;

const Loads = () => {
  const [loading, setLoading] = useState(true);
  const { isDark, token } = useThemeMode();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // top metrics (fake data)
  const metrics = useMemo(
    () => [
      {
        title: "Delayed",
        value: 12,
        color: "#fa541c",
        bg: "rgba(250, 84, 28, 0.12)",
        icon: <FireFilled />,
      },
      {
        title: "Exceptions",
        value: 12,
        color: "#faad14",
        bg: "rgba(250, 173, 20, 0.12)",
        icon: <WarningFilled />,
      },
      {
        title: "In-Transit",
        value: 120,
        color: "#36cfc9",
        bg: "rgba(54, 207, 201, 0.12)",
        icon: <CarFilled />,
      },
      {
        title: "Delivered",
        value: 24,
        color: "#52c41a",
        bg: "rgba(82, 196, 26, 0.12)",
        icon: <CheckCircleFilled />,
      },
    ],
    []
  );

  // fake loads table data
  const loadsData = useMemo(
    () => [
      {
        key: "LD98765",
        loadId: "LD98765",
        status: "Assigned",
        statusType: "default",
        driver: "O/O 1234 Rajesh Singh",
        dispatcher: "Jordan Casey",
        route: "TX - LA",
        eta: "11:05 (150mi)",
        delayHours: 0.5,
        lastUpdate: "12:42",
        paperworkStatus: "pending",
        paperworkCount: 0,
      },
      {
        key: "LD87654",
        loadId: "LD87654",
        status: "Assigned",
        statusType: "default",
        driver: "O/O 4455 Simran Kaur",
        dispatcher: "Sam Parker",
        route: "PA - NY",
        eta: "09:30 (200mi)",
        delayHours: 2.3,
        lastUpdate: "12:42",
        paperworkStatus: "missing",
        paperworkCount: 5,
      },
      {
        key: "LD76543",
        loadId: "LD76543",
        status: "In-transit",
        statusType: "processing",
        driver: "O/O 9900 Kavita Mehta",
        dispatcher: "Chris Johnson",
        route: "FL - MI",
        eta: "14:15 (75mi)",
        delayHours: 0,
        lastUpdate: "12:42",
        paperworkStatus: "ok",
        paperworkCount: 3,
      },
      {
        key: "LD65432",
        loadId: "LD65432",
        status: "Delayed",
        statusType: "error",
        driver: "O/O 5566 Sneha Reddy",
        dispatcher: "Casey Adams",
        route: "CA - TX",
        eta: "10:50 (300mi)",
        delayHours: -0.1,
        lastUpdate: "12:42",
        paperworkStatus: "missing",
        paperworkCount: 2,
      },
      {
        key: "LD54321",
        loadId: "LD54321",
        status: "In-transit",
        statusType: "processing",
        driver: "O/O 7788 Amit Patel",
        dispatcher: "Jamie Lee",
        route: "IL - OH",
        eta: "16:22 (250mi)",
        delayHours: 0.4,
        lastUpdate: "12:42",
        paperworkStatus: "pending",
        paperworkCount: 1,
      },
      {
        key: "LD43210",
        loadId: "LD43210",
        status: "Exception",
        statusType: "warning",
        driver: "O/O 3344 Vikram Joshi",
        dispatcher: "Morgan White",
        route: "WA - OR",
        eta: "08:45 (180mi)",
        delayHours: 1.2,
        lastUpdate: "12:42",
        paperworkStatus: "missing",
        paperworkCount: 5,
      },
      {
        key: "LD32109",
        loadId: "LD32109",
        status: "Delayed",
        statusType: "error",
        driver: "O/O 9101 Anil Verma",
        dispatcher: "Alexis Green",
        route: "CO - NM",
        eta: "15:05 (90mi)",
        delayHours: -0.3,
        lastUpdate: "12:42",
        paperworkStatus: "pending",
        paperworkCount: 0,
      },
      {
        key: "LD21098",
        loadId: "LD21098",
        status: "Delivered",
        statusType: "success",
        driver: "O/O 5678 Priya Sharma",
        dispatcher: "Jordan Taylor",
        route: "GA - AL",
        eta: "13:30 (120mi)",
        delayHours: 3.1,
        lastUpdate: "12:42",
        paperworkStatus: "ok",
        paperworkCount: 4,
      },
      {
        key: "LD10987",
        loadId: "LD10987",
        status: "Delivered",
        statusType: "success",
        driver: "O/O 9910 Riley Morgan",
        dispatcher: "Taylor Brooks",
        route: "NV - UT",
        eta: "17:10 (60mi)",
        delayHours: -0.7,
        lastUpdate: "12:42",
        paperworkStatus: "missing",
        paperworkCount: 1,
      },
      {
        key: "LD09876",
        loadId: "LD09876",
        status: "Completed",
        statusType: "success",
        driver: "O/O 2233 Rohan Nair",
        dispatcher: "Taylor Brooks",
        route: "MA - RI",
        eta: "18:25 (130mi)",
        delayHours: -0.2,
        lastUpdate: "12:42",
        paperworkStatus: "ok",
        paperworkCount: 2,
      },
    ],
    []
  );

  const baseColumns = useMemo(
    () => [
      {
        title: "Load ID",
        dataIndex: "loadId",
        key: "loadId",
        render: (value) => <Text strong>{value}</Text>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
          <Tag color={record.statusType}>{record.status}</Tag>
        ),
      },
      {
        title: "Driver",
        dataIndex: "driver",
        key: "driver",
        render: (value) => (
          <span style={{ color: "#1677ff", cursor: "pointer" }}>{value}</span>
        ),
      },
      {
        title: "Dispatcher",
        dataIndex: "dispatcher",
        key: "dispatcher",
      },
      {
        title: "Origin - Destination",
        dataIndex: "route",
        key: "route",
      },
      {
        title: "ETA",
        dataIndex: "eta",
        key: "eta",
      },
      {
        title: "Delay",
        dataIndex: "delayHours",
        key: "delay",
        render: (value) => {
          const sign = value > 0 ? "+" : "";
          const color =
            value > 0 ? "#52c41a" : value < 0 ? "#ff4d4f" : "#595959";
          return <span style={{ color }}>{`${sign}${value.toFixed(1)}h`}</span>;
        },
      },
      {
        title: "Last Update",
        dataIndex: "lastUpdate",
        key: "lastUpdate",
      },
    ],
    []
  );

  const rowSelection = {
    selections: true,
  };

  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list | grid | split
  const [visibleColumns, setVisibleColumns] = useState(() =>
    baseColumns.map((c) => c.key)
  );
  const [paperworkOpen, setPaperworkOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const tabs = [
    { key: "all", label: "All Loads", filter: () => true },
    {
      key: "assigned",
      label: "Assigned",
      filter: (r) => r.status === "Assigned",
    },
    {
      key: "inTransit",
      label: "In-Transit",
      filter: (r) => r.status === "In-transit",
    },
    { key: "delayed", label: "Delayed", filter: (r) => r.status === "Delayed" },
    {
      key: "exception",
      label: "Exception",
      filter: (r) => r.status === "Exception",
    },
    {
      key: "delivered",
      label: "Delivered",
      filter: (r) => r.status === "Delivered",
    },
    {
      key: "completed",
      label: "Completed",
      filter: (r) => r.status === "Completed",
    },
  ];

  const filteredData = useMemo(() => {
    const tab = tabs.find((t) => t.key === activeTab) || tabs[0];
    return loadsData.filter(tab.filter);
  }, [loadsData, activeTab]);

  const columns = useMemo(
    () => baseColumns.filter((col) => visibleColumns.includes(col.key)),
    [visibleColumns, baseColumns]
  );

  const settingsColumn = {
    title: (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Dropdown
          trigger={["click"]}
          menu={{
            items: baseColumns.map((col) => ({
              key: col.key,
              label: (
                <Checkbox
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => {
                    setVisibleColumns((prev) => {
                      const exists = prev.includes(col.key);
                      if (exists) {
                        // не даём выключить все колонки
                        if (prev.length === 1) return prev;
                        return prev.filter((k) => k !== col.key);
                      }
                      return [...prev, col.key];
                    });
                  }}
                >
                  {col.title}
                </Checkbox>
              ),
            })),
          }}
        >
          <Button
            type="text"
            icon={<Setting4 size={24} color={token.colorText} />}
          />
        </Dropdown>
      </div>
    ),
    key: "paperwork-settings",
    align: "center",
    render: (_, record) => {
      const status = record.paperworkStatus || "pending"; // pending | missing | ok
      let borderColor = "#faad14"; // yellow by default
      let bgColor = "rgba(250, 173, 20, 0.12)";

      if (status === "missing") {
        borderColor = "#ff4d4f";
        bgColor = "rgba(255, 77, 79, 0.12)";
      } else if (status === "ok") {
        borderColor = "#52c41a";
        bgColor = "rgba(82, 196, 26, 0.12)";
      }

      const count = record.paperworkCount ?? 0;

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Badge
            count={status === "missing" && count > 0 ? count : 0}
            offset={[0, 4]}
            color="#ff4d4f"
          >
            <Button
              type="text"
              onClick={() => {
                setSelectedLoad(record);
                setPaperworkOpen(true);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                padding: 0,
                border: `1px solid ${borderColor}`,
                background: bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              icon={
                <DocumentText size={18} color={borderColor} variant="Outline" />
              }
            />
          </Badge>
        </div>
      );
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {metrics.map((item, i) => (
          <Col xs={24} sm={12} md={12} lg={6} key={i}>
            <Card
              loading={false}
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

      <Card
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
        headStyle={{ borderBottom: "none" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Segmented
            size="large"
            value={activeTab}
            onChange={(val) => setActiveTab(val)}
            options={tabs.map((tab) => ({
              label: tab.label,
              value: tab.key,
            }))}
            style={{
              background: isDark ? "#26262C" : "#f5f5f5",
              color: isDark ? token.colorTextLightSolid : token.colorText,

              padding: 2,
            }}
          />

          <div style={{ display: "flex", gap: 16 }}>
            <Button type="default" size="large" icon={<PlusOutlined />}>
              Create
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<CloudDownloadOutlined />}
              style={{ height: 40 }}
            >
              Import
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <LoadsFilterDropdown onChange={() => {}} />

          <div
            style={{
              display: "inline-flex",
              gap: 4,
              background: isDark ? "#26262C" : "#f5f5f5",
              color: isDark ? token.colorTextLightSolid : token.colorText,
              borderRadius: 6,
              padding: 2,
            }}
          >
            <Button
              type="text"
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode("list")}
              style={{
                borderRadius: 6,
                background:
                  viewMode === "list"
                    ? isDark
                      ? "#333333"
                      : "#ffffff"
                    : "transparent",
                color: viewMode === "list" ? token.colorText : "#8c8c8c",
              }}
            />
            <Button
              type="text"
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode("grid")}
              style={{
                borderRadius: 6,
                background:
                  viewMode === "grid"
                    ? isDark
                      ? "#333333"
                      : "#ffffff"
                    : "transparent",
                color: viewMode === "grid" ? token.colorText : "#8c8c8c",
              }}
            />
            <Button
              type="text"
              icon={<ColumnWidthOutlined />}
              onClick={() => setViewMode("split")}
              style={{
                borderRadius: 6,
                background:
                  viewMode === "split"
                    ? isDark
                      ? "#333333"
                      : "#ffffff"
                    : "transparent",

                color: viewMode === "split" ? token.colorText : "#8c8c8c",
              }}
            />
          </div>
        </div>

        <Table
          rowSelection={{ ...rowSelection }}
          columns={[...columns, settingsColumn]}
          dataSource={filteredData}
          loading={false}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <PaperworkDetail
        open={paperworkOpen}
        load={selectedLoad}
        onClose={() => {
          setPaperworkOpen(false);
          setSelectedLoad(null);
        }}
      />
    </div>
  );
};

export default Loads;
