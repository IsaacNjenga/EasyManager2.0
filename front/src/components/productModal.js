import React from "react";
import { Modal, Button, Image, Col, Row, Tag } from "antd";

const ProductModal = ({ openModal, setOpenModal, modalContent, loading }) => {
  return (
    <Modal
      title={modalContent ? modalContent.description : "Product Details"}
      footer={
        <Button type="primary" onClick={() => setOpenModal(false)}>
          Close
        </Button>
      }
      open={openModal}
      onCancel={() => setOpenModal(false)}
      confirmLoading={loading}
      width={900} // Adjust modal width
    >
      {modalContent && (
        <Row gutter={[24, 24]} align="middle">
          {/* Left Section - Product Image */}
          <Col span={10} style={{ textAlign: "center" }}>
            <Image
              src={modalContent.image}
              alt="Product"
              width={350}
              height={350}
              style={{
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                objectFit: "contain",
              }}
            />
          </Col>

          {/* Right Section - Product Details */}
          <Col span={14}>
            <div style={{ margin: "20px" }}>
              {" "}
              <Tag color="brown">
                <strong> {modalContent.colour}</strong>
              </Tag>
              <p>
                <strong>Code:</strong> {modalContent.code}
              </p>
              <p>
                <strong>Quantity:</strong> {modalContent.quantity}
              </p>
              <p>
                <strong>Total Quantity:</strong> {modalContent.total_quantity}
              </p>
              <p>
                <strong>Price:</strong> KSh.{" "}
                {Number(modalContent.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Location:</strong> {modalContent.location.toUpperCase()}
              </p>
              <p>
                <strong>Batch No.:</strong> {modalContent.bnumber}A
              </p>
              <p>
                <strong>Summary:</strong> {modalContent.summary.toUpperCase()}
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default ProductModal;
