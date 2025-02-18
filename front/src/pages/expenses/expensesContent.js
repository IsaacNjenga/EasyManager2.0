import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Popconfirm,
  message,
  Tabs,
  DatePicker,
} from "antd";
//import { ExpensesData } from "../../assets/data/expensesData";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import useExpenses from "../../assets/hooks/expensesHook";
import { getTotalExpenses } from "./expenseCalculator";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function ExpensesContent() {
  const { expenses, expensesLoading, refresh } = useExpenses();
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const today = new Date().toISOString();
  const [day, setDay] = useState(null);
  const [date, setDate] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const onDateChange = (date) => {
    if (date) {
      const selectedDate = format(new Date(date.$d), "yyyy-MM-dd");
      setDate(new Date(selectedDate));
      setDay(selectedDate);
    }
  };

  useEffect(() => {
    const filterByDateRange = (data, dateKey, days, specificDate = null) => {
      let startDate, endDate;

      if (specificDate) {
        startDate = new Date(specificDate);
        endDate = new Date(specificDate);
      } else {
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return data.filter((item) => {
        const itemDate = new Date(item[dateKey]);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate;
      });
    };

    let filteredExpensesData = [];

    filteredExpensesData = filterByDateRange(expenses, "date", 0, date);

    setFilteredExpenses(filteredExpensesData);
  }, [expenses, date]);

  let expenseToday = expenses.filter(
    (expense) =>
      format(new Date(expense.date), "yyyy-MM-dd") ===
      format(new Date(today), "yyyy-MM-dd")
  );
  let randomDayExpenses = filteredExpenses;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date) return "N/A"; // Handle missing or undefined date
        const parsedDate = new Date(date);
        return isNaN(parsedDate)
          ? "Invalid Date"
          : format(parsedDate, "yyyy-MM-dd");
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (text) => (
        <Tag
          color="#fc0100"
          style={{
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          <strong>KSh. {text?.toLocaleString()}</strong>
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="link" title="Edit this item">
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure?"
            description="This action cannot be undone!"
            open={openDelete}
            onConfirm={() => handleDelete(record._id)}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleDeleteCancel}
          >
            <Button
              type="link"
              danger
              title="Delete this item"
              onClick={() => showDeleteConfirm(record)}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const showDeleteConfirm = (record) => {
    setOpenDelete(record.key); // Store the clicked record's key
  };

  const handleDelete = async (id) => {
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`delete-expense?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Deleted",
      });
      refresh();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Product could not be deleted",
        text: "Refresh and try again",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    message.error("Canceled");
    setOpenDelete(null);
  };

  const ExpensesToday = () => {
    const expensesData = getTotalExpenses({
      expenses: day ? randomDayExpenses : expenseToday,
    });

    return (
      <>
        <h3>
          {day
            ? `Expenses for ${format(new Date(day), "EEEE, do MMMM yyyy")}`
            : `Expenses ${format(new Date(), "EEEE, do MMMM yyyy")}`}
        </h3>
        <Tag
          color="#fc0100"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.2)",
            margin: "20px auto",
          }}
        >
          Total: KSh. {expensesData.totalExpenditure}
        </Tag>
        <Table
          columns={columns}
          dataSource={day ? randomDayExpenses : expenseToday}
          rowKey="_id"
          pagination={true}
          loading={expensesLoading}
        />
      </>
    );
  };

  const AllExpenses = () => {
    const expensesData = getTotalExpenses({ expenses: expenses });
    return (
      <>
        <h3>All Expenses</h3>
        <div>
          <Tag
            color="#fc0100"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.2)",
              margin: "20px auto",
            }}
          >
            Total: KSh. {expensesData.totalExpenditure}
          </Tag>
        </div>
        <Table
          columns={columns}
          dataSource={expenses}
          rowKey="_id"
          pagination={true}
          loading={expensesLoading}
        />
      </>
    );
  };

  const items = [
    {
      label: <strong>Expenses {day ? `for ${day}` : `Today`}</strong>,
      key: "1",
      content: () => <ExpensesToday />,
    },
    {
      label: <strong>All Expenses</strong>,
      key: "2",
      content: () => <AllExpenses />,
    },
  ];

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Expenses</h2>
        <Button
          type="primary"
          style={{ margin: "20px auto", backgroundColor: "red" }}
        >
          <Link to="/add-expense">Add New Expense</Link>
        </Button>
        <br />
        <DatePicker
          onChange={onDateChange}
          needConfirm
          style={{ width: "30%" }}
        />
        {day ? (
          <p>Selected Date: {format(new Date(day), "EEEE, do MMMM yyyy")}</p>
        ) : null}

        <Tabs
          defaultActiveKey="1"
          items={items.map((item) => ({
            key: item.key,
            label: item.label,
            children: item.content(),
          }))}
        />
      </div>
    </>
  );
}

export default ExpensesContent;
