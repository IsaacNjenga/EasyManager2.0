import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Card,
  Image,
  Divider,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader.js";

function UpdateSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePublicIds, setImagePublicIds] = useState([]);
  const [value, setValue] = useState({
    number: "",
    description: "",
    colour: "",
    price: 0,
    quantity: 0,
    code: "",
    total: 0,
    datesold: "",
    commission: 0,
    saleperson: "",
    customerPhone: "",
    customerName: "",
    customerEmail: "",
    image: [],
  });

  const saleToUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`sale/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const sale = response.data.sale;

        setValue((prevValue) => ({ ...prevValue, ...sale }));
        setImageUrls(sale.image);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Error fetching details",
        text: "Try refreshing the page",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      saleToUpdate();
    }
  }, [id]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
    }
  }, [value]);

  const [form] = Form.useForm();
  const handleChange = (name, val) => {
    setValue((prev) => {
      const newValue = { ...prev, [name]: val };

      if (name === "quantity" || name === "price") {
        newValue.total = newValue.price * newValue.quantity;
        newValue.commission =
          newValue.total >= 10000 ? 0.01 * newValue.total : 0;
      }

      return newValue;
    });
  };

  const handleSubmit = async () => {
    const saleData = { ...value };
    try {
      const token = localStorage.getItem("token");
      await axios
        .put(`update-sale/${id}`, saleData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire("Success!", "Sale updated successfully", "success");
            form.resetFields();
            setValue({
              number: "",
              description: "",
              colour: "",
              price: "",
              quantity: "",
              code: "",
            });

            navigate("/sales");
          }
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Sale could not be updated",
        text: "Refresh and try again",
      });
    }
  };

  const clearForm = () => {
    Swal.fire({
      title: "Are you sure you want to clear this form?",
      text: "You will lose all the information!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        form.resetFields();
        setValue({
          number: "",
          description: "",
          colour: "",
          price: "",
          quantity: "",
          code: "",
          location: "",
          bnumber: "",
          summary: "",
        });
        setImageUrls([]);
        setImagePublicIds([]);
      }
    });
  };

  return (
    <>
      {loading && <Loader />}
      <Button>
        <Link to="/sales">Back To Sales</Link>
      </Button>
      <Card
        title="Add New Product"
        style={{ maxWidth: 1100, margin: "20px auto", padding: "20px" }}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          variant="outlined"
          initialValues={value}
        >
          <Row gutter={24}>
            {/* Image Upload Section */}
            <Col xs={24} md={10}>
              <Form.Item label="Image(s)">
                {imageUrls.length > 0 ? (
                  <div
                    className="image-preview-container"
                    style={{ marginTop: 10 }}
                  >
                    {imageUrls.map((url, index) => (
                      <div
                        key={imagePublicIds[index]}
                        style={{
                          position: "relative",
                          display: "inline-block",
                          marginRight: 8,
                        }}
                      >
                        <Image
                          src={url}
                          alt="uploaded"
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 5,
                            margin: "10px",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="no-image-text"
                    style={{ marginTop: 10, color: "#999" }}
                  >
                    No image available.
                  </p>
                )}
              </Form.Item>
            </Col>

            {/* Product Information Section */}
            <Col xs={24} md={14}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label="Product No."
                  name="number"
                  rules={[{ required: true, message: "No is required" }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "75%" }}
                    onChange={(val) => handleChange("number", val)}
                    value={value.number}
                  />
                </Form.Item>{" "}
              </div>
              <Form.Item
                label="Product Name"
                name="description"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <Input
                  onChange={(e) => handleChange("description", e.target.value)}
                  value={value.description}
                />
              </Form.Item>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                <Form.Item label="Product Code" name="code">
                  <Input
                    style={{ width: "75%" }}
                    onChange={(e) => handleChange("code", e.target.value)}
                    value={value.code}
                  />
                </Form.Item>
                <Form.Item label="Colour" name="colour">
                  <Input
                    style={{ width: "75%" }}
                    onChange={(e) => handleChange("colour", e.target.value)}
                    value={value.colour}
                  />
                </Form.Item>
                <Form.Item
                  label="Price per unit (KSh.)"
                  name="price"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <InputNumber
                    style={{ width: "75%" }}
                    min={0}
                    onChange={(val) => handleChange("price", val)}
                    value={value.price}
                    prefix="KSh."
                  />
                </Form.Item>
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{ required: true, message: "Qty is required" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "75%" }}
                    onChange={(val) => handleChange("quantity", val)}
                    value={value.quantity}
                  />
                </Form.Item>
                <Form.Item label="Total" name="total">
                  <InputNumber
                    min={0}
                    style={{ width: "75%", color: "green" }}
                    value={value.total}
                    disabled
                    prefix="KSh."
                  />
                </Form.Item>

                <Form.Item label="Commission off total" name="commission">
                  <InputNumber
                    min={0}
                    style={{ width: "75%", color: "red" }}
                    value={value.commission}
                    disabled
                    prefix="KSh."
                  />
                </Form.Item>
              </div>{" "}
              <Divider variant="sold">Customer Details</Divider>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {" "}
                <Form.Item
                  label="Customer Name"
                  name="customerName"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <InputNumber
                    style={{ width: "75%" }}
                    min={0}
                    onChange={(val) => handleChange("price", val)}
                    value={value.customerName}
                  />
                </Form.Item>{" "}
                <Form.Item
                  label="Customer Phone"
                  name="customerPhone"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <InputNumber
                    style={{ width: "75%" }}
                    min={0}
                    onChange={(val) => handleChange("price", val)}
                    value={value.customerPhone}
                  />
                </Form.Item>{" "}
                <Form.Item
                  label="Customer Email Address"
                  name="customerEmail"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <InputNumber
                    style={{ width: "75%" }}
                    min={0}
                    onChange={(val) => handleChange("price", val)}
                    value={value.customerEmail}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          {/* Form Buttons */}
          <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
            >
              Submit
            </Button>
            <Button onClick={clearForm} danger>
              Clear
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default UpdateSale;
