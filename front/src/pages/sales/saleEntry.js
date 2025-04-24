import {
  Card,
  Table,
  InputNumber,
  DatePicker,
  Button,
  Form,
  Image,
  Input,
  Tag,
  Popconfirm,
  message,
  Divider,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Select from "react-select";
import { useState } from "react";

const SaleEntry = ({
  sale,
  setSale,
  saleItems,
  handleRowChange,
  handleEnterSale,
  handleProductSelection,
  removeCurrentRow,
  productOptions,
  salesName,
  handleDateChange,
  filterOption,
  customStyles,
  confirmLoading,
  productsLoading,
}) => {
  const [form] = Form.useForm();
  const [openDelete, setOpenDelete] = useState(null);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (src) => (
        <Image
          src={src}
          width={130}
          height={130}
          style={{ objectFit: "contain", borderRadius: "18px" }}
        />
      ),
    },
    { title: "Item", dataIndex: "description" },
    {
      title: "Colour",
      dataIndex: "colour",
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
              ].includes(col.toLowerCase())
                ? "black"
                : "white",
            }}
          >
            {col}
          </Tag>
        )),
    },
    { title: "Code", dataIndex: "code" },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) =>
            handleRowChange(index, { target: { name: "quantity", value } })
          }
          style={{ width: "85px" }}
          required
        />
      ),
    },
    {
      title: "Price per Item (Ksh.)",
      dataIndex: "price",
      render: (_, record, index) => (
        <InputNumber
          min={1}
          value={record.price}
          formatter={(value) => value.toLocaleString()}
          onChange={(value) =>
            handleRowChange(index, { target: { name: "price", value } })
          }
          style={{ width: "125px" }}
          required
        />
      ),
    },
    {
      title: "Total (Ksh.)",
      dataIndex: "total",
      render: (value) => <Tag color="#4bbe11">{value.toLocaleString()}</Tag>,
    },
    {
      title: "Commission (Ksh.)",
      dataIndex: "commission",
      render: (value) => <Tag color="#fc0100">{value.toLocaleString()}</Tag>,
    },
    {
      title: "Delete",
      render: (_, __, index) => (
        <Popconfirm
          title="Are you sure?"
          description="This action cannot be undone!"
          open={openDelete}
          onConfirm={(e) => removeCurrentRow(index, e)}
          okButtonProps={{ loading: confirmLoading }}
          onCancel={handleDeleteCancel}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(index)}
          />
        </Popconfirm>
      ),
    },
  ];

  const handleDeleteCancel = () => {
    message.error("Canceled");
    setOpenDelete(null);
  };
  const showDeleteConfirm = (record) => {
    setOpenDelete(record.key); // Store the clicked record's key
  };

  const handleSaleChange = (name, value) => {
    setSale((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card
      title="Enter Sale"
      style={{
        maxWidth: 1100,
        margin: "20px auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
        Sale Details
      </Divider>
      <Form variant="outlined" onFinish={handleEnterSale} form={form}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <Form.Item
            label="Receipt Number"
            rules={[{ required: true, message: "Receipt No. is required" }]}
          >
            <Input
              value={sale.number}
              onChange={(e) => setSale({ ...sale, number: e.target.value })}
              name="number"
              required
            />
          </Form.Item>
          <Form.Item
            label="Date"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker onChange={handleDateChange} />
          </Form.Item>
        </div>

        <Form.Item label="Select">
          <Select
            styles={customStyles}
            options={productOptions}
            onChange={handleProductSelection}
            filterOption={filterOption}
            placeholder={
              productsLoading
                ? "Fetching products, please wait..."
                : "Type to search..."
            }
            isSearchable={true}
            isDisabled={productsLoading ? true : false}
          />
        </Form.Item>

        {saleItems.length > 0 && (
          <>
            <Table
              columns={columns}
              dataSource={saleItems}
              pagination={false}
              bordered
              rowKey={(record, index) => index}
              style={{ marginTop: "20px" }}
            />
            <Form.Item
              label="Saleperson"
              style={{ marginTop: "20px" }}
              rules={[{ required: true, message: "Salesperson is required" }]}
            >
              <Select
                name="saleperson"
                onChange={(value) => handleSaleChange("saleperson", value)}
                value={sale.saleperson}
                style={{ width: "50%" }}
                options={salesName.map((saleName) => ({
                  label: `${saleName.firstname} ${
                    saleName.lastname ? saleName.lastname : null
                  }`,
                  value: saleName.firstname,
                }))}
              />
            </Form.Item>
            <Divider variant="dashed" style={{ borderColor: "#7cb305" }}>
              Customer Details
            </Divider>
            <div>
              <Form.Item label="Customer Name" name="customerName">
                <Input
                  style={{ width: "75%" }}
                  value={sale.customerName}
                  onChange={(e) =>
                    handleSaleChange(
                      "customerName",
                      e.target.value.toUpperCase()
                    )
                  }
                />
              </Form.Item>
              <Form.Item label="Customer Phone" name="customerPhone">
                <Input
                  style={{ width: "75%" }}
                  value={sale.customerPhone}
                  onChange={(e) =>
                    handleSaleChange("customerPhone", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Customer Email" name="customerEmail">
                <Input
                  style={{ width: "75%" }}
                  value={sale.customerEmail}
                  onChange={(e) =>
                    handleSaleChange(
                      "customerEmail",
                      e.target.value
                    )
                  }
                />
              </Form.Item>
            </div>
          </>
        )}

        <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
          Enter Sale
        </Button>
      </Form>
    </Card>
  );
};

export default SaleEntry;
