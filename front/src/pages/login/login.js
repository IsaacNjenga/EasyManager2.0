import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Form,
  Input,
  Layout,
  Space,
  Typography,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ChangePassword from "./changePassword";
const { Content } = Layout;
const { Title } = Typography;

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [values, setValues] = useState({ number: "", password: "" });
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(null);

  const showDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(null);
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { number, password } = values;
    setLoading(true);

    try {
      const response = await axios.post(
        `login`,
        { number, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { success, user, token } = response.data;
      if (success) {
        localStorage.setItem("token", token);
        setUser(user);
        localStorage.setItem("showLoginNotification", "true");
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: "Please enter the correct details",
        });
      }
    } catch (error) {
      console.error("Error during login", error);
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Try refreshing the page",
      });
    } finally {
      form.resetFields();
      setValues({ number: "", password: "" });
      setLoading(false);
    }
  };

  const cardStyle = {
    width: 600,
    padding: 30,
    borderRadius: 10,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.6)",
    background: "linear-gradient(to right, #002a53, #002b55)",
    margin: "40px auto",
    color: "#fff",
  };

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #fc0100, #00152a )",
        }}
      >
        <Content>
          <Card style={cardStyle}>
            <Divider variant="solid" style={{ borderColor: "#fff" }}>
              <Title
                level={1}
                style={{
                  textAlign: "center",
                  marginBottom: 30,
                  color: "white",
                }}
              >
                EasyManager
              </Title>
            </Divider>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
              <Form.Item
                label={
                  <span style={{ color: "#fff", fontSize: 20 }}>Sales ID</span>
                }
                name="number"
                rules={[{ required: true, message: "Sales ID required" }]}
                style={{ color: "#fff" }}
              >
                <Input
                  onChange={(e) => handleChange("number", e.target.value)}
                  value={values.number}
                  placeholder="Enter Sales ID"
                  style={{ height: 40, fontSize: 16 }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ color: "#fff", fontSize: 20 }}>Password</span>
                }
                name="password"
                rules={[{ required: true, message: "Password required" }]}
              >
                <Input.Password
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={(e) => handleChange("password", e.target.value)}
                  value={values.password}
                  placeholder="Enter Password"
                  style={{ height: 40, fontSize: 16 }}
                />
              </Form.Item>

              <p
                style={{ color: "white", cursor: "pointer" }}
                onClick={showDrawer}
              >
                Forgot password?
              </p>
              <Drawer
                title="Change your password"
                width={600}
                onClose={closeDrawer}
                open={open}
                styles={{ body: { paddingBottom: 60 } }}
                extra={
                  <Space>
                    <Button onClick={closeDrawer}>Cancel</Button>
                  </Space>
                }
              >
                <ChangePassword setOpen={setOpen} />
              </Drawer>

              <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: "100%",
                    height: 45,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </>
  );
}

export default Login;
