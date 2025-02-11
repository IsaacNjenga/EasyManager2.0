import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ProductData } from "../../assets/data/productsData";
import { SalespersonsData } from "../../assets/data/salespersonsData";
import { Button, DatePicker, Form, Image, InputNumber, Table, Tag } from "antd";
import Swal from "sweetalert2";
import Card from "antd/es/card/Card";
import { DeleteOutlined } from "@ant-design/icons";
import EditableTable from "./editableCell";

function AddSale() {
  const [saleItems, setSaleItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [products, setProducts] = useState(
    Array.isArray(ProductData) ? ProductData : []
  );
  const [salesName, setSalesName] = useState(
    SalespersonsData.map((saleName) => saleName.firstname)
  );
  const [sale, setSale] = useState({
    number: "",
    description: "",
    price: 0,
    quantity: 0,
    total: 0,
    datesold: new Date(),
    saleperson: "",
    commission: 0,
    pnumber: "",
    code: "",
    colour: "",
    image: "",
  });

  const handleProductSelection = (selectedOption) => {
    const selectedProduct = products.find(
      (product) => product.number === selectedOption.value
    );

    if (selectedProduct) {
      setSaleItems((prev) => [
        ...prev,
        {
          quantity: "",
          price: "",
          description: selectedProduct.description,
          colour: selectedProduct.colour,
          code: selectedProduct.code,
          pnumber: selectedProduct.number,
          image: selectedProduct.image,
          total: "",
          commission: "",
          saleperson: "",
        },
      ]);
    }
  };

  const handleRowChange = (index, event) => {
    const { name, value } = event.target;
    const items = [...saleItems];
    items[index][name] = value;

    if (name === "quantity" || name === "price") {
      const price = parseFloat(items[index].price || 0);
      const quantity = parseInt(items[index].quantity || 0);
      items[index].total = calculateTotal(price, quantity);
      items[index].commission = calculateCommission(items[index].total);
    }

    setSaleItems(items);
  };

  const calculateTotal = (price, quantity) => price * quantity;

  const calculateCommission = (total) => (total >= 10000 ? 0.01 * total : 0);

  const removeCurrentRow = (e, index) => {
    e.preventDefault();
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleDateChange = (date) => {
    setSale((prev) => ({
      ...prev,
      datesold: date,
    }));
  };

  const submit = () => {
    try {
      for (let saleGroup of sales) {
        for (let saleItem of saleGroup) {
          const saleData = {
            ...sale,
            number: saleItem.number || sale.number,
            description: saleItem.description || sale.description,
            price: parseFloat(saleItem.price) || sale.price,
            quantity: parseInt(saleItem.quantity) || sale.quantity,
            total: parseFloat(saleItem.total) || sale.total,
            datesold: sale.datesold ? new Date(sale.datesold) : new Date(),
            saleperson: sale.saleperson,
            commission: saleItem.commission || sale.commission,
            pnumber: saleItem.pnumber || sale.pnumber,
            code: saleItem.code || sale.code,
            colour: saleItem.colour || sale.colour,
            image: saleItem.image || saleItem.image,
          };

          console.log("saleData", saleData);
        }
      }
      setSale({
        number: "",
        description: "",
        price: 0,
        quantity: 0,
        total: 0,
        datesold: new Date(),
        saleperson: "",
        commission: 0,
        pnumber: "",
        code: "",
        colour: "",
        image: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnterSale = (e) => {
    e.preventDefault();
    setSales([...sales, saleItems]);
    setSaleItems([]);
    Swal.fire({
      title: "Sale Captured!",
      icon: "success",
      confirmButtonText: "Submit Sale!",
    }).then((result) => {
      if (result.isConfirmed) {
        submit();
      }
    });
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const productOptions = fetching
    ? [
        {
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>
                <p>Fetching items. Please wait...</p>
              </span>
            </div>
          ),
        },
      ]
    : products.map((product) => ({
        value: product.number,
        product,
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{`${product.number} — ${product.description} (${product.code}) | [${product.colour}] - (${product.location})`}</span>
            <img src={product.img} alt="_" style={{ width: "20px" }} />
          </div>
        ),
      }));

  const filterOption = ({ label, value, data }, input) => {
    if (input) {
      const searchTerm = input.toLowerCase();
      return (
        data.product.number.toLowerCase().includes(searchTerm) ||
        data.product.description.toLowerCase().includes(searchTerm) ||
        data.product.code.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  };

  const [data, setData] = useState([]);
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
  }, [saleItems]);
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
  const [form] = Form.useForm();

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

  const columns = [
    {
      title: "Image",
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
      title: "Description",
      dataIndex: "item",
      width: "25%",
    },
    {
      title: "Colour",
      dataIndex: "Colour",
      width: "15%",
    },
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
      title: "Total",
      dataIndex: "Total",
      width: "10%",
      render: (_, record) => record.Price * record.Quantity || 0,
    },
    {
      title: "Commission",
      dataIndex: "Commission",
      width: "10%",
      render: (_, record) =>
        record.Price * record.Quantity >= 10000
          ? 0.01 * record.Price * record.Quantity
          : 0,
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
    <>
      <Card
        title="Enter Sale"
        style={{ maxWidth: 1100, margin: "20px auto", padding: "20px" }}
      >
        <EditableTable saleItems={saleItems} />
        <form className="sale-form">
          <div style={{ textAlign: "center" }}></div>
          <label>Receipt Number:</label>
          <input
            type="text"
            value={sale.number}
            onChange={(e) => setSale({ ...sale, number: e.target.value })}
            name="number"
            required
          />
          <label>Date:</label>
          <DatePicker onChange={handleDateChange} needConfirm />
          <br />
          <br />
          <label>Select The Product:</label>
          <label>
            Product No. — Description (Code) | [Colour] - (Location)
          </label>
          <Select
            styles={customStyles}
            options={productOptions}
            onChange={handleProductSelection}
            filterOption={filterOption}
            placeholder="Type to search..."
            isSearchable={true}
          />

          <p>Use the search bar to add an item</p>
          <br />
          <div className="sale-table">
            {/* <table className="sale-item-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item</th>
                  <th>Colour</th>
                  <th>Code</th>
                  <th>Quantity</th>
                  <th>Price per Item (Ksh.)</th>
                  <th>Total (Ksh.)</th>
                  <th>Commission (Ksh.)</th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Image
                        src={item.image}
                        alt="_"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "7px",
                          padding: "3px",
                        }}
                      />
                    </td>
                    <td>{item.description}</td>
                    <td>{item.colour}</td>
                    <td>{item.code}</td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleRowChange(index, e)}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="price"
                        value={item.price.toLocaleString()}
                        onChange={(e) => handleRowChange(index, e)}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{item.total.toLocaleString()}</td>
                    <td>{item.commission.toLocaleString()}</td>
                    <td>
                      <Button onClick={(e) => removeCurrentRow(index, e)}>
                        <DeleteOutlined />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}{" "}
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
          </div>
          <label>Sold By:</label>

          <select
            name="saleperson"
            onChange={(e) => setSale({ ...sale, saleperson: e.target.value })}
            value={sale.saleperson}
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

          <button onClick={handleEnterSale} className="addbtn">
            Enter Sale
          </button>
        </form>
      </Card>
    </>
  );
}

export default AddSale;
