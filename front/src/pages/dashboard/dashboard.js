import React from "react";
import Navbar from "../../components/navbar";
import { Layout, theme } from "antd";
import DashboardContent from "./dashboardContent";
const { Content, Sider, Header } = Layout;

function Dashboard() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Layout hasSider>
        <Sider>
          <Navbar />
        </Sider>
        <Layout>
          {" "}
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              fontSize: "22px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Dashboard
          </Header>
          <Content style={{ margin: "26px 16px", overflow: "auto" }}>
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                minHeight: "100vh",
                fontSize: "18px",
              }}
            >
              <DashboardContent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Dashboard;
