import React, { useState } from "react";
import { Card, Segmented, Space, Input, Dropdown, Menu, Button } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import TrucksTable from "./components/TrucksTable";
import TrailersTable from "./components/TrailersTable";
import CreateTruckModal from "./components/CreateTruckModal";
import CreateTrailerModal from "./components/CreateTrailerModal";

const Equipments = () => {
  const [segment, setSegment] = useState("Trucks");
  const [searchTrucks, setSearchTrucks] = useState("");
  const [searchTrailers, setSearchTrailers] = useState("");
  const [truckModalOpen, setTruckModalOpen] = useState(false);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  const activeSearch = segment === "Trucks" ? searchTrucks : searchTrailers;
  const setActiveSearch =
    segment === "Trucks" ? setSearchTrucks : setSearchTrailers;

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        headStyle={{ borderBottom: "none" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Segmented
            options={["Trucks", "Trailers"]}
            value={segment}
            onChange={(val) => setSegment(val)}
          />
          <Space>
            <Input
              type="default"
              size="large"
              allowClear
              placeholder="Search"
              suffix={
                <SearchOutlined style={{ color: "#bfbfbf", fontSize: 16 }} />
              }
              value={activeSearch}
              onChange={(e) => setActiveSearch(e.target.value)}
              style={{ width: 240 }}
            />
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu
                  onClick={({ key }) => {
                    if (key === "manual") {
                      if (segment === "Trucks") {
                        setTruckModalOpen(true);
                      } else {
                        setTrailerModalOpen(true);
                      }
                    }
                  }}
                >
                  <Menu.Item key="refresh" icon={<ReloadOutlined />}>
                    Refresh
                  </Menu.Item>
                  <Menu.Item key="from-qm" icon={<CloudDownloadOutlined />}>
                    From QM
                  </Menu.Item>
                  <Menu.Item key="manual" icon={<PlusOutlined />}>
                    Manual
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="primary" size="large" icon={<PlusOutlined />}>
                Create
              </Button>
            </Dropdown>
          </Space>
        </div>
        {segment === "Trucks" ? (
          <TrucksTable search={searchTrucks} />
        ) : (
          <TrailersTable search={searchTrailers} />
        )}
        <CreateTruckModal
          open={truckModalOpen}
          onCancel={() => setTruckModalOpen(false)}
          onCreate={() => setTruckModalOpen(false)}
        />
        <CreateTrailerModal
          open={trailerModalOpen}
          onCancel={() => setTrailerModalOpen(false)}
          onCreate={() => setTrailerModalOpen(false)}
        />
      </Card>
    </div>
  );
};

export default Equipments;
