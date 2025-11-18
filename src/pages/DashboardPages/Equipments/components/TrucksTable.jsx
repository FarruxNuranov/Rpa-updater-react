import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Table, Tag, Space, Button, Checkbox, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Setting4 } from "iconsax-react";
import { useThemeMode } from "../../../../context/ThemeContext";
import CreateTruckModal from "./CreateTruckModal";

const STATUS_COLORS = {
  Active: "green",
  Inactive: "orange",
};

const MOCK_TRUCKS = [
  {
    id: 1,
    unit: "1359",
    vin: "3AKJHHDR9PNS1359",
    make: "Freightliner",
    year: "2023",
    licensePlate: "DF01CG / OH",
    fuelType: "Diesel",
    weight: "80,000 lbs",
    operatedBy: "SSL TRUCKING INC",
    ownership: "owned",
    owner: "John Doe",
    inServiceDate: "05/21/2024",
    state: "OH",
    country: "usa",
    status: "Active",
  },
  {
    id: 2,
    unit: "1360",
    vin: "4BJGHDHR9PNS1360",
    make: "Freightliner",
    year: "2023",
    licensePlate: "DF02CG / OH",
    fuelType: "Diesel",
    weight: "80,000 lbs",
    operatedBy: "SSL TRUCKING INC",
    ownership: "leased",
    owner: "Jane Smith",
    inServiceDate: "05/21/2024",
    state: "OH",
    country: "usa",
    status: "Inactive",
  },
];

const TrucksTable = ({ search }) => {
  const { token } = useThemeMode();
  const [visibleColumns, setVisibleColumns] = useState([
    "unit",
    "makeYear",
    "licensePlate",
    "fuel",
    "operatedBy",
    "status",
  ]);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);

  const dataSource = useMemo(() => {
    if (!search) return MOCK_TRUCKS;
    const value = search.toLowerCase();
    return MOCK_TRUCKS.filter((t) =>
      [t.unit, t.vin, t.make, t.licensePlate, t.operatedBy]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value))
    );
  }, [search]);

  const baseColumns = useMemo(
    () => [
      {
        title: "Unit/VIN",
        dataIndex: "unit",
        key: "unit",
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 500 }}>{record.unit}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.vin}</div>
          </div>
        ),
      },
      {
        title: "Make/Year",
        dataIndex: "makeYear",
        key: "makeYear",
        render: (_, record) => (
          <div>
            <div>{record.make}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.year}</div>
          </div>
        ),
      },
      {
        title: "License Plate",
        dataIndex: "licensePlate",
        key: "licensePlate",
      },
      {
        title: "Fuel Type/Weight",
        dataIndex: "fuel",
        key: "fuel",
        render: (_, record) => (
          <div>
            <div>{record.fuelType}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              {record.weight}
            </div>
          </div>
        ),
      },
      {
        title: "Operated by",
        dataIndex: "operatedBy",
        key: "operatedBy",
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
              setSelectedTruck(record);
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
    <>
      <Table
        rowSelection={{ selections: true }}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <CreateTruckModal
        open={editOpen}
        mode="edit"
        initialValues={
          selectedTruck
            ? {
                operatedBy: selectedTruck.operatedBy,
                ownership: selectedTruck.ownership,
                owner: selectedTruck.owner,
                unit: selectedTruck.unit,
                vin: selectedTruck.vin,
                inServiceDate: selectedTruck.inServiceDate
                  ? dayjs(selectedTruck.inServiceDate, "MM/DD/YYYY")
                  : null,
                licensePlate: selectedTruck.licensePlate,
                state: selectedTruck.state,
                country: selectedTruck.country,
                make: selectedTruck.make,
                year: selectedTruck.year,
                fuelType: selectedTruck.fuelType,
                weight: selectedTruck.weight,
              }
            : undefined
        }
        onCancel={() => {
          setEditOpen(false);
          setSelectedTruck(null);
        }}
        onCreate={() => {
          setEditOpen(false);
          setSelectedTruck(null);
        }}
      />
    </>
  );
};

export default TrucksTable;
