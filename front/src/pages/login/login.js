import { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import ChangePassword from "./changePassword";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Login() {
  const navigate=useNavigate()
  const [form] = Form.useForm();
  const [values, setValues] = useState({ number: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [open, setOpen] = useState(null);
  const openNotification = useNotification();

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
        openNotification("success", "Login successful", "Success!");
        login(user, token);
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
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong!",
        });
      }
    } finally {
      form.resetFields();
      setValues({ number: "", password: "" });
      setLoading(false);
    }
  };

  const cardStyle = {
    maxHeight: "95vh",
    height: "100%",
    borderRadius: 0,
    background: "linear-gradient(to left, rgba(0,0,0,0.26), rgba(0,0,0,0.2))",
    border: "none",
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: `url(${"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=900"}) no-repeat center center/cover`,
        }}
      >
        <div
          style={{
            position: "absolute",
            padding: 28,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: "10px 0",
            border: "none",
          }}
        >
          <Card
            style={{
              margin: 0,
              border: "none",
              background: 0,
              borderRadius: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 0,
                margin: 0,
                border: "none",
                background: 0,
                borderRadius: 20,
              }}
            >
              {" "}
              <div
                style={{
                  background: `url(${"https://images.unsplash.com/photo-1633975846872-2bed7fd995f9?w=900"}) no-repeat center center/cover`,
                  width: 400,
                  height: 500,
                  border: "none",
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                }}
              ></div>
              <div
                style={{
                  background:
                    "linear-gradient(to right, #011b22 0%, #18839b 100%)",
                  width: 500,
                  height: 500,
                  border: "none",
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                }}
              >
                <Card style={{ ...cardStyle, width: "auto" }}>
                  <Divider variant="solid" style={{ borderColor: "#fff" }}>
                    <Title
                      level={1}
                      style={{
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      EasyManager
                    </Title>
                  </Divider>
                  <Form layout="vertical" onFinish={handleSubmit} form={form}>
                    <Form.Item
                      label={
                        <span style={{ color: "#fff", fontSize: 20 }}>
                          Sales ID
                        </span>
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
                        <span style={{ color: "#fff", fontSize: 20 }}>
                          Password
                        </span>
                      }
                      name="password"
                      rules={[{ required: true, message: "Password required" }]}
                    >
                      <Input.Password
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
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
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Login;
