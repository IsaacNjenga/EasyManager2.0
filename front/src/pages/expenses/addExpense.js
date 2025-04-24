import { Button, Card, DatePicker, Form, Input, InputNumber } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import Swal from "sweetalert2";
import Select from "react-select";
import axios from "axios";

function AddExpense() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    //number: "",
    cost: "",
    description: "",
    category: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const onDateChange = (date) => {
    if (date) {
      const localDate = new Date(
        date.$d.getTime() - date.$d.getTimezoneOffset() * 60000
      );
      const selectedDate = localDate.toISOString();
      setValues((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const expenseData = { ...values, category: values.category.value };
      const token = localStorage.getItem("token");
      const res = await axios.post("add-expense", expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        Swal.fire({ icon: "success", title: "Expense Saved!" });
        form.resetFields();
        setValues({
          //number: "",
          cost: "",
          description: "",
          category: "",
          date: "",
        });
        navigate("/expenses");
      }
    } catch (error) {
      Swal.fire(
        "warning",
        "Expense could not be saved",
        "Kindly refresh and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const setClear = () => {
    form.resetFields();
    setValues({
      //number: "",
      cost: "",
      description: "",
      category: "",
      date: "",
    });
  };
  const categoryItems = [
    { label: "Operating Expenses", value: "Operating Expenses" },
    { label: "Salaries", value: "Salaries" },
    { label: "Repairs & Maintenance", value: "Repairs & Maintenance" },
    { label: "Meal Expenses", value: "Meal Expenses" },
    { label: "Utilities", value: "Utilities" },
    { label: "Miscellaneous", value: "Miscellaneous" },
    { label: "Inventory Expenses", value: "Inventory Expenses" },
  ];

  return (
    <>
      {loading && <Loader />}{" "}
      <div
        style={{
          padding: "10px 15px",
          background: "linear-gradient(to left, #2c1469 0%, #f8393b 100%)",
          height: "100vh",
        }}
      >
        <Button
          type="primary"
          style={{ margin: "20px auto", backgroundColor: "red" }}
        >
          <Link to="/expenses">Back to Expenses</Link>
        </Button>
        <Card
          title="Add New Expense"
          style={{ maxWidth: 1100, margin: "20px auto", padding: "20px" }}
        >
          <Form onFinish={handleSubmit} form={form} layout="vertical">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
                {" "}
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Date is required" }]}
                >
                  <DatePicker
                    needConfirm
                    style={{ width: "75%" }}
                    onChange={onDateChange}
                  />
                </Form.Item>
                {/* <Form.Item
                label="Expense Number"
                name="number"
                rules={[{ required: true, message: "No is required" }]}
              >
                <Input
                  onChange={(e) => handleChange("number", e.target.value)}
                  value={values.number}
                  style={{ width: "75%" }}
                />
              </Form.Item>{" "} */}
                <Form.Item
                  label="Expense Description"
                  name="description"
                  rules={[
                    { required: true, message: "Description is required" },
                  ]}
                >
                  <Input
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    value={values.description}
                    style={{ width: "75%" }}
                  />
                </Form.Item>{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <Form.Item
                  label="Expense Amount"
                  name="cost"
                  rules={[{ required: true, message: "Cost is required" }]}
                >
                  <InputNumber
                    onChange={(value) => handleChange("cost", value)}
                    value={values.cost}
                    style={{ width: "75%" }}
                    prefix="KSh."
                  />
                </Form.Item>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: "Category is required" }]}
                  style={{ width: "75%" }}
                >
                  <Select
                    name="category"
                    onChange={(value) => handleChange("category", value)}
                    value={values.category}
                    options={categoryItems.map((item) => ({
                      label: `${item.label}`,
                      value: item.label,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <Button
                htmlType="submit"
                type="primary"
                style={{ backgroundColor: "green" }}
              >
                Submit
              </Button>
              <Button
                onClick={setClear}
                type="primary"
                style={{ backgroundColor: "red" }}
              >
                Clear All
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default AddExpense;
