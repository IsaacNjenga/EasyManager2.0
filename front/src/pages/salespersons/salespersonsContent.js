import React, { useState } from "react";
import { Table, Button, Tag, Popconfirm, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useSales from "../../assets/hooks/saleHook";
import { Link } from "react-router-dom";
import UseSalesperson from "../../assets/hooks/salespersonHook";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../components/loader";

function SalespersonsContent() {
  const { salesData, salesLoading } = useSales();
  const { salespersonData, salespersonLoading, refresh } = UseSalesperson();
  const [openDelete, setOpenDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Preprocess Sales Data: Compute Sales Per Salesperson
  const salesBySalesperson = salesData.reduce((acc, sale) => {
    const salepersonName = sale.saleperson; // Match using 'saleperson name'

    if (!acc[salepersonName]) {
      acc[salepersonName] = { totalSales: 0, amountSold: 0 };
    }
    acc[salepersonName].totalSales += 1; // Number of sales
    acc[salepersonName].amountSold += sale.total; // Total amount sold
    return acc;
  }, {});

  //  Enhance SalespersonsData with sales info
  const enhancedSalespersonsData = salespersonData.map((person) => ({
    ...person,
    salesMade: salesBySalesperson[person.firstname]?.totalSales || 0,
    amountSold:
      salesBySalesperson[person.firstname]?.amountSold.toLocaleString() || "0", // Format currency
  }));

  const totalSalesMade = enhancedSalespersonsData
    .reduce((acc, sale) => acc + sale.salesMade, 0)
    .toLocaleString();

  const totalAmountSold = enhancedSalespersonsData
    .reduce((acc, sale) => {
      const amount = Number(sale.amountSold.replace(/,/g, ""));
      return !isNaN(amount) ? acc + amount : acc;
    }, 0)
    .toLocaleString();

  //  Define Table Columns
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Total Sales Made",
      dataIndex: "salesMade",
      key: "salesMade",
    },
    {
      title: "Total Amount Sold",
      dataIndex: "amountSold",
      key: "amountSold",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="link" title="Edit this item">
            <Link to={`/update-salesperson/${record._id}`}>
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

  const showDeleteConfirm = (record) => {
    setOpenDelete(record.key); // Store the clicked record's key
  };

  const handleDelete = async (id) => {
    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`delete-salesperson?id=${id}`, {
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
      {salespersonLoading && <Loader />}
      <div style={{ padding: "20px" }}>
        <h2>Salespersons</h2>
        <Table
          columns={columns}
          dataSource={enhancedSalespersonsData}
          rowKey="number"
          loading={salesLoading}
          //rowKey="_id"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={1} colSpan={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong style={{ color: "green" }}>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <Tag
                  color="green"
                  style={{
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  <strong style={{ color: "green" }}>{totalSalesMade}</strong>
                </Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Tag
                  color="#008001"
                  style={{
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
                  }}
                >
                  <strong>KSh. {totalAmountSold}</strong>
                </Tag>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </>
  );
}

export default SalespersonsContent;
