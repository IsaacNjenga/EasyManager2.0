import React, { useState } from "react";
import { Table, Button, Image, Tag, Popconfirm, message, Divider } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
//import { SalesData } from "../../assets/data/salesData";
import SalesModal from "../../components/salesModal";
import { format } from "date-fns";
import Search from "../../components/search";
import { Link } from "react-router-dom";
import useSales from "../../assets/hooks/saleHook";
import Loader from "../../components/loader";
import Swal from "sweetalert2";
import axios from "axios";
function SalesContent() {
  const { salesData, salesLoading, refresh } = useSales();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const totalAmount = salesData
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const totalCommission = salesData
    .reduce((acc, sale) => acc + sale.commission, 0)
    .toLocaleString();

  const groupedSalesByDate = salesData.reduce((acc, sale) => {
    const date = format(new Date(sale.datesold), "yyyy-MM-dd");
    acc[date] = acc[date] || [];
    acc[date].push(sale);
    return acc;
  }, {});

  const totalAmountByDate = Object.keys(groupedSalesByDate).reduce(
    (acc, date) => {
      const totalForDate = groupedSalesByDate[date].reduce(
        (total, sale) => total + sale.total,
        0
      );
      acc[date] = totalForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const totalCommissionByDate = Object.keys(groupedSalesByDate).reduce(
    (acc, date) => {
      const totalCommissionForDate = groupedSalesByDate[date].reduce(
        (commission, sale) => commission + sale.commission,
        0
      );
      acc[date] = totalCommissionForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const groupedSalesByDateSorted = Object.keys(groupedSalesByDate).sort(
    (a, b) => new Date(b) - new Date(a)
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
          alt="N/a"
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) =>
        `KSh. ${Number(text || 0)
          .toFixed(2)
          .toLocaleString()}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) =>
        `KSh. ${Number(text || 0)
          .toFixed(2)
          .toLocaleString()}`,
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (text) =>
        `KSh. ${Number(text || 0)
          .toFixed(2)
          .toLocaleString()}`,
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
            <Link to={`/update-sale/${record._id}`}>
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
      await axios.delete(`delete-sale?id=${id}`, {
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
    message.error("Cancelled");
    setOpenDelete(null);
  };

  return (
    <>
      {salesLoading && <Loader />}
      <Search
        onSearchChange={(value) => setSearchValue(value)}
        columns={columns}
        dataSource={salesData}
      />
      <div style={{ padding: "0px" }}>
        {searchValue === "" && (
          <>
            <h2>Sales</h2>{" "}
            <Button
              color="green"
              variant="solid"
              style={{ marginBottom: "15px" }}
            >
              <Link to="/add-sale">Add new item</Link>
            </Button>
            {groupedSalesByDateSorted.map((date) => (
              <div key={date} style={{ marginBottom: "30px" }}>
                <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
                  <h3
                    style={{
                      textAlign: "center",
                      color: "#00152a",
                      marginBottom: "15px",
                      marginTop: "10px",
                    }}
                  >
                    {format(new Date(date), "PPPP")}{" "}
                  </h3>
                </Divider>

                <Table
                  columns={columns}
                  dataSource={groupedSalesByDate[date]}
                  pagination={false}
                  rowKey="_id"
                  loading={salesLoading}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={5}
                      ></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <strong style={{ color: "green" }}>Total</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <Tag
                          color="green"
                          style={{
                            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
                          }}
                        >
                          <strong style={{ color: "green" }}>
                            KSh. {totalAmountByDate[date]}
                          </strong>
                        </Tag>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <Tag
                          color="red"
                          style={{
                            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
                          }}
                        >
                          <strong style={{ color: "red" }}>
                            KSh. {totalCommissionByDate[date]}
                          </strong>
                        </Tag>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>
            ))}{" "}
            <h3 style={{ color: "green" }}>
              Overall Total Sales: KSh. {totalAmount}
            </h3>
            <h3 style={{ color: "red" }}>
              Overall Total Commission: KSh. {totalCommission}
            </h3>
          </>
        )}

        <SalesModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          modalContent={modalContent}
          loading={loading}
        />
      </div>
    </>
  );
}

export default SalesContent;
