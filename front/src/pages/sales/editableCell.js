import React, { useState, useEffect } from "react";
import { Form, InputNumber, Table, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const EditableTable = ({ saleItems }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

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

  console.log("Updated Data:", data);

  // Handle input change for Quantity & Price
  const handleInputChange = (value, key, field) => {
    const newData = data.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setData(newData);
  };

  // Delete row from table
  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const EditableCell = ({ dataIndex, record, onChange, ...restProps }) => {
    const inputNode = (
      <InputNumber
        min={0}
        onChange={(value) => onChange(value, record.key, dataIndex)}
      />
    );

    return (
      <td {...restProps}>
        {dataIndex === "Price" || dataIndex === "Quantity"
          ? inputNode
          : restProps.children}
      </td>
    );
  };

  const columns = [
    { title: "Description", dataIndex: "item", width: "25%" },
    { title: "Colour", dataIndex: "Colour", width: "15%" },
    { title: "Code", dataIndex: "Code", width: "15%" },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      width: "15%",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "Price",
      width: "15%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleDelete(record.key)}
          icon={<DeleteOutlined />}
        />
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
        onChange: handleInputChange,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{ body: { cell: EditableCell } }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;
