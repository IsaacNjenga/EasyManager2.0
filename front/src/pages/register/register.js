import React from "react";
import Navbar from "../../components/navbar";
import { Layout, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import RegisterContent from "./registerContent";
const { Content, Header } = Layout;
function Register() {
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
              fontSize: "22px",
              textAlign: "center",
              background: colorBgContainer,
              fontWeight: "bold",
            }}
          >
            Register
          </Header>
          <Content style={{ margin: "26px 16px", overflow: "auto" }}>
            <div
              style={{
                padding: 24,
                minHeight: "100vh",
                fontSize: "18px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <RegisterContent />
            </div>
          </Content>
        </Layout>{" "}
      </Layout>
    </>
  );
}

export default Register;
