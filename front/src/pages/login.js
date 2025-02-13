import React, { useState } from "react";
import Navbar from "../components/navbar";
import { Button, Card, Form, Input, Layout, theme } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
const { Content, Sider, Header } = Layout;

function Login() {
  const [form] = Form.useForm();
  const [values, setValues] = useState({ salesId: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(values);
    form.resetFields();
    setValues({ salesId: "", password: "" });
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Layout>
        <Sider>
          <Navbar />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              fontSize: "22px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Login
          </Header>
          <Content style={{ margin: "26px 16px", overflow: "auto" }}>
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                fontSize: "25px",
              }}
            >
              <Card>
                <Form
                  layout="vertical"
                  onFinish={handleSubmit}
                  form={form}
                  variant="outlined"
                >
                  <Form.Item
                    label="Sales ID"
                    name="salesId"
                    rules={[{ required: true, message: "Sales ID required" }]}
                  >
                    <Input
                      onChange={(e) => handleChange("salesId", e.target.value)}
                      value={values.salesId}
                      style={{ width: "40%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Password  required" }]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      onChange={(e) => handleChange("password", e.target.value)}
                      value={values.password}
                      style={{ width: "40%" }}
                    />
                  </Form.Item>
                  <Form.Item style={{ textAlign: "left", marginTop: 20 }}>
                    <Button type="primary" htmlType="submit">
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Login;
