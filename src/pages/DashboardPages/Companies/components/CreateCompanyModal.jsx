import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Space, Button, Radio, Upload } from "antd";
import { SearchOutlined, InboxOutlined } from "@ant-design/icons";
import { useThemeMode } from "../../../../context/ThemeContext";

const { Option } = Select;

const CreateCompanyModal = ({
  open,
  onCancel,
  onCreate,
  mode = "create",
  initialValues,
}) => {
  const [form] = Form.useForm();
  const { token } = useThemeMode();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      if (onCreate) {
        await onCreate(values);
      }
      onCancel?.();
    } catch {
      // validation errors are handled by antd
    }
  };

  useEffect(() => {
    if (!open) return;
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else if (mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, mode, form]);

  return (
    <Modal
      open={open}
      title={
        <span style={{ fontWeight: 600 }}>
          {mode === "edit" ? "Edit Company" : "Create Company"}
        </span>
      }
      onCancel={onCancel}
      width={960}
      centered
      bodyStyle={{
        paddingTop: 16,
        paddingBottom: 16,
        maxHeight: 620,
        overflowY: "auto",
      }}
      footer={
        <Space
          style={{
            width: "100%",
            gap: 8,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            size="large"
            style={{ flex: 1, maxWidth: 120 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ flex: 1, maxWidth: 120 }}
            onClick={handleCreate}
          >
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </Space>
      }
    >
      <Form
        layout="vertical"
        form={form}
        style={{ marginTop: 4 }}
        requiredMark={false}
      >
        {/* Row 1: DOT, MC */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 16,
            marginBottom: 8,
          }}
        >
          <Form.Item
            label="DOT"
            name="dot"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Owner Name" />
          </Form.Item>
          <Form.Item
            label="MC"
            name="mc"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="MC Number" />
          </Form.Item>
        </div>

        {/* Row 2: Name, DBA, FEIN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            columnGap: 16,
            marginBottom: 8,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Company Name" />
          </Form.Item>
          <Form.Item label="DBA" name="dba">
            <Input size="large" placeholder="DBA" />
          </Form.Item>
          <Form.Item label="FEIN" name="fein">
            <Input size="large" placeholder="FEIN" />
          </Form.Item>
        </div>

        {/* Row 3: Address, Address 2, Country */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1.4fr 1fr",
            columnGap: 16,
            marginBottom: 8,
          }}
        >
          <Form.Item
            label="Address"
            name="address1"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Address line" />
          </Form.Item>
          <Form.Item label="Address" name="address2">
            <Input size="large" placeholder="Address 2" />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Country <span style={{ color: "#ff4d4f" }}>*</span>
              </span>
            }
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

        {/* Row 4: City, State, ZIP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 16,
            marginBottom: 8,
          }}
        >
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input
              size="large"
              placeholder="City"
              suffix={
                <SearchOutlined
                  style={{ color: token.colorTextSecondary, fontSize: 16 }}
                />
              }
            />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select State">
              <Option value="CA">CA</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="ZIP"
            name="zip"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="ZIP Code" />
          </Form.Item>
        </div>

        {/* Row 5: Email, Phone, Timezone */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 16,
            marginBottom: 8,
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="example@mail.com" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Phone number" />
          </Form.Item>
          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select Timezone">
              <Option value="eastern">Eastern</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Row 6: Trip Counter, Payroll Period */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 16,
            marginBottom: 8,
          }}
        >
          <Form.Item
            label="Trip Counter"
            name="tripCounter"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Trip Number Counter" />
          </Form.Item>
          <Form.Item
            label="Payroll Period"
            name="payrollPeriod"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Monday to Sunday">
              <Option value="mon-sun">Monday to Sunday</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Row 7: Logo upload */}
        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 8 }}>Logo</div>
          <Form.Item name="logo" style={{ marginBottom: 8 }}>
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
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#f59e0b",
            }}
          >
            Note: This can be set only once!
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateCompanyModal;
