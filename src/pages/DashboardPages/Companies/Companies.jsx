import React, { useMemo, useState } from "react";
import { Input, Button, Space, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useThemeMode } from "../../../context/ThemeContext";
import { companyLogo } from "../../../utils/getImage";

const MOCK_COMPANIES = [
  {
    id: 1,
    name: "SSL TRUCKING INC",
    dot: "DOT 3923121",
    mc: "MC 1454412",
    phone: "513-653-0671",
    email: "ssltruckinginc@gmail.com",
    timezone: "Eastern",
    address: "2208 OXFORD STATE RD Middletown, Ohio 45044",
    logoUrl: companyLogo,
  },
  {
    id: 2,
    name: "TOPFLEET INC",
    dot: "DOT 3923121",
    mc: "MC 1454412",
    phone: "513-653-0671",
    email: "topfleetinc@gmail.com",
    timezone: "Eastern",
    address: "5380 PLEASANT AVE SUITE 4D-10 Fairfield, Ohio 45014",
    logoUrl: companyLogo,
  },
];

const Companies = () => {
  const [search, setSearch] = useState("");
  const { token, isDark } = useThemeMode();

  const filteredCompanies = useMemo(() => {
    if (!search) return MOCK_COMPANIES;
    const s = search.toLowerCase();
    return MOCK_COMPANIES.filter((c) =>
      [c.name, c.dot, c.mc, c.email, c.address]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(s))
    );
  }, [search]);

  const onChangeSearch = (value) => {
    setSearch(value);
  };
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: isDark ? token.colorBgContainer : "#ffffff",
          boxShadow: isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.6)"
            : "0 4px 12px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,

            gap: 16,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: token.colorText }}>
            My Companies
          </h2>
          <Space size={12} style={{ flexShrink: 0 }}>
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
              onChange={(e) => onChangeSearch(e.target.value)}
              style={{
                borderRadius: 6,
                borderColor: isDark ? token.colorBorderSecondary : "#d9d9d9",
                background: isDark ? "#1f1f23" : "#FFFFFF",
                color: token.colorText,
              }}
            />

            <Button type="primary" size="large" icon={<PlusOutlined />}>
              Create
            </Button>
          </Space>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              style={{
                borderRadius: 12,
                border: `1px solid ${
                  isDark ? token.colorBorderSecondary : "#f0f0f0"
                }`,
                background: isDark ? token.colorBgElevated : "#ffffff",
                display: "flex",
                flexDirection: "column",
                minHeight: 236,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  gap: 8,
                  borderBottom: `1px solid ${
                    isDark ? token.colorBorderSecondary : "#f0f0f0"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{company.name}</span>
                  <Tag color="geekblue">{company.dot}</Tag>
                  <Tag color="geekblue">{company.mc}</Tag>
                </div>
                <Space size={4}>
                  <Button
                    type="text"
                    size="large"
                    icon={<EditOutlined />}
                    style={{ padding: 0, color: token.colorText }}
                  />
                  <Button
                    type="text"
                    size="large"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ padding: 0 }}
                  />
                </Space>
              </div>

              <div
                style={{
                  padding: "12px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  columnGap: 16,
                  rowGap: 4,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 164,
                    height: 164,
                    borderRadius: 4,
                    background: isDark ? "#1f1f1f" : "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 12,
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "22px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <PhoneOutlined style={{ fontSize: 14 }} />
                    <span>{company.phone}</span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <MailOutlined style={{ fontSize: 14 }} />
                    <span>{company.email}</span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <GlobalOutlined style={{ fontSize: 14 }} />
                    <span>{company.timezone}</span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <EnvironmentOutlined style={{ fontSize: 14 }} />
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 260,
                      }}
                    >
                      {company.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
