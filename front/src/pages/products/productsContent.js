import React, { useState } from "react";
import { Table, Button, Image, Tag, Popconfirm, message } from "antd";
import { ProductData } from "../../assets/data/productsData";
import ProductModal from "../../components/productModal";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Search from "../../components/search";

function ProductsContent() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const groupedProductsByCode = ProductData.reduce((acc, product) => {
    const code = product.code;

    if (!acc[code]) {
      acc[code] = { total_quantity: 0, products: [] };
    }
    acc[code].total_quantity += product.quantity;
    acc[code].products.push(product);

    return acc;
  }, {});

  const updatedProductData = ProductData.map((product) => ({
    ...product,
    total_quantity: groupedProductsByCode[product.code].total_quantity,
  }));

  const columns = [
    {
      title: "No.",
      dataIndex: "number",
      key: "number",
      sorter: (a, b) => a.number - b.number,
      defaultSortOrder: "descend",
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
      sorter: (a, b) => a.description.length - b.description.length,
      defaultSortOrder: "descend",
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
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      filters: [
        {
          text: "NGARA",
          value: "NGARA",
        },
        {
          text: "RONGAI",
          value: "RONGAI",
        },
      ],
      onFilter: (value, record) => record.location.indexOf(value) === 0,
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
      {" "}
      <Search
        onSearchChange={(value) => setSearchValue(value)}
        columns={columns}
        dataSource={updatedProductData}
      />
      <div style={{ padding: "0" }}>
        {searchValue === "" && (
          <>
            <h2>Products</h2>
            <Table
              columns={columns}
              dataSource={updatedProductData}
              pagination={true}
            />
          </>
        )}
        <ProductModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          modalContent={modalContent}
          loading={loading}
        />
      </div>
    </>
  );
}

export default ProductsContent;
