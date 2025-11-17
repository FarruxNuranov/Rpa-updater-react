import React, { useState } from "react";
import { Row, Col, Input, Avatar, Select, Button, Space } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "./TaskHeader.module.scss";
import { useThemeMode } from "../../context/ThemeContext"; 

import TaskFilterDropdown from "../TaskFilterDrawer/TaskFilterDropdown";

const TaskHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = {},
}) => {
  const { token, isDark } = useThemeMode(); 
  const [openFilter, setOpenFilter] = useState(false);
  return (
    <div
      className={styles.wrapper}
      style={{
        background: isDark ? "#26262C" : "#FFFFFF",
        padding: "20px 24px",
        borderBottom: `1px solid ${isDark ? "#40404A" : "#F0F0F0"}`,
      }}
    >
      <Row justify="space-between" align="middle" wrap gutter={[16, 12]}>
        {/* 🔹 Левая часть */}
        <Col
          flex="auto"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <Input
            prefix={
              <SearchOutlined style={{ color: token.colorTextSecondary }} />
            }
            size="large"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={{
              lineHeight: "157%",
              fontSize: 14,
              fontWeight: 400,
              maxWidth: 200,
              height: 40,
              padding: "0 12px",
              color: token.colorText,
              background: isDark ? "#26262C" : "#FFFFFF",

              borderRadius: 8,
            }}
          />

          <Avatar.Group
            maxCount={4}
            maxStyle={{
              color: token.colorPrimary,
              backgroundColor: token.colorFillTertiary,
            }}
          >
            {[11, 21, 31].map((num) => (
              <Avatar
                key={num}
                src={`https://i.pravatar.cc/40?img=${num}`}
                style={{
                  background: token.colorPrimaryBg,
                  color: token.colorPrimaryText,
                }}
              />
            ))}
            <Avatar
              style={{
                background: token.colorPrimary,
                color: token.colorTextLightSolid,
              }}
            >
              +9
            </Avatar>
          </Avatar.Group>
        </Col>

        {/* 🔹 Правая часть */}
        <Col>
          <Space size={12}>
            <Select
              placeholder="Group / Driver"
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
              size="large"
              style={{
                width: 200,
                height: 40,
                color: token.colorText,
                background: isDark ? "#26262C" : "#FFFFFF",
              }}
              dropdownStyle={{
                background: isDark ? "#26262C" : "#FFFFFF",
                color: token.colorText,
              }}
              options={Object.entries(categories).map(([key, value]) => ({
                value: key,
                label: value,
              }))}
            />

            <Button
              size="large"
              icon={<FilterOutlined />}
              onClick={() => setOpenFilter((prev) => !prev)}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: isDark ? "#26262C" : "#FFFFFF",
                color: token.colorText,
              }}
            >
              Filter
            </Button>

            <TaskFilterDropdown
              open={openFilter}
              setOpen={setOpenFilter}
            ></TaskFilterDropdown>

            <Button
              icon={<SettingOutlined />}
              size="large"
              style={{
                height: 40,
                background: isDark ? "#26262C" : "#FFFFFF",
                color: token.colorText,
              }}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TaskHeader;
