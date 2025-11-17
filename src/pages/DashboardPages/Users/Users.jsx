import React, { useMemo, useState, useEffect } from "react";
import { Card, Table, Button, Tag, Space, notification, Modal } from "antd";
import {
  CloudDownloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../api/users/usersSlice";
import CreateUserModal from "./CreateUserModal";
import { CATEGORIES } from "../../../config/tickets";
import {
  createUser,
  updateUser,
  deleteUser,
} from "../../../api/users/usersApi";

const DEPT_COLORS = {
  Dispatcher: "blue",
  Updater: "gold",
  Fleet: "purple",
  Safety: "red",
  ELD: "green",
  Accounting: "geekblue",
};
const ROLE_MAP = { 0: "Administrator", 1: "Updater" };



const Users = () => {
  const [api, contextHolder] = notification.useNotification();
  const [mockLoading, setMockLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const dispatch = useDispatch();
  const { items, loading, total, paging } = useSelector(
    (s) =>
      s.users || {
        items: [],
        loading: false,
        total: 0,
        paging: { skip: 0, take: 10 },
      }
  );
  const current = Math.floor((paging?.skip ?? 0) / (paging?.take ?? 10)) + 1;
  const pageSize = paging?.take ?? 10;
  useEffect(() => {
    const t = setTimeout(() => setMockLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    dispatch(
      fetchUsers({
        skip: 0,
        take: 10,
        sortPropName: "createdAt",
        sortDirection: 2,
        acceptLanguage: "UZ",
      })
    );
  }, [dispatch]);
  const navigate = useNavigate();
  const handleDelete = React.useCallback((record) => {
    console.log("[Users] Delete clicked:", record);
    setDeleteTarget(record);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteUser(deleteTarget.id);
      if (res?.status >= 200 && res?.status < 300) {
        api.success({
          message: "User Deleted!",
          description: "You have deleted user successfully.",
          placement: "bottomLeft",
        });
        dispatch(
          fetchUsers({
            skip: (current - 1) * pageSize,
            take: pageSize,
            sortPropName: "createdAt",
            sortDirection: 2,
            acceptLanguage: "UZ",
          })
        );
      } else {
        api.warning({
          message: "Unexpected response",
          description: `Status: ${res?.status ?? "unknown"}`,
          placement: "bottomLeft",
        });
      }
    } catch (e) {
      api.error({
        message: "Failed to delete user",
        description: e?.message || "",
        placement: "bottomLeft",
      });
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  }, [api, current, pageSize, dispatch, deleteTarget]);
  const columns = useMemo(
    () => [
      {
        title: "Name",
        key: "name",
        render: (_, record) => (
          <Button
            type="link"
            onClick={() => navigate(`/dashboard/users/${record.id}`)}
            style={{ padding: 0 }}
          >
            <span style={{ fontWeight: 500 }}>
              {`${record.firstName ?? ""} ${record.lastName ?? ""}`.trim()}
            </span>
          </Button>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Department",
        key: "department",
        render: (_, record) => {
          const label = CATEGORIES?.[record.department] ?? record.department;
          return <Tag color={DEPT_COLORS[label] || "default"}>{label}</Tag>;
        },
      },
      {
        title: "Role",
        key: "role",
        render: (_, record) => (
          <Tag>{ROLE_MAP?.[record.role] ?? record.role}</Tag>
        ),
      },
      {
        title: "",
        key: "actions",
        align: "right",
        render: (_, record) => (
          <Space size={8}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setEditUser(record);
                setEditOpen(true);
              }}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record);
              }}
            />
          </Space>
        ),
      },
    ],
    [navigate, handleDelete]
  );

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        headStyle={{ borderBottom: "none" }}
        title={<span style={{ fontWeight: 600 }}>Users</span>}
        extra={
          <Space>
            <Button
              type="default"
              icon={<CloudDownloadOutlined style={{ fontSize: 16 }} />}
            >
              Export
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateOpen(true)}
            >
              Create User
            </Button>
          </Space>
        }
      >
        <Table
          rowSelection={{ selections: true }}
          columns={columns}
          dataSource={items}
          loading={loading || mockLoading}
          rowKey="id"
          pagination={{
            current,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            total,
          }}
          onChange={(pagination, filters, sorter) => {
            const current = pagination?.current || 1;
            const pageSize = pagination?.pageSize || 10;
            const sortPropName = sorter?.field;
            const sortDirection =
              sorter?.order === "ascend"
                ? 1
                : sorter?.order === "descend"
                ? 2
                : undefined;
            dispatch(
              fetchUsers({
                skip: (current - 1) * pageSize,
                take: pageSize,
                sortPropName,
                sortDirection,
                acceptLanguage: "UZ",
              })
            );
          }}
        />
      </Card>
      <Modal
        open={deleteOpen}
        title="Delete User"
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        footer={
          <Space style={{ width: "100%", gap: 8 }}>
            <Button
              size="large"
              style={{ flex: 1 }}
              onClick={() => {
                setDeleteOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              size="large"
              danger
              type="primary"
              style={{ flex: 1 }}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </Space>
        }
        centered
        zIndex={2000}
      >
        <div>
          Are you sure you want to delete{" "}
          <strong>
            {`${deleteTarget?.firstName ?? ""} ${
              deleteTarget?.lastName ?? ""
            }`.trim()}
          </strong>
          ?
        </div>
      </Modal>
      <CreateUserModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSave={async (payload) => {
          try {
            const res = await createUser(payload);
            if (res?.status >= 200 && res?.status < 300) {
              api.success({
                message: "User Created!",
                description: "You have created user successfully.",
                placement: "bottomLeft",
              });
            } else {
              api.warning({
                message: "Unexpected response",
                description: `Status: ${res?.status ?? "unknown"}`,
                placement: "bottomLeft",
              });
            }
            setCreateOpen(false);
            dispatch(
              fetchUsers({
                skip: 0,
                take: pageSize,
                sortPropName: "createdAt",
                sortDirection: 2,
                acceptLanguage: "UZ",
              })
            );
          } catch (e) {
            api.error({
              message: "Failed to create user",
              description: e?.message || "",
              placement: "bottomLeft",
            });
          }
        }}
      />
      <CreateUserModal
        open={editOpen}
        mode="edit"
        title="Edit User"
        initialValues={
          editUser
            ? {
                firstName: editUser.firstName,
                lastName: editUser.lastName,
                email: editUser.email,
                department: editUser.department,
                role: editUser.role,
              }
            : undefined
        }
        onCancel={() => setEditOpen(false)}
        onSave={async (payload) => {
          try {
            const res = await updateUser(editUser.id, payload);
            if (res?.status >= 200 && res?.status < 300) {
              api.info({
                message: "User Updated!",
                description: "You have updated user successfully.",
                placement: "bottomLeft",
              });
            } else {
              api.warning({
                message: "Unexpected response",
                description: `Status: ${res?.status ?? "unknown"}`,
                placement: "bottomLeft",
              });
            }
            setEditOpen(false);
            setEditUser(null);
            dispatch(
              fetchUsers({
                skip: (current - 1) * pageSize,
                take: pageSize,
                sortPropName: "createdAt",
                sortDirection: 2,
                acceptLanguage: "UZ",
              })
            );
          } catch (e) {
            api.error({
              message: "Failed to update user",
              description: e?.message || "",
              placement: "bottomLeft",
            });
          }
        }}
      />
    </div>
  );
};

export default Users;
