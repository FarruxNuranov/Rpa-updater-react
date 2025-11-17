import React, { useMemo, useState, useEffect } from "react";
import { Card, Row, Col, Typography, Tabs, Table, Button } from "antd";
import {
  CheckCircleFilled,
  ThunderboltFilled,
  CheckSquareFilled,
  DropboxSquareFilled,
  CloudDownloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Reports = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  // top metrics (static placeholder)
  const metrics = useMemo(
    () => [
      {
        title: "Resolved Issues",
        value: 12,
        color: "#52C41A",
        bg: "rgba(82, 196, 26, 0.15)",
        icon: <CheckCircleFilled />,
      },
      {
        title: "Critical Issues",
        value: 8,
        color: "#FAAD14",
        bg: "rgba(250, 173, 20, 0.15)",
        icon: <ThunderboltFilled />,
      },
      {
        title: "Active Issues",
        value: 13,
        color: "#69B1FF",
        bg: "rgba(105, 177, 255, 0.18)",
        icon: <CheckSquareFilled />,
      },
      {
        title: "Total Shipments Today",
        value: 83,
        color: "#69B1FF",
        bg: "rgba(105, 177, 255, 0.18)",
        icon: <DropboxSquareFilled />,
      },
    ],
    []
  );

  // table columns and data (static placeholder)
  const columns = [
    { title: "Header", dataIndex: "col1", key: "col1" },
    { title: "Header", dataIndex: "col2", key: "col2" },
    { title: "Header", dataIndex: "col3", key: "col3", align: "right" },
  ];
  const data = Array.from({ length: 2 }).map((_, i) => ({
    key: i + 1,
    col1: i === 0 ? "Header" : "Table cell text",
    col2: "Table cell text",
    col3: "Table cell text",
  }));
  const rowSelection = { selections: true };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        {metrics.map((item, i) => (
          <Col xs={24} sm={12} md={12} lg={6} key={i}>
            <Card
              loading={loading}
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
        style={{ marginTop: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        headStyle={{ borderBottom: "none" }}
        title={<span style={{ fontWeight: 600 }}>Reports</span>}
        extra={<Button type="default" icon={<CloudDownloadOutlined style={{ fontSize: 16 }} />}>Export</Button>}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            { key: "1", label: "Tab title", children: (
              <Table
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
              />
            )},
            { key: "2", label: "Tab title", children: (
              <Table
                rowSelection={{ ...rowSelection }}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
              />
            )},
          ]}
        />
      </Card>
    </div>
  );
};

export default Reports;
