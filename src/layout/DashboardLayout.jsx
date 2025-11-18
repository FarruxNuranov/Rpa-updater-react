import React, { useState, useEffect } from "react";
import ProfileEdit from "../components/ProfileEdit/ProfileEdit";
import NotificationsBell from "../components/Notifications/NotificationsBell";
import TaskDetailModal from "../components/TaskDetailModal/TaskDetailModal";
import { NotificationsProvider } from "../context/NotificationsContext";
import config from "../config/config";
import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  Avatar,
  Dropdown,
  Typography,
  message,
  notification,
} from "antd";
import NotifierHost from "../components/Notifier/NotifierHost";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  LockOutlined,
  FileTextOutlined,
  MailOutlined,
  TeamOutlined,
  SettingOutlined,
  MessageOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../api/auth/authSlice";
import { useThemeMode } from "../context/ThemeContext"; // ✅ глобальная тема
import { fetchProfileThunk } from "../api/profile/profileSlice";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme, token } = useThemeMode(); // ✅ теперь глобально
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: profile } = useSelector((s) => s.profile);
  const [ticketModalId, setTicketModalId] = useState(null);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfileThunk());
    }
  }, [dispatch, profile]);

  // 🔹 Меню
  const menuItems = [
    {
      type: "group",
      label: isSiderCollapsed ? null : "Main",
      children: [
        {
          key: "/dashboard",
          icon: <AppstoreOutlined />,
          label: "Dashboard",
          onClick: () => navigate("/dashboard"),
        },
        {
          key: "/dashboard/tasks",
          icon: <UnorderedListOutlined />,
          label: "Tasks",
          onClick: () => navigate("/dashboard/tasks"),
        },
        {
          key: "/dashboard/loads",
          icon: <AppstoreOutlined />,
          label: "Loads",
          onClick: () => navigate("/dashboard/loads"),
        },
        {
          key: "/dashboard/emails",
          icon: <MailOutlined />,
          label: "Emails",
          onClick: () => navigate("/dashboard/emails"),
        },
      ],
    },
    {
      type: "group",
      label: isSiderCollapsed ? null : "Account Resources",
      children: [
        {
          key: "/dashboard/users",
          icon: <UserOutlined />,
          label: "Site Users",
          onClick: () => navigate("/dashboard/users"),
        },
        {
          key: "/dashboard/brokers",
          icon: <TeamOutlined />,
          label: "Brokers",
          onClick: () => navigate("/dashboard/brokers"),
        },
        {
          key: "/dashboard/drivers",
          icon: <TeamOutlined />,
          label: "Drivers",
          onClick: () => navigate("/dashboard/drivers"),
        },
        {
          key: "/dashboard/equipments",
          icon: <AppstoreOutlined />,
          label: "Equipments",
          onClick: () => navigate("/dashboard/equipments"),
        },
        {
          key: "/dashboard/companies",
          icon: <FileTextOutlined />,
          label: "My Companies",
          onClick: () => navigate("/dashboard/companies"),
        },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      key: "/dashboard/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/dashboard/settings"),
    },
    {
      key: "/dashboard/support",
      icon: <MessageOutlined />,
      label: "Support",
      onClick: () => navigate("/dashboard/support"),
    },
  ];

  // 🔹 Logout
  const handleLogout = () => {
    dispatch(logout());
    message.success("You have logged out");
    navigate("/login", { replace: true });
  };

  // 🔹 Глобальная конфигурация уведомлений (нижний левый угол)
  useEffect(() => {
    notification.config({ placement: "bottomLeft", duration: 3 });
  }, []);

  // 🔹 Активный пункт меню
  const flatMenuItems = [
    ...menuItems.flatMap((item) => (item.children ? item.children : item)),
    ...bottomMenuItems,
  ];

  const selectedKey =
    flatMenuItems
      .filter((item) => location.pathname.startsWith(item.key))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key || "/dashboard";

  // 🔹 Хлебные крошки
  const pathParts = location.pathname
    .replace("/dashboard", "")
    .split("/")
    .filter(Boolean);

  const breadcrumbItems = [
    { title: "Dashboard" },
    ...pathParts.map((part) => ({
      title: part.charAt(0).toUpperCase() + part.slice(1),
    })),
  ];

  // 🔹 Полноэкранный режим
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <NotificationsProvider onOpenTicket={(id) => setTicketModalId(id)}>
      <Layout
        style={{
          height: "100vh",
          overflow: "hidden",
          background: token.colorBgBase,
        }}
      >
        {/* === HEADER === */}
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            zIndex: 100,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            background: isDark ? "#26262C" : "#FFFFFF",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {/* Notification context holder */}
          <NotifierHost />
          {/* 🔹 Левая часть */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: token.colorPrimary,
                padding: "0 45px 0 25px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>RPA</span> Updater
            </div>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* 🔹 Правая часть */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* 🌙 Переключатель темы */}
            <Button
              type="default"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              style={{
                width: 44,
                height: 44,

                background: isDark ? "#26262C" : "#FFFFFF",
                color: token.colorText,
                fontSize: 18,
              }}
            />

            {/* 🖥 Полноэкранный режим */}
            <Button
              type="default"
              icon={
                isFullscreen ? (
                  <FullscreenExitOutlined />
                ) : (
                  <FullscreenOutlined />
                )
              }
              onClick={handleFullscreenToggle}
              style={{
                width: 44,
                height: 44,
                background: isDark ? "#26262C" : "#FFFFFF",
                color: token.colorText,
                fontSize: 18,
              }}
            />
            {/* Панель уведомлений */}
            <NotificationsBell
              isDark={isDark}
              token={token}
              onOpenTicket={(id) => setTicketModalId(id)}
            />

            {/* 🧑‍💼 Выпадающее меню */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: "Edit Profile",
                    onClick: () => setEditProfileOpen(true),
                  },
                  {
                    key: "password",
                    icon: <LockOutlined />,
                    label: "Change Password",
                    onClick: () => setChangePasswordOpen(true),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: <Text type="danger">Logout</Text>,
                    onClick: handleLogout,
                  },
                ],
              }}
              placement="bottomRight"
              arrow
            >
              <Avatar
                size={44}
                src={
                  profile?.avatarUrl
                    ? `${config.MEDIA_URL}${profile.avatarUrl}`
                    : undefined
                }
                icon={<UserOutlined />}
                style={{
                  backgroundColor: token.colorPrimary,
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
            </Dropdown>

            {/* Profile Edit Modals */}
            <ProfileEdit
              editProfileOpen={editProfileOpen}
              setEditProfileOpen={setEditProfileOpen}
              changePasswordOpen={changePasswordOpen}
              setChangePasswordOpen={setChangePasswordOpen}
            />
          </div>
        </Header>

        {/* === SIDEBAR + CONTENT === */}
        <Layout>
          <Sider
            width={208}
            collapsedWidth={72}
            collapsed={isSiderCollapsed}
            trigger={null}
            theme={isDark ? "dark" : "light"}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              background: isDark ? "#26262C" : "#FFFFFF",
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              paddingTop: 64,
              overflowY: "auto",
              transition: "all 0.2  s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Menu
                mode="inline"
                items={menuItems}
                selectedKeys={[selectedKey]}
                theme={isDark ? "dark" : "light"}
                style={{
                  border: "none",
                  padding: "16px 4px",
                  background: "transparent",
                }}
              />

              <Menu
                mode="inline"
                items={bottomMenuItems}
                selectedKeys={[selectedKey]}
                theme={isDark ? "dark" : "light"}
                style={{
                  border: "none",
                  padding: "0 4px 16px 4px",
                  background: "transparent",
                }}
              />
            </div>
          </Sider>

          {/* Кнопка сворачивания сайдбара */}
          <Button
            type="button"
            onClick={() => setIsSiderCollapsed((prev) => !prev)}
            style={{
              position: "fixed",
              top: 110,
              left: isSiderCollapsed ? 72 : 208,
              transform: "translateX(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${token.colorBorderSecondary}`,
              background: isDark ? "#26262C" : "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(15, 15, 15, 0.16)",
              cursor: "pointer",
              zIndex: 110,
              padding: 0,
            }}
          >
            {isSiderCollapsed ? (
              <RightOutlined style={{ fontSize: 14, color: token.colorText }} />
            ) : (
              <LeftOutlined style={{ fontSize: 14, color: token.colorText }} />
            )}
          </Button>

          <Content
            style={{
              marginLeft: isSiderCollapsed ? 72 : 208,
              marginTop: 63,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              background: isDark ? "#2F2F37" : "#FAFAFA",
              transition: "margin-left 0.2s ease",
            }}
          >
            <Outlet />
            {/* Global Ticket Detail Modal host */}
            <TaskDetailModal
              open={!!ticketModalId}
              ticketId={ticketModalId}
              onClose={() => setTicketModalId(null)}
            />
          </Content>
        </Layout>
      </Layout>
    </NotificationsProvider>
  );
};

export default DashboardLayout;
