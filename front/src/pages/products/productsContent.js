import React, { useEffect, useState } from "react";
import { Table, Button, Image, Tag, Popconfirm, message, Carousel } from "antd";
//import { ProductData } from "../../assets/data/productsData";
import useProducts from "../../assets/hooks/productHook";
import ProductModal from "../../components/productModal";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Search from "../../components/search";
import { Link } from "react-router-dom";
//import Loader from "../../components/loader";
import axios from "axios";
import Swal from "sweetalert2";

function ProductsContent() {
  const { products, productsLoading, refresh } = useProducts();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const groupedProductsByCode = products.reduce((acc, product) => {
    const code = product.code;

    if (!acc[code]) {
      acc[code] = { total_quantity: 0, products: [] };
    }
    acc[code].total_quantity += product.quantity;
    acc[code].products.push(product);

    return acc;
  }, {});

  const updatedProductData = products.map((product) => ({
    ...product,
    total_quantity: groupedProductsByCode[product.code].total_quantity,
  }));

  const columns = [
    {
      title: "No.",
      dataIndex: "number",
      key: "number",
      width: 60,
      sorter: (a, b) => a.number - b.number,
      defaultSortOrder: "descend",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      ellipsis: true,
      render: (image) => (
        <div style={{ width: "100px", height: "100px", overflow: "hidden" }}>
          <Carousel autoplay autoplaySpeed={2500} fade dotPosition="bottom">
            {image.map((imgSrc, index) => (
              <div key={index}>
                <Image
                  src={imgSrc}
                  alt="N/A"
                  height={100}
                  width={100}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                    margin: "auto",
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
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
                "beige",
                "silver",
                "pink",
                "peach",
                "dark",
                "all",
                "black & green",
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
            <Link to={`/update-product/${record._id}`}>
              <EditOutlined />
            </Link>
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

  const handleDelete = async (id) => {
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`delete-product?id=${id}`, {
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

  return (
    <>
      {/* {productsLoading && <Loader />} */}
      <Search
        onSearchChange={(value) => setSearchValue(value)}
        columns={columns}
        dataSource={updatedProductData}
      />
      <div style={{ padding: "0" }}>
        {searchValue === "" && (
          <>
            <h2>Products</h2>
            <Button
              color="purple"
              variant="solid"
              style={{ marginBottom: "15px" }}
            >
              <Link to="/add-product">Add new item</Link>
            </Button>

            <Table
              columns={columns}
              dataSource={updatedProductData}
              rowKey="_id"
              loading={productsLoading}
              pagination={true}
              tableLayout="fixed"
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
