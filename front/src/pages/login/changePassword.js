import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Card, Form, Input, Popover, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ChangePassword({ setOpen }) {
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(null);
  const [otpVerified, setOtpVerified] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [values, setValues] = useState({
    otp: "",
    number: "",
    newPassword: "",
    email: "",
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const getOtp = async () => {
    setOtpLoading(true);
    try {
      const emailBody = { to: values.email };
      const res = await axios.post("otp-request", emailBody);
      if (res.data.success) {
        setOtpSent(true);
        setTimeLeft(120);
        Swal.fire("Success", "OTP sent to your email", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("verify-otp", {
        email: values.email,
        otp: values.otp,
      });

      if (res.data.success) {
        Swal.fire(
          "Verified",
          "OTP verified, you can set a new password",
          "success"
        );
        setOtpVerified(true);
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Invalid or expired OTP", "error");
    }
  };

  const [form] = Form.useForm();
  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!otpVerified) {
      return Swal.fire("Error", "Please verify your OTP first", "error");
    }
    setLoading(true);
    try {
      await axios.post("password-change", {
        number: values.number,
        newPassword: values.newPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Password Successfully Changed!",
        text: "Proceed to Login",
      });
      setOpen(null);
      form.resetFields();
      setValues({ otp: "", number: "", newPassword: "", email: "" });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Password Change Failed!",
        text: "Password could not be changed",
      });
    } finally {
      setLoading(false);
    }
  };

  const setClear = () => {
    form.resetFields();
    setValues({ otp: "", number: "", newPassword: "", email: "" });
  };

  return (
    <>
      <Card title="Changing password">
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          {" "}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: "Email required",
              },
            ]}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Enter Email Address"
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Popover title="Enter your email address to get your OTP">
                <Button
                  onClick={getOtp}
                  disabled={values.otp}
                  loading={otpLoading}
                >
                  {" "}
                  {timeLeft > 0 ? (
                    <span>
                      {Math.floor(timeLeft / 60)}:{timeLeft % 60}
                    </span>
                  ) : (
                    "Get OTP"
                  )}
                </Button>
              </Popover>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="Enter OTP"
            name="otp"
            rules={[
              {
                required: otpVerified ? false : true,
                message: "OTP required",
              },
            ]}
          >
            <Input.OTP
              //formatter={(str) => str.toUpperCase()}
              disabled={otpSent ? false : true}
              onChange={(value) => handleChange("otp", value)}
            />{" "}
            <Button type="primary" onClick={verifyOtp} disabled={!values.otp}>
              Verify OTP
            </Button>{" "}
          </Form.Item>{" "}
          {timeLeft > 0 && (
            <span style={{ color: "red" }}>
              OTP will expire in {Math.floor(timeLeft / 60)}:{timeLeft % 60}
            </span>
          )}
          <Form.Item
            label="Sales ID"
            name="number"
            rules={[
              {
                required: true,
                message: "Sales ID required",
              },
            ]}
          >
            <Input
              placeholder="Enter Sales ID"
              onChange={(e) => handleChange("number", e.target.value)}
              disabled={otpVerified ? false : true}
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "New Password required",
              },
            ]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Enter new password"
              onChange={(e) => handleChange("newPassword", e.target.value)}
              disabled={otpVerified ? false : true}
            />
          </Form.Item>
          <Form.Item
            label="Re-enter New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            style={{ marginTop: "20px" }}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Re-enter your password"
              disabled={otpVerified ? false : true}
            />
          </Form.Item>
          <div style={{ display: "flex", gap: "20px", margin: "auto" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "30%",
                background: "purple",
                height: 45,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Change Password
            </Button>
            <Button
              type="primary"
              onClick={setClear}
              style={{
                width: "30%",
                height: 45,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Clear
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
}

export default ChangePassword;
