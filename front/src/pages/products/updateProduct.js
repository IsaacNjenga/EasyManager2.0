import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Form, Input, InputNumber, Button, Row, Col, Card, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader.js";

const { TextArea } = Input;

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePublicIds, setImagePublicIds] = useState([]);
  const [value, setValue] = useState({
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

  const productToUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const product = response.data.fetchedProduct;

        setValue((prevValue) => ({ ...prevValue, ...product }));
        setImageUrls(product.image);
        setImagePublicIds(product.imageId);
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
      productToUpdate();
    }
  }, [id]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value); // Ensure data is populated dynamically
    }
  }, [value]);

  const [form] = Form.useForm();
  const handleChange = (name, value) => {
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    Swal.fire({
      title: "Uploading your image...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setImageUploading(true);
    const files = Array.from(e.target.files); // Get all selected files
    const maxSize = 10 * 1024 * 1024;

    // Check each file size
    for (let file of files) {
      if (file.size > maxSize) {
        setImageUploading(false);
        return Swal.fire({
          icon: "error",
          title: "File exceeds limit!",
          text: "Please select a file less than 10MB",
          confirmButtonText: "OK",
        });
      }
    }

    const cloud_name = "dinsdfwod";
    const preset_key = "EasyManager";
    let newImageUrls = [];
    let newImagePublicIds = [];

    const uploadPromises = files.map((file) => {
      const formImageData = new FormData();
      formImageData.append("file", file);
      formImageData.append("upload_preset", preset_key);

      return axios
        .post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formImageData,
          { withCredentials: false }
        )
        .then((res) => {
          // For each uploaded image, update the arrays setImageUploading(true);

          newImageUrls.push(res.data.secure_url);
          newImagePublicIds.push(res.data.public_id);
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Failed to upload image",
            text: "There was an unexpected error. Please try again",
            confirmButtonText: "OK",
          });
        });
    });

    // After all uploads are done, update the state
    Promise.all(uploadPromises)
      .then(() => {
        Swal.fire({ icon: "success", title: "Images added successfully" });
        setImageUploading(false);

        setImageUrls((prevImages) => [...prevImages, ...newImageUrls]);
        setImagePublicIds((prevIds) => [...prevIds, ...newImagePublicIds]);
      })
      .catch((error) => {
        setImageUploading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Failed to upload image",
          text: "There was an unexpected error. Please try again",
          confirmButtonText: "OK",
        });
      });
  };

  const deletePicture = (e, publicId) => {
    e.preventDefault();
    if (!publicId) {
      return Swal.fire({
        icon: "error",
        title: "No image to delete!",
        text: "You have not selected a valid image to delete",
        confirmButtonText: "OK",
      });
    }
    setLoading(true);

    axios
      .delete("delete-image", { data: { publicId } })
      .then(() => {
        setImageUrls((prevImages) =>
          prevImages.filter((_, index) => imagePublicIds[index] !== publicId)
        );
        setImagePublicIds((prevIds) => prevIds.filter((id) => id !== publicId));
        setLoading(false);
        Swal.fire({ icon: "success", title: "Image removed!" });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Failed to delete!",
          text: "Refresh the page and try again",
          confirmButtonText: "OK",
        });
      });
  };

  const handleSubmit = async () => {
    const productData = { ...value, image: imageUrls, imageId: imagePublicIds };
    console.log(productData);
    try {
      const token = localStorage.getItem("token");
      await axios
        .put(`update-product/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire("Success!", "Product updated successfully", "success");
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

            navigate("/products");
          }
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "warning",
        title: "Product could not be updated",
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
        <Link to="/products">Back To Inventory</Link>
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
              <Form.Item label="Upload Images (Multiple)">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="custom-upload-button"
                  ></label>
                  <input
                    id="file-upload"
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>
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
                        <Button
                          type="text"
                          shape="circle"
                          icon={<DeleteOutlined />}
                          onClick={(e) =>
                            deletePicture(e, imagePublicIds[index])
                          }
                          style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            zIndex: 1,
                            background: "white",
                          }}
                        />
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
                    No images uploaded.
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
                <Form.Item label="Product Code" name="code">
                  <Input
                    style={{ width: "75%" }}
                    onChange={(e) => handleChange("code", e.target.value)}
                    value={value.code}
                  />
                </Form.Item>
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
                <Form.Item label="Colour" name="colour">
                  <Input
                    style={{ width: "75%" }}
                    onChange={(e) => handleChange("colour", e.target.value)}
                    value={value.colour}
                  />
                </Form.Item>

                <Form.Item
                  label="Selling Price (KSh.)"
                  name="price"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <InputNumber
                    style={{ width: "75%" }}
                    min={0}
                    onChange={(val) => handleChange("price", val)}
                    value={value.price}
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
                <Form.Item label="Batch No." name="bnumber">
                  <Input
                    style={{ width: "75%" }}
                    onChange={(e) => handleChange("bnumber", e.target.value)}
                    value={value.bnumber}
                  />
                </Form.Item>
              </div>{" "}
              <Form.Item label="Location" name="location">
                <Input
                  onChange={(e) => handleChange("location", e.target.value)}
                  value={value.location}
                />
              </Form.Item>
              <Form.Item label="Summary" name="summary">
                <TextArea
                  rows={3}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  value={value.summary}
                />
              </Form.Item>
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

export default UpdateProduct;
