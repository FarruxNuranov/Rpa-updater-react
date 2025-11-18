import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Button,
  Space,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateDriverModal = ({ open, onCancel, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (onCreate) onCreate(values);
    } catch {
      // validation errors
    }
  };

  return (
    <Modal
      open={open}
      title="Create Driver"
      onCancel={onCancel}
      width={900}
      footer={
        <Space style={{ width: "100%", gap: 8 }}>
          <Button style={{ flex: 1 }} size="large" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ flex: 1 }}
            onClick={handleOk}
          >
            Create
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <Form.Item
            label="Hired To"
            name="hiredTo"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select Company">
              <Option value="company1">Company 1</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Hired Date"
            name="hiredDate"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            label="Driver type"
            name="driverType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select Type">
              <Option value="companyDriver">Company Driver</Option>
              <Option value="ownerOperator">Owner Operator</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            label="Birth Date"
            name="birthDate"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Phone number" />
          </Form.Item>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 16,
            marginTop: 8,
          }}
        >
          <Form.Item
            label="Address"
            name="address1"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="Address line" />
          </Form.Item>
          <Form.Item label="Address" name="address2">
            <Input placeholder="Address 2" />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Required" }]}
          >
            <Radio.Group>
              <Radio value="usa">USA</Radio>
              <Radio value="canada">Canada</Radio>
              <Radio value="mexico">Mexico</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 16,
            marginTop: 8,
          }}
        >
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select State">
              <Option value="CA">CA</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="ZIP"
            name="zip"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="ZIP Code" />
          </Form.Item>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 8 }}>
            Upload Driver's License (optional)
          </div>
          <Form.Item name="license">
            <Upload.Dragger multiple={false} accept="image/*,.pdf">
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 32 }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Supported formats: Images, PDF</p>
            </Upload.Dragger>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateDriverModal;
