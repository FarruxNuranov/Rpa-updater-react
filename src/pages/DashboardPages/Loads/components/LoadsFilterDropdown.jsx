import React, { useState } from "react";
import {
  Popover,
  Checkbox,
  Avatar,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Button,
} from "antd";
import { UserOutlined, FilterOutlined } from "@ant-design/icons";
import { useThemeMode } from "../../../../context/ThemeContext";

const { Text } = Typography;

const LoadsFilterDropdown = ({ onChange }) => {
  const { token, isDark } = useThemeMode();

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);

  const companies = ["SSL Trucking", "Topfleet Inc"];
  const paperworkOptions = ["Document miss", "Has issue", "All good"];
  const assignees = [
    { id: 1, name: "Alex", avatar: "https://i.pravatar.cc/40?img=11" },
    { id: 2, name: "Farid", avatar: "https://i.pravatar.cc/40?img=22" },
    { id: 3, name: "Bekzod", avatar: "https://i.pravatar.cc/40?img=33" },
    { id: 4, name: "Ali", avatar: "https://i.pravatar.cc/40?img=44" },
    { id: 5, name: "Elbek", avatar: "https://i.pravatar.cc/40?img=55" },
  ];

  const handleClearAll = () => {
    setSelectedGroups([]);
    setSelectedDepartments([]);
    setSelectedAssignees([]);
    setSelectedPriorities([]);
    onChange?.({
      groups: [],
      departments: [],
      assignees: [],
      priorities: [],
    });
  };

  const updateFilters = (newValues) => {
    const all = {
      groups: selectedGroups,
      departments: selectedDepartments,
      assignees: selectedAssignees,
      priorities: selectedPriorities,
      ...newValues,
    };
    onChange?.(all);
  };

  const content = (
    <div
      style={{
        width: 412,
        borderRadius: 8,
        background: isDark ? "#2F2F37" : "#FAFAFA",
        color: token.colorText,
        boxShadow: token.boxShadowSecondary,
        maxHeight: 534,
        overflowY: "auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: 412,
          height: 56,
          padding: "16px 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: isDark ? "#2F2F37" : "#FAFAFA",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          boxSizing: "border-box",
        }}
      >
        <Text
          strong
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "150%",
            color: token.colorTextHeading,
          }}
        >
          Filters
        </Text>

        <Button
          type="link"
          size="small"
          onClick={handleClearAll}
          style={{
            color: token.colorPrimary,
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "157%",
            padding: 0,
          }}
        >
          Clear filters
        </Button>
      </div>

      <Space
        direction="vertical"
        size={18}
        style={{ width: "100%", padding: "12px 24px" }}
      >
        {/* DISPATCHER */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              strong
              style={{
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "200%",
              }}
            >
              Dispatcher ({selectedAssignees.length})
            </Text>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedAssignees([]);
                updateFilters({ assignees: [] });
              }}
              style={{
                color: token.colorPrimary,
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "157%",
                padding: 0,
              }}
            >
              Clear
            </Button>
          </div>

          <Space wrap size={8} style={{ marginTop: 10 }}>
            {assignees.map((a) => {
              const isSelected = selectedAssignees.includes(a.id);
              return (
                <Avatar
                  key={a.id}
                  src={a.avatar}
                  icon={<UserOutlined />}
                  onClick={() => {
                    const newList = isSelected
                      ? selectedAssignees.filter((id) => id !== a.id)
                      : [...selectedAssignees, a.id];
                    setSelectedAssignees(newList);
                    updateFilters({ assignees: newList });
                  }}
                  style={{
                    background: isSelected ? token.colorPrimary : "#f5f5f5",
                    color: isSelected ? "#fff" : "#666",
                    border: isSelected
                      ? `2px solid ${token.colorPrimary}`
                      : "2px solid transparent",
                    cursor: "pointer",
                  }}
                />
              );
            })}
            <Avatar
              icon={<UserOutlined />}
              style={{
                background: "transparent",
                border: `1px dashed ${token.colorBorderSecondary}`,
                cursor: "pointer",
              }}
            />
          </Space>
        </div>

        {/* PAPERWORK */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              strong
              style={{ fontWeight: 500, fontSize: 14, lineHeight: "200%" }}
            >
              Paperwork
            </Text>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedPriorities([]);
                updateFilters({ paperwork: [] });
              }}
              style={{
                color: token.colorPrimary,
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "157%",
                padding: 0,
              }}
            >
              Clear
            </Button>
          </div>

          <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
            {paperworkOptions.map((p) => (
              <Checkbox
                key={p}
                checked={selectedPriorities.includes(p)}
                onChange={(e) => {
                  const newList = e.target.checked
                    ? [...selectedPriorities, p]
                    : selectedPriorities.filter((x) => x !== p);
                  setSelectedPriorities(newList);
                  updateFilters({ paperwork: newList });
                }}
              >
                {p}
              </Checkbox>
            ))}
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              strong
              style={{ fontWeight: 500, fontSize: 14, lineHeight: "200%" }}
            >
              Company ({selectedDepartments.length})
            </Text>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedDepartments([]);
                updateFilters({ departments: [] });
              }}
              style={{
                color: token.colorPrimary,
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "157%",
                padding: 0,
              }}
            >
              Clear
            </Button>
          </div>

          <Row gutter={[8, 4]} style={{ marginTop: 8 }}>
            {companies.map((dep) => (
              <Col span={24} key={dep}>
                <Checkbox
                  checked={selectedDepartments.includes(dep)}
                  onChange={(e) => {
                    const newDeps = e.target.checked
                      ? [...selectedDepartments, dep]
                      : selectedDepartments.filter((d) => d !== dep);
                    setSelectedDepartments(newDeps);
                    updateFilters({ departments: newDeps });
                  }}
                >
                  {dep}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>
      </Space>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={
        <div style={{ marginTop: 16 }}>
          {/* смещение */}
          {content}
        </div>
      }
      overlayInnerStyle={{
        background: "transparent",
        padding: 0,
        boxShadow: "none",
      }}
      overlayStyle={{
        marginTop: 18,
        padding: 0,
        borderRadius: 8,
      }}
    >
      <Button size="large" type="default" icon={<FilterOutlined />}>
        Filter
      </Button>
    </Popover>
  );
};

export default LoadsFilterDropdown;
