import React, { useEffect } from "react";
import Navbar from "../../components/navbar";
import { Layout, notification, theme } from "antd";
import DashboardContent from "./dashboardContent";
import { SmileOutlined } from "@ant-design/icons";
const { Content, Sider, Header } = Layout;

function Dashboard() {
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (localStorage.getItem("showLoginNotification") === "true") {
      api.success({
        message: `Welcome!`,
        description: "Login Successful",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
      localStorage.removeItem("showLoginNotification"); // Clear flag after showing
    }
  }, []);

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
              {contextHolder}
              <DashboardContent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Dashboard;
