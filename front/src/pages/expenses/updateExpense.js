import { Button, Card, DatePicker, Form, Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import Loader from "../../components/loader";
import Swal from "sweetalert2";
import Select from "react-select";
import axios from "axios";
import dayjs from "dayjs";

function UpdateExpense({ id, setOpen, refresh }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    cost: "",
    description: "",
    category: "",
    date: "",
  });

  const fetchExpense = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`expense?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const fetchedExpense = res.data.expense;
        setValues((prevValue) => ({
          ...prevValue,
          ...fetchedExpense,
          date: fetchedExpense.date ? dayjs(fetchedExpense.date) : null,
          category:
            categoryItems.find(
              (item) => item.value === fetchedExpense.category
            ) || null,
        }));
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Expense could not be fetched",
        text: "Kindly refresh and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExpense();
    }
  }, [id]);

  useEffect(() => {
    if (values) {
      form.setFieldsValue({
        ...values,
        date: values.date ? dayjs(values.date) : null,
        category: values.category ? values.category : null,
      });
    }
  }, [values]);

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
      console.log(expenseData);
      const res = await axios.put(`update-expense?id=${id}`, expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        Swal.fire({ icon: "success", title: "Expense updated!" });
        form.resetFields();
        setValues({
          cost: "",
          description: "",
          category: "",
          date: "",
        });
        setOpen(false);
        refresh();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Expense could not be updated",
        text: "Kindly refresh and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const setClear = () => {
    form.resetFields();
    setValues({
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
      {loading && <Loader />}
      <div
        style={{
          padding: "10px 15px",
          background: "linear-gradient(to left, #2c1469 0%, #f8393b 100%)",
          height: "100vh",
        }}
      >
        <Card
          title="Editing Expense"
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
                    value={values.date ? dayjs(values.date) : null}
                  />
                </Form.Item>
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

export default UpdateExpense;
