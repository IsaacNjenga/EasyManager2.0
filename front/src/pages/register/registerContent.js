import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input } from "antd";
import React, { useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import Loader from "../../components/loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    number: "",
    role: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [form] = Form.useForm();
  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const salespersonData = {
        firstname: values.firstname,
        lastname: values.lastname,
        number: values.number,
        username: values.name,
      };
      const userData = {
        name: values.name,
        number: values.number,
        role: values.role ? values.role.value : "",
        password: values.password,
      };
      console.log("salepersonData:", salespersonData);
      console.log("userData:", userData);

      const token = localStorage.getItem("token");
      await axios.post("register", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.post(
        "add-salesperson",
        {
          firstname: values.firstname,
          lastname: values.lastname,
          number: values.number,
          username: values.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({ icon: "success", title: "User created", text: "Success!" });
      form.resetFields("");
      setValues({
        name: "",
        number: "",
        role: "",
        password: "",
        firstname: "",
        lastname: "",
      });
      navigate("/salespersons");
    } catch (error) {
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
      setLoading(false);
    }
  };

  const setClear = () => {
    form.resetFields("");
    setValues({
      name: "",
      number: "",
      role: "",
      password: "",
      firstname: "",
      lastname: "",
    });
  };

  const roleItems = [
    { key: 1, label: "Admin", value: "admin" },
    { key: 2, label: "Salesperson", value: "salesperson" },
  ];

  const cardStyle = {
    width: 800,
    padding: 30,
    borderRadius: 10,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
    margin: "40px auto",
    color: "#fff",
  };

  return (
    <>
      {loading && <Loader />}

      <Form onFinish={handleSubmit} layout="vertical" form={form}>
        <Card style={cardStyle}>
          <Divider variant="solid" style={{ borderColor: "#dbdbdb" }}>
            <h2>User Registration</h2>
          </Divider>
          <div
            style={{
              display: "flex",
              gap: "25px",
            }}
          >
            <Form.Item
              label="Username"
              name="name"
              rules={[{ required: true, message: "Username required" }]}
              style={{ marginTop: "20px", width: "45%" }}
            >
              <Input
                onChange={(e) => handleChange("name", e.target.value)}
                value={values.name}
                placeholder="Enter username"
              />
            </Form.Item>
            <Form.Item
              label="Sales ID"
              name="number"
              rules={[{ required: true, message: "Sales ID required" }]}
              style={{ marginTop: "20px", width: "45%" }}
            >
              <Input
                onChange={(e) => handleChange("number", e.target.value)}
                value={values.number}
                placeholder="Enter sales ID"
              />
            </Form.Item>
          </div>
          <div
            style={{
              display: "flex",
              gap: "25px",
              marginTop: "10px",
            }}
          >
            <Form.Item
              label="First name"
              name="firstname"
              rules={[{ required: true, message: "First Name required" }]}
              style={{ marginTop: "20px", width: "45%" }}
            >
              <Input
                onChange={(e) => handleChange("firstname", e.target.value)}
                value={values.firstname}
                placeholder="Enter first name"
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastname"
              style={{ marginTop: "20px", width: "45%" }}
            >
              <Input
                onChange={(e) => handleChange("lastname", e.target.value)}
                value={values.lastname}
                placeholder="Enter last name"
                rules={[{ required: true, message: "First Name required" }]}
              />
            </Form.Item>
          </div>{" "}
          <Divider variant="solid" style={{ borderColor: "#dbdbdb" }}></Divider>
          <Form.Item
            label="User Role"
            style={{ marginTop: "20px", width: "45%" }}
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select
              name="saleperson"
              onChange={(value) => handleChange("role", value)}
              value={values.role}
              options={roleItems.map((role) => ({
                label: role.label,
                value: role.value,
              }))}
            />
          </Form.Item>
          <div style={{ display: "flex", gap: "25px" }}>
            <Form.Item
              label="User Password"
              name="password"
              rules={[{ required: true, message: "Password required" }]}
              style={{ marginTop: "20px", width: "45%" }}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                onChange={(e) => handleChange("password", e.target.value)}
                value={values.password}
                placeholder="Enter a strong password"
              />
            </Form.Item>{" "}
            <Form.Item
              label="Re-enter Password"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
              style={{ marginTop: "20px", width: "45%" }}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                placeholder="Re-enter your password"
              />
            </Form.Item>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{ background: "green" }}
            >
              Create User
            </Button>
            <Button
              onClick={setClear}
              type="primary"
              style={{ background: "red" }}
            >
              Clear All Fields
            </Button>
          </div>
        </Card>
      </Form>
    </>
  );
}

export default RegisterContent;
