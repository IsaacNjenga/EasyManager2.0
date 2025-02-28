import React, { useState } from "react";
import Swal from "sweetalert2";
import SaleEntry from "./saleEntry";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../../assets/hooks/productHook";
import axios from "axios";
import Loader from "../../components/loader";
import UseSalesperson from "../../assets/hooks/salespersonHook";

function AddSale() {
  const navigate = useNavigate();
  const { products, productsLoading } = useProducts();
  const { salespersonData, salespersonsLoading } = UseSalesperson();
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sales, setSales] = useState([]);
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
    image: [],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
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

    // Recalculate total and commission based on quantity and price changes
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

  const removeCurrentRow = (index, e) => {
    e.preventDefault();
    setConfirmLoading(true);
    setSaleItems(saleItems.filter((_, i) => i !== index));
    setConfirmLoading(false);
  };

  const handleDateChange = (date) => {
    setSale((prev) => ({
      ...prev,
      datesold: date,
    }));
  };

  const handleEnterSale = () => {
    setSales((prevSales) => {
      const updatedSales = [...prevSales, saleItems];
      Swal.fire({
        title: "Sale Captured!",
        icon: "success",
        confirmButtonText: "Submit Sale!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          try {
            for (let saleGroup of updatedSales) {
              for (let saleItem of saleGroup) {
                const saleData = {
                  ...sale,
                  number: saleItem.number || sale.number,
                  description: saleItem.description || sale.description,
                  price: parseFloat(saleItem.price) || sale.price,
                  quantity: parseInt(saleItem.quantity) || sale.quantity,
                  total: parseFloat(saleItem.total) || sale.total,
                  datesold: sale.datesold
                    ? new Date(sale.datesold)
                    : new Date(),
                  saleperson: sale.saleperson.value,
                  commission: saleItem.commission || sale.commission,
                  pnumber: saleItem.pnumber || sale.pnumber,
                  code: saleItem.code || sale.code,
                  colour: saleItem.colour || sale.colour,
                  image: saleItem.image || sale.image,
                  customerName: sale.customerName,
                  customerEmail: sale.customerEmail,
                  customerPhone: sale.customerPhone,
                };

                console.log("saleData", saleData);
                const token = localStorage.getItem("token");
                const res = await axios.post("add-sale", saleData, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
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
                    image: [],
                    customerName: "",
                    customerEmail: "",
                    customerPhone: "",
                  });
                  navigate("/sales");
                }
              }
            }
          } catch (err) {
            console.log(err);
            Swal.fire({
              icon: "warning",
              title: "Sale entry failed!",
              text: "Kindly refresh and try again",
            });
          } finally {
            setLoading(false);
          }
        }
      });

      return updatedSales;
    });

    setSaleItems([]);
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const productOptions = productsLoading
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
            <img
              src={product.image}
              alt="_"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
            <span>{`${product.number} — ${product.description} (${product.code}) | [${product.colour}] - (${product.location})`}</span>
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

  return (
    <>
      {loading && <Loader />}
      <div style={{ margin: "10px 130px" }}>
        <Button>
          <Link to="/sales">Back To Sales</Link>
        </Button>
      </div>
      <SaleEntry
        sale={sale}
        setSale={setSale}
        saleItems={saleItems}
        handleRowChange={handleRowChange}
        handleEnterSale={handleEnterSale}
        handleProductSelection={handleProductSelection}
        removeCurrentRow={removeCurrentRow}
        productOptions={productOptions}
        salesName={salespersonData}
        handleDateChange={handleDateChange}
        filterOption={filterOption}
        customStyles={customStyles}
        confirmLoading={confirmLoading}
        productsLoading={productsLoading}
      />
    </>
  );
}

export default AddSale;
