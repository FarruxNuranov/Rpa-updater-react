import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  Space,
} from "antd";

const { Option } = Select;

const CreateTruckModal = ({
  open,
  onCancel,
  onCreate,
  mode = "create",
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (onCreate) onCreate(values);
    } catch {
      // validation errors
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
      title={mode === "edit" ? "Edit Truck" : "Create Truck"}
      onCancel={onCancel}
      width={900}
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
            style={{ flex: 1, width: "100px" }}
            size="large"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ flex: 1, width: "100px" }}
            onClick={handleOk}
          >
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
        {/* Rows 1-3: 3 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 16,
            rowGap: 5,
          }}
        >
          {/* Row 1 */}
          <Form.Item
            label="Operated By"
            name="operatedBy"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select Company">
              <Option value="company1">Company 1</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ownership"
            name="ownership"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Ownership Type">
              <Option value="owned">Owned</Option>
              <Option value="leased">Leased</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Owner"
            name="owner"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Owner Name" />
          </Form.Item>

          {/* Row 2 */}
          <Form.Item
            label="Unit #"
            name="unit"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Unit #" />
          </Form.Item>
          <Form.Item
            label="VIN"
            name="vin"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="VIN #" />
          </Form.Item>
          <Form.Item
            label="In Service Date"
            name="inServiceDate"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          {/* Row 3 */}
          <Form.Item
            label="Licence Plate #"
            name="licensePlate"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Licence Plate #" />
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

        {/* Row 4 - Make / Year (2 columns) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 16,
          }}
        >
          <Form.Item
            label="Make"
            name="make"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select Make">
              <Option value="freightliner">Freightliner</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="YYYY" />
          </Form.Item>
        </div>

        {/* Row 5 - Fuel Type / Weight (2 columns) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 16,
          }}
        >
          <Form.Item
            label="Fuel Type"
            name="fuelType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select Fuel Type">
              <Option value="diesel">Diesel</Option>
              <Option value="gas">Gasoline</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Weight"
            name="weight"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="0 lbs" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateTruckModal;
