import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Dropdown,
  Checkbox,
  Menu,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { Setting4 } from "iconsax-react";
import { useThemeMode } from "../../../context/ThemeContext";
import CreateDriverModal from "./components/CreateDriverModal";

const STATUS_COLORS = {
  Active: "green",
  Inactive: "orange",
};

const MOCK_DRIVERS = [
  {
    id: 1,
    name: "Liam Carter",
    email: "alice.smith@domain.com",
    phone: "+1 505 555 0123",
    hiredCompany: "SSL TRUCKING INC",
    hiredDate: "05/21/2024",
    status: "Active",
  },
  {
    id: 2,
    name: "Ethan Parker",
    email: "bob.johnson@domain.com",
    phone: "+1 818 555 0115",
    hiredCompany: "SSL TRUCKING INC",
    hiredDate: "05/21/2024",
    status: "Active",
  },
  {
    id: 3,
    name: "Noah Bennett",
    email: "charlie.brown@domain.com",
    phone: "+1 212 555 0138",
    hiredCompany: "SSL TRUCKING INC",
    hiredDate: "05/21/2024",
    status: "Active",
  },
  {
    id: 4,
    name: "Oliver Hayes",
    email: "diana.prince@domain.com",
    phone: "+1 909 555 0154",
    hiredCompany: "SSL TRUCKING INC",
    hiredDate: "05/21/2024",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Lucas Turner",
    email: "edward.norton@domain.com",
    phone: "+1 808 555 0167",
    hiredCompany: "SSL TRUCKING INC",
    hiredDate: "05/21/2024",
    status: "Active",
  },
];

const Drivers = () => {
  const { isDark, token } = useThemeMode();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const dataSource = useMemo(() => {
    if (!search) return MOCK_DRIVERS;
    const value = search.toLowerCase();
    return MOCK_DRIVERS.filter((d) =>
      [d.name, d.email, d.phone, d.hiredCompany]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  }, [search]);

  const baseColumns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Hired Company",
        dataIndex: "hiredCompany",
        key: "hiredCompany",
        render: (_, record) => (
          <div>
            <div>{record.hiredCompany}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              {record.hiredDate}
            </div>
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={STATUS_COLORS[status] || "default"}>{status}</Tag>
        ),
      },
    ],
    []
  );

  const [visibleColumns, setVisibleColumns] = useState(() =>
    baseColumns.map((c) => c.key)
  );

  const settingsColumn = useMemo(
    () => ({
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
              icon={<Setting4 size={20} color={token.colorText} />}
            />
          </Dropdown>
        </div>
      ),
      key: "column-settings",
      align: "center",
      render: (record) => (
        <Space size={12}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedDriver(record);
              setEditOpen(true);
            }}
          />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    }),
    [baseColumns, visibleColumns, token.colorText]
  );

  const columns = useMemo(
    () => [
      ...baseColumns.filter((col) => visibleColumns.includes(col.key)),
      settingsColumn,
    ],
    [baseColumns, visibleColumns, settingsColumn]
  );

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        headStyle={{ borderBottom: "none" }}
        title={<span style={{ fontWeight: 600 }}>Drivers</span>}
        extra={
          <Space>
            <Input
              type="default"
              size="large"
              allowClear
              placeholder="Search"
              suffix={
                <SearchOutlined
                  style={{ color: token.colorTextSecondary, fontSize: 16 }}
                />
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: 6,
                borderColor: isDark ? token.colorBorderSecondary : "#d9d9d9",
                background: isDark ? "#1f1f23" : "#FFFFFF",
                color: token.colorText,
              }}
            />
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu
                  onClick={({ key }) => {
                    if (key === "manual") {
                      setCreateOpen(true);
                    }
                  }}
                >
                  <Menu.Item key="refresh" icon={<ReloadOutlined />}>
                    Refresh
                  </Menu.Item>
                  <Menu.Item key="from-qm" icon={<CloudDownloadOutlined />}>
                    From QM
                  </Menu.Item>
                  <Menu.Item key="manual" icon={<PlusOutlined />}>
                    Manual
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                Create
              </Button>
            </Dropdown>
          </Space>
        }
      >
        <Table
          rowSelection={{ selections: true }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <CreateDriverModal
          open={createOpen}
          mode="create"
          onCancel={() => setCreateOpen(false)}
          onCreate={() => setCreateOpen(false)}
        />
        <CreateDriverModal
          open={editOpen}
          mode="edit"
          initialValues={
            selectedDriver
              ? {
                  hiredTo: selectedDriver.hiredCompany,
                  hiredDate: selectedDriver.hiredDate
                    ? dayjs(selectedDriver.hiredDate, "MM/DD/YYYY")
                    : null,
                  firstName: selectedDriver.name,
                  email: selectedDriver.email,
                  phone: selectedDriver.phone,
                }
              : undefined
          }
          onCancel={() => {
            setEditOpen(false);
            setSelectedDriver(null);
          }}
          onCreate={() => {
            setEditOpen(false);
            setSelectedDriver(null);
          }}
        />
      </Card>
    </div>
  );
};

export default Drivers;
