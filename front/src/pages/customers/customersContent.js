import React, { useState } from "react";
import { Table, Button, Image, Tag, Popconfirm, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { CustomerData } from "../../assets/data/customerData";
import Search from "../../components/search";
import CustomerModal from "../../components/customerModal";
import { SalesData } from "../../assets/data/salesData";
function CustomersContent() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const updatedCustomerData = SalesData.filter(
    (customer) =>
      customer.customerName || customer.customerEmail || customer.customerPhone
  );

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: " Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={image}
          alt="Product"
          style={{ width: 100, height: 100, borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Colour",
      dataIndex: "colour",
      key: "colour",
      render: (colour) =>
        colour.split("-").map((col) => (
          <Tag
            key={col}
            color={col.toLowerCase()}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.2)",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
              color: [
                "white",
                "yellow",
                "lightgray",
                "cream brown",
                "blue",
                "red",
                "green",
                "metalic",
                "coffee",
                "beige",
              ].includes(col.toLowerCase())
                ? "black"
                : "white",
            }}
          >
            {col}
          </Tag>
        )),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `KSh. ${Number(text.toFixed(2)).toLocaleString()}`,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Customer Phone",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Sold By",
      dataIndex: "saleperson",
      key: "saleperson",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            type="link"
            warning="true"
            onClick={() => {
              viewDetails(record);
            }}
            title={"View this item"}
          >
            <EyeOutlined />
          </Button>
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

  const viewDetails = (product) => {
    setOpenModal(true);
    setLoading(true);
    setModalContent(product);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
      <Search
        onSearchChange={(value) => setSearchValue(value)}
        columns={columns}
        dataSource={CustomerData}
      />
      <div style={{ padding: "20px" }}>
        {searchValue === "" && (
          <>
            <h2>Customers</h2>
            <Table
              columns={columns}
              dataSource={updatedCustomerData}
              pagination={true}
            />
          </>
        )}
        <CustomerModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          modalContent={modalContent}
          loading={loading}
        />
      </div>
    </>
  );
}

export default CustomersContent;
