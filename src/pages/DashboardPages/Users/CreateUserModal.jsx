import React, { useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Avatar,
  Space,
  Typography,
  Button,
  Divider,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { CATEGORIES } from "../../../config/tickets";
import { uploadFileThunk } from "../../../api/files/filesSlice";

const { Option } = Select;

const ROLES_MAP = { 0: "Administrator", 1: "Updater" };
const DEPARTMENTS_MAP = CATEGORIES; // numeric -> label

const CreateUserModal = ({ open, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const initial = useMemo(
    () => ({ name: "", email: "", dept: undefined, role: undefined }),
    []
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let avatarUrl;
      if (selectedFile) {
        try {
          setIsUploading(true);
          const uploaded = await dispatch(
            uploadFileThunk({ file: selectedFile, language: "uz" })
          ).unwrap();
          avatarUrl = uploaded?.url;
        } catch (e) {
          message.error(e?.message || "Failed to upload image");
          return;
        } finally {
          setIsUploading(false);
        }
      }
      if (onSave) onSave({ ...values, avatarUrl });
    } catch {
      // no-op
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type?.startsWith("image/");
    if (!isImage) {
      message.error("Only image files are allowed");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setSelectedFile(file);
    return false;
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
      <Space
        size={12}
        align="center"
        style={{ width: "100%", paddingBottom: "16px" }}
      >
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <Avatar
              src={previewUrl}
              icon={
                !previewUrl ? <UserOutlined style={{ fontSize: 42 }} /> : null
              }
              style={{
                cursor: "pointer",
                width: 64,
                height: 64,
                backgroundColor: "#E5E7EB",
                boxShadow: "0 0 0 2px #fff, 0 0 0 6px rgba(255,255,255,0.8)",
              }}
            />
            {!previewUrl && !isUploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  zIndex: 1,
                  pointerEvents: "none",
                  color: "#8c8c8c",
                }}
              >
                <UploadOutlined style={{ fontSize: 32 }} />
              </div>
            )}
            {isUploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "50%",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <LoadingOutlined style={{ fontSize: 22 }} />
              </div>
            )}
          </div>
        </Upload>
        <div>
          <Typography.Text strong>{form.getFieldValue("name")}</Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {form.getFieldValue("email")}
          </Typography.Text>
        </div>
      </Space>
      <Form
        form={form}
        layout="vertical"
        initialValues={initial}
        preserve={false}
      >
        <Form.Item
          size="large"
          name="name"
          label="Name"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 16 }}
        >
          <Input
            size="large"
            style={{ width: "427px" }}
            placeholder="Full Name"
          />
        </Form.Item>
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
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
