import React, { useMemo } from "react";
import { Modal, Form, Input, Select, Space, Button } from "antd";
import { CATEGORIES } from "../../../config/tickets";

const { Option } = Select;

const ROLES_MAP = { 0: "Administrator", 1: "Updater" };
const DEPARTMENTS_MAP = CATEGORIES; // numeric -> label
const STATUS_OPTIONS = ["Active", "Inactive"];

const CreateUserModal = ({ open, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const initial = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      dept: undefined,
      role: undefined,
      status: undefined,
    }),
    []
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const fullName = `${values.firstName ?? ""} ${
        values.lastName ?? ""
      }`.trim();

      if (onSave)
        onSave({
          ...values,
          name: fullName || undefined,
        });
    } catch {
      // no-op
    }
  };

  return (
    <Modal
      open={open}
      title={"Create User"}
      onCancel={onCancel}
      destroyOnClose
      width={475}
      footer={
        <Space style={{ width: "100%", gap: "8px" }} size={12}>
          <Button
            size="large"
            style={{ flex: 1, width: "209px" }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="large"
            style={{ flex: 1, width: "209px" }}
            type="primary"
            onClick={handleOk}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initial}
        preserve={false}
      >
        {/* First / Last name в одной строке */}
        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item
            size="large"
            name="firstName"
            label="First name"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1, marginBottom: 16 }}
          >
            <Input size="large" placeholder="First name" />
          </Form.Item>
          <Form.Item
            size="large"
            name="lastName"
            label="Last name"
            rules={[{ required: true, message: "Required" }]}
            style={{ flex: 1, marginBottom: 16 }}
          >
            <Input size="large" placeholder="Last name" />
          </Form.Item>
        </div>
        <Form.Item
          size="large"
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Required" },
            { type: "email", message: "Invalid email" },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input size="large" placeholder="example@mail.com" />
        </Form.Item>
        <Form.Item
          name="dept"
          label="Department"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 16 }}
        >
          <Select size="large" placeholder="Select Department" allowClear>
            {Object.entries(DEPARTMENTS_MAP).map(([value, label]) => (
              <Option key={value} value={Number(value)}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 16 }}
        >
          <Select size="large" placeholder="Select Role" allowClear>
            {Object.entries(ROLES_MAP).map(([value, label]) => (
              <Option key={value} value={Number(value)}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Select size="large" placeholder="Select Status" allowClear>
            {STATUS_OPTIONS.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
