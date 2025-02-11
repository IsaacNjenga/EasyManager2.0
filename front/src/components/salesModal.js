import React from "react";
import { Modal, Button, Image, Col, Row, Tag } from "antd";
import { formatDate } from "date-fns";

const SalesModal = ({ openModal, setOpenModal, modalContent, loading }) => {
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
                <strong>Price per unit:</strong> KSh.{" "}
                {Number(modalContent.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>{" "}
              <p>
                <strong>Total:</strong> KSh.{" "}
                {Number(modalContent.total).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Saleperson:</strong> {modalContent.saleperson}
              </p>
              <p>
                <strong>Commission:</strong> KSh.{" "}
                {Number(modalContent.commission).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Sold</strong>{" "}
                {formatDate(new Date(modalContent.datesold), "PPPP")}
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default SalesModal;
