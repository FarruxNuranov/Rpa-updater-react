import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Form,
  Input,
  Select,
  Button,
  List,
  Space,
  notification,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { CATEGORIES } from "../../../config/tickets";
import { getUserById, updateUser, changeUserPassword } from "../../../api/users/usersApi";

const { Title, Text } = Typography;
const { Option } = Select;

// API-driven; no mock user

const MOCK_HISTORY = [
  {
    id: 1,
    date: "2025-11-04, 12:00",
    text: "status changed from InProgress to Review",
  },
  {
    id: 2,
    date: "2025-11-04, 12:30",
    text: "status changed from Todo to InProgress",
  },
  {
    id: 3,
    date: "2025-11-04, 13:00",
    text: "status changed from InProgress to Done",
  },
  {
    id: 4,
    date: "2025-11-04, 14:15",
    text: "status changed from Rejected to InProgress",
  },
];

const ROLES_MAP = { 0: "Administrator", 1: "Updater" };

const UsersDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwdForm] = Form.useForm();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getUserById(id);
        if (!mounted) return;
        const u = res?.data || {};
        setUser(u);
        form.setFieldsValue({
          name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
          email: u.email ?? "",
          department: u.department,
          role: u.role,
        });
      } catch (e) {
        api.error({
          message: "Failed to load user",
          description: e?.message || "",
          placement: "bottomLeft",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id, form, api]);

  const initial = useMemo(
    () => ({
      name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      email: user?.email ?? "",
      department: user?.department,
      role: user?.role,
    }),
    [user]
  );

  const onFinish = async (values) => {
    const name = (values.name || "").trim();
    const [firstName = "", ...rest] = name.split(" ");
    const lastName = rest.join(" ").trim();
    const payload = {
      firstName,
      lastName,
      email: values.email,
      tenantId: 1,
      department: values.department,
      role: values.role,
    };
    setSaving(true);
    try {
      const res = await updateUser(id, payload);
      if (res?.status >= 200 && res?.status < 300) {
        api.info({
          message: "User Updated!",
          description: "You have updated user successfully.",
          placement: "bottomLeft",
        });
        setUser((prev) => ({ ...(prev || {}), ...payload }));
      } else {
        api.warning({
          message: "Unexpected response",
          description: `Status: ${res?.status ?? "unknown"}`,
          placement: "bottomLeft",
        });
      }
    } catch (e) {
      api.error({
        message: "Failed to update user",
        description: e?.message || "",
        placement: "bottomLeft",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Row gutter={16}>
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
              headStyle={{ borderBottom: "none" }}
              loading={loading}
            >
              <Space
                size={16}
                align="center"
                style={{ width: "100%", marginBottom: 16 }}
              >
                <Avatar size={56} icon={<UserOutlined />} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    {initial.name}
                  </Title>
                  <Text type="secondary">{initial.email}</Text>
                </div>
              </Space>
              <Form
                form={form}
                layout="vertical"
                initialValues={initial}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  style={{ marginBottom: 16 }}
                >
                  <Input placeholder="Full name" size="large" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ marginBottom: 16 }}
                >
                  <Input placeholder="example@mail.com" size="large" />
                </Form.Item>
                <Form.Item
                  label="Department"
                  name="department"
                  style={{ marginBottom: 16 }}
                >
                  <Select placeholder="Select Department" size="large">
                    {Object.entries(CATEGORIES).map(([value, label]) => (
                      <Option key={value} value={Number(value)}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Role"
                  name="role"
                  style={{ marginBottom: 16 }}
                >
                  <Select placeholder="Select Role" size="large">
                    {Object.entries(ROLES_MAP).map(([value, label]) => (
                      <Option key={value} value={Number(value)}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Space style={{ width: "100%" }} size={12}>
                  <Button
                    size="large"
                    style={{ flex: 1 }}
                    onClick={() => form.setFieldsValue(initial)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    style={{ flex: 1 }}
                    htmlType="submit"
                    loading={saving}
                  >
                    Save changes
                  </Button>
                </Space>
              </Form>
            </Card>

            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
              headStyle={{ borderBottom: "none" }}
            >
              <Title level={5} style={{ marginTop: 0 }}>
                Change password
              </Title>
              <Form layout="vertical" form={pwdForm} onFinish={async (values) => {
                const { newPassword, confirmPassword } = values || {};
                if (!newPassword || !confirmPassword) return;
                if (newPassword !== confirmPassword) {
                  api.warning({ message: "Passwords do not match", placement: "bottomLeft" });
                  return;
                }
                setPwSaving(true);
                try {
                  const res = await changeUserPassword(id, newPassword);
                  if (res?.status >= 200 && res?.status < 300) {
                    api.success({ message: "Password changed", placement: "bottomLeft" });
                    pwdForm.resetFields();
                  } else {
                    api.warning({ message: "Unexpected response", description: `Status: ${res?.status ?? "unknown"}`, placement: "bottomLeft" });
                  }
                } catch (e) {
                  api.error({ message: "Failed to change password", description: e?.message || "", placement: "bottomLeft" });
                } finally {
                  setPwSaving(false);
                }
              }}>
                <Form.Item
                  label="New password"
                  name="newPassword"
                  style={{ marginBottom: 16 }}
                  rules={[{ required: true, message: "Enter new password" }]}
                >
                  <Input.Password placeholder="New password" size="large" />
                </Form.Item>
                <Form.Item
                  label="Repeat new password"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  style={{ marginBottom: 16 }}
                  rules={[
                    { required: true, message: "Repeat new password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Passwords do not match"));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Repeat new password"
                    size="large"
                  />
                </Form.Item>
                <Space style={{ width: "100%" }} size={12}>
                  <Button size="large" style={{ flex: 1 }} onClick={() => pwdForm.resetFields()} disabled={pwSaving}>
                    Cancel
                  </Button>
                  <Button size="large" type="primary" style={{ flex: 1 }} htmlType="submit" loading={pwSaving}>
                    Change password
                  </Button>
                </Space>
              </Form>
            </Card>
          </Space>
        </Col>

        {/* Right history card */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
            headStyle={{ borderBottom: "none" }}
            title={<span style={{ fontWeight: 600 }}>History</span>}
          >
            <List
              itemLayout="horizontal"
              dataSource={MOCK_HISTORY}
              renderItem={(item) => (
                <List.Item>
                  <Space size={12}>
                    <Text type="secondary" style={{ width: 160 }}>
                      {item.date}
                    </Text>
                    <span>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: "#1677ff" }}
                      >
                        Ticket
                      </a>{" "}
                      {item.text}
                    </span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UsersDetail;
