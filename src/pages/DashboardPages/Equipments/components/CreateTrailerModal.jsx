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

const CreateTrailerModal = ({
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
      title={mode === "edit" ? "Edit Trailer" : "Create Trailer"}
      onCancel={onCancel}
      width={900}
      centered
      bodyStyle={{ paddingTop: 12, paddingBottom: 16 }}
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
            style={{ flex: 1, maxWidth: 120 }}
            size="large"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ flex: 1, maxWidth: 120 }}
            onClick={handleOk}
          >
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} style={{ marginTop: 4 }}>
        {/* Rows 1-2: 3 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 16,
            rowGap: 6,
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
        </div>

        {/* Row 3 - Make / Year (2 columns) */}
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
              <Option value="vanguard">Vanguard</Option>
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

        {/* Row 4 - Licence Plate / Trailer Type (2 columns) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 16,
          }}
        >
          <Form.Item
            label="Licence Plate #"
            name="licensePlate"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Licence Plate #" />
          </Form.Item>
          <Form.Item
            label="Trailer Type"
            name="trailerType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select Trailer Type">
              <Option value="van">Van</Option>
              <Option value="reefer">Reefer</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Row 5 - Length / Height / Number of Axles (3 columns) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: 16,
          }}
        >
          <Form.Item
            label="Length"
            name="length"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="0 ft" />
          </Form.Item>
          <Form.Item
            label="Height"
            name="height"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="0 ft" />
          </Form.Item>
          <Form.Item
            label="Number of Axles"
            name="numberOfAxles"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="0" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateTrailerModal;
