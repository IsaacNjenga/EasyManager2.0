import React, { useState } from "react";
import { ProductData } from "../../assets/data/productsData";
import { SalespersonsData } from "../../assets/data/salespersonsData";
import Swal from "sweetalert2";
import SaleEntry from "./saleEntry";

function AddSale() {
  const [saleItems, setSaleItems] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [products, setProducts] = useState(
    Array.isArray(ProductData) ? ProductData : []
  );
  const [salesName, setSalesName] = useState(SalespersonsData);
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
    //Swal.fire({ icon: "success", text: "Removed!" });
    setConfirmLoading(false);
  };

  const handleDateChange = (date) => {
    setSale((prev) => ({
      ...prev,
      datesold: date,
    }));
  };

  const handleEnterSale = () => {
    console.log("saleitems:", saleItems);

    // Ensure sales is updated correctly
    setSales((prevSales) => {
      const updatedSales = [...prevSales, saleItems];
      console.log("Updated sales:", updatedSales);

      Swal.fire({
        title: "Sale Captured!",
        icon: "success",
        confirmButtonText: "Submit Sale!",
      }).then((result) => {
        if (result.isConfirmed) {
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
                  saleperson: sale.saleperson.label,
                  commission: saleItem.commission || sale.commission,
                  pnumber: saleItem.pnumber || sale.pnumber,
                  code: saleItem.code || sale.code,
                  colour: saleItem.colour || sale.colour,
                  image: saleItem.image || sale.image,
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
      <SaleEntry
        sale={sale}
        setSale={setSale}
        saleItems={saleItems}
        handleRowChange={handleRowChange}
        handleEnterSale={handleEnterSale}
        handleProductSelection={handleProductSelection}
        removeCurrentRow={removeCurrentRow}
        productOptions={productOptions}
        salesName={salesName}
        handleDateChange={handleDateChange}
        filterOption={filterOption}
        customStyles={customStyles}
        confirmLoading={confirmLoading}
      />
    </>
  );
}

export default AddSale;
