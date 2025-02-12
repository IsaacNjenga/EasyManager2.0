import React, { useState, useEffect } from "react";
import { Form, InputNumber, Table, Button, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { SalespersonsData } from "../../assets/data/salespersonsData";
import AddSale from "./addSale";
//import AddSale from "./addSale";

const EditableTable = ({ saleItems }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [showSale, setShowSale] = useState(false);
  const [salesName, setSalesName] = useState(
    SalespersonsData.map((saleName) => saleName.firstname)
  );

  // Update data when saleItems changes
  useEffect(() => {
    if (saleItems.length > 0) {
      const originData = saleItems.map((product, i) => ({
        key: i.toString(),
        image: product.image,
        item: product.description,
        Colour: product.colour,
        Code: product.code,
        Quantity: 0,
        Price: 0,
        Salesperson: "",
      }));
      setData(originData);
    }
  }, [saleItems]); // Runs when saleItems updates

  //console.log("Updated Data:", data);

  // Handle input change for Quantity & Price
  const handleInputChange = (key, dataIndex, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [dataIndex]: value } : item
      )
    );
  };

  // Delete row from table
  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const EditableCell = ({ dataIndex, record, ...restProps }) => {
    const [value, setValue] = useState(record ? record[dataIndex] ?? 0 : 0);

    const handleChange = (newValue) => {
      setValue(newValue);
      record[dataIndex] = newValue;
      console.log(newValue);
      setData((prevData) => [...prevData]);
    };

    return (
      <td {...restProps}>
        {dataIndex === "Price" || dataIndex === "Quantity" ? (
          <Form.Item
            name={[record.key, dataIndex]}
            rules={[{ required: true, message: `${dataIndex} is required` }]}
            style={{ margin: 0 }}
          >
            <InputNumber
              min={1}
              value={value}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ) : (
          restProps.children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: "25%",
      render: (image) => (
        <Image
          src={image}
          alt="img"
          style={{ width: 150, height: 150, borderRadius: "8px" }}
        />
      ),
    },
    { title: "Description", dataIndex: "item", width: "25%" },
    { title: "Colour", dataIndex: "Colour", width: "15%" },
    { title: "Code", dataIndex: "Code", width: "15%" },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      width: "5%",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "Price",
      width: "15%",
      editable: true,
    },
    {
      title: "Total",
      dataIndex: "Total",
      width: "15%",
      render: (_, record) => record.Price * record.Quantity || 0,
    },
    {
      title: "Commission",
      dataIndex: "Commission",
      width: "15%",
      render: (_, record) =>
        record.Price * record.Quantity >= 10000
          ? (0.01 * record.Price * record.Quantity).toFixed(2)
          : 0,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Button
            danger
            onClick={() => handleDelete(record.key)}
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />{" "}
        <label>Select Salesperson:</label>
        <select
          onChange={(e) =>
            setData((prevData) =>
              prevData.map((item) => ({ ...item, Salesperson: e.target.value }))
            )
          }
        >
          <option value="" disabled>
            Select
          </option>
          {salesName.map((saleName) => (
            <option key={saleName} value={saleName}>
              {saleName}
            </option>
          ))}
        </select>
        <div>
          <button onClick={() => setShowSale(true)}>Enter Sale</button>
          {showSale && <AddSale saleData={data} />}
        </div>
      </Form>
    </>
  );
};

export default EditableTable;
