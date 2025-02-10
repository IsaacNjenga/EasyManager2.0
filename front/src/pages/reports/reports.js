import React from "react";
import Navbar from "../../components/navbar";
import { Layout, theme } from "antd";
import ReportsContent from "./reportsContent";
const { Content, Sider, Header } = Layout;

function Reports() {
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
            Reports
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
              <ReportsContent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Reports;
