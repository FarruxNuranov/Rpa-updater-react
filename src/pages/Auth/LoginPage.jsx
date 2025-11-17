// src/pages/Auth/LoginPage.jsx
import React, { useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../../api/auth/authSlice";

const { Title } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, token } = useSelector((s) => s.auth);

  // 🔁 Если уже авторизован, уводим с /login на /dashboard
  useEffect(() => {
    const t = token || localStorage.getItem("token");
    if (t) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    try {
      // 🔹 Запускаем loginThunk
      const res = await dispatch(loginThunk(values));

      if (res.meta.requestStatus === "fulfilled") {
        message.success("Welcome back!");
        navigate("/dashboard"); // ✅ переход в дашборд
      } else {
        message.error(res.payload || "Login failed");
      }
    } catch (error) {
      message.error("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Title
        level={3}
        style={{
          marginBottom: 32,
          fontWeight: 700,
          color: "#1f1f1f",
        }}
      >
        Login
      </Title>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        style={{
          width: "100%",
          maxWidth: 460,
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="example@mail.com"
            size="large"
            style={{
              borderRadius: 8,
              height: 44,
            }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Password"
            size="large"
            style={{
              borderRadius: 8,
              height: 44,
            }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{
              borderRadius: 8,
              height: 44,
              fontWeight: 500,
              fontSize: 15,
              backgroundColor: "#3879f9",
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;