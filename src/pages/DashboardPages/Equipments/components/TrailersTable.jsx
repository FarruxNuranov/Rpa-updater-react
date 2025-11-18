import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Table, Tag, Space, Button, Checkbox, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Setting4 } from "iconsax-react";
import { useThemeMode } from "../../../../context/ThemeContext";
import CreateTrailerModal from "./CreateTrailerModal";

const STATUS_COLORS = {
  Loaded: "green",
  Rented: "orange",
};

const MOCK_TRAILERS = [
  {
    id: 1,
    unit: "1359",
    vin: "3AKJHHDR9PNS1359",
    make: "Vanguard",
    year: "2023",
    licensePlate: "DF01CG",
    type: "Van",
    weight: "80,000 lbs",
    operatedBy: "SSL TRUCKING INC",
    ownership: "owned",
    owner: "John Doe",
    inServiceDate: "05/21/2024",
    state: "OH",
    country: "usa",
    length: "53 ft",
    height: "13.6 ft",
    numberOfAxles: 3,
    status: "Loaded",
  },
  {
    id: 2,
    unit: "1360",
    vin: "4BJGHDHR9PNS1360",
    make: "Vanguard",
    year: "2023",
    licensePlate: "DF02CG",
    type: "Van",
    weight: "80,000 lbs",
    operatedBy: "SSL TRUCKING INC",
    ownership: "leased",
    owner: "Jane Smith",
    inServiceDate: "05/21/2024",
    state: "OH",
    country: "usa",
    length: "53 ft",
    height: "13.6 ft",
    numberOfAxles: 2,
    status: "Rented",
  },
];

const TrailersTable = ({ search }) => {
  const { token } = useThemeMode();
  const [visibleColumns, setVisibleColumns] = useState([
    "unit",
    "licensePlate",
    "makeYear",
    "typeWeight",
    "operatedBy",
    "status",
  ]);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const dataSource = useMemo(() => {
    if (!search) return MOCK_TRAILERS;
    const value = search.toLowerCase();
    return MOCK_TRAILERS.filter((t) =>
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
        title: "License Plate",
        dataIndex: "licensePlate",
        key: "licensePlate",
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
        title: "Trailer Type/Weight",
        dataIndex: "typeWeight",
        key: "typeWeight",
        render: (_, record) => (
          <div>
            <div>{record.type}</div>
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
              setSelectedTrailer(record);
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
      <CreateTrailerModal
        open={editOpen}
        mode="edit"
        initialValues={
          selectedTrailer
            ? {
                operatedBy: selectedTrailer.operatedBy,
                ownership: selectedTrailer.ownership,
                owner: selectedTrailer.owner,
                unit: selectedTrailer.unit,
                vin: selectedTrailer.vin,
                inServiceDate: selectedTrailer.inServiceDate
                  ? dayjs(selectedTrailer.inServiceDate, "MM/DD/YYYY")
                  : null,
                licensePlate: selectedTrailer.licensePlate,
                state: selectedTrailer.state,
                country: selectedTrailer.country,
                make: selectedTrailer.make,
                year: selectedTrailer.year,
                trailerType: selectedTrailer.type,
                weight: selectedTrailer.weight,
                length: selectedTrailer.length,
                height: selectedTrailer.height,
                numberOfAxles: selectedTrailer.numberOfAxles,
              }
            : undefined
        }
        onCancel={() => {
          setEditOpen(false);
          setSelectedTrailer(null);
        }}
        onCreate={() => {
          setEditOpen(false);
          setSelectedTrailer(null);
        }}
      />
    </>
  );
};

export default TrailersTable;
