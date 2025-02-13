import React, { useState } from "react";
import { Table, Button, Tag, Popconfirm, message } from "antd";
//import { ExpensesData } from "../../assets/data/expensesData";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import useExpenses from "../../assets/hooks/expensesHook";

function ExpensesContent() {
  const { expenses, expensesLoading } = useExpenses();
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const [error, setError] = useState("");

  const columns = [
    { title: "No.", dataIndex: "number", key: "number" },
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
            onConfirm={() => handleDelete(record)}
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

  const handleDelete = (record) => {
    setConfirmLoading(true);
    //message.success('Deleted!')
    setTimeout(() => {
      setConfirmLoading(false);
      setOpenDelete(null);
    }, 2000);
  };

  const handleDeleteCancel = () => {
    message.error("Canceled");
    setOpenDelete(null);
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Expenses</h2>
        <Table
          columns={columns}
          dataSource={expenses}
          loading={expensesLoading}
        />
      </div>
    </>
  );
}

export default ExpensesContent;
