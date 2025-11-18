import React from "react";
import { Modal, Form, Input, Select, Radio, Button, Space } from "antd";

const { Option } = Select;

const CreateBrokerModal = ({ open, onCancel, onCreate }) => {
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
      title="Create Broker"
      onCancel={onCancel}
      width={900}
      footer={
        <Space style={{ width: "100%", gap: 8 , display: "flex",
            justifyContent: "flex-end",
          }}>
          <Button style={{ flex: 1, width: "100px" }} size="large" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ flex: 1, width: "100px" }}
            onClick={handleOk}
          >
            Create
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} style={{ marginTop: 8 }}>
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
            size="large"
            label="Contract with"
            name="contractWith"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" placeholder="Select Company">
              <Option value="company1">Company 1</Option>
            </Select>
          </Form.Item>

          <Form.Item
            size="large"
            label="Email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Invalid email" },
            ]}
          >
            <Input size="large" placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item
            size="large"
            label="Customer type"
            name="customerType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Space size={24}>
                <Radio value="broker">Broker</Radio>
                <Radio value="shipper">Shipper</Radio>
                <Radio value="carrier">Carrier</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Row 2 */}
          <Form.Item
            size="large"
            label="Name"
            name="name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="Company name" />
          </Form.Item>

          <Form.Item
            size="large"
            label="MC number"
            name="mcNumber"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="MC number" />
          </Form.Item>

          <Form.Item size="large" label="Ref number" name="refNumber">
            <Input size="large" placeholder="Ref number" />
          </Form.Item>

          {/* Row 3 */}
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
            label="Country"
            name="country"
            rules={[{ required: true, message: "Required" }]}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Space size={24}>
                <Radio value="usa">USA</Radio>
                <Radio value="canada">Canada</Radio>
                <Radio value="mexico">Mexico</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* Row 4 */}
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" placeholder="City" />
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
      </Form>
    </Modal>
  );
};

export default CreateBrokerModal;
