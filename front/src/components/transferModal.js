import React, { useEffect, useState } from "react";
import { Modal, Button, Image, Col, Row, Tag, Transfer } from "antd";

const TransferModal = ({
  openTransferModal,
  setOpenTransferModal,
  loading,
}) => {
  const [data, setData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const modalContent = {
    description: "Office Chair",
    image: "...",
    colour: "Black",
    code: "CH-001",
    quantity: 10,
    total_quantity: 25,
    price: 5500,
    location: "Shop A",
    bnumber: "BN123",
    summary: "Comfortable chair",
    stockByLocation: [
      { location: "Shop A", quantity: 10 },
      { location: "Shop B", quantity: 15 },
    ],
  };

  const getMock = () => {
    const tempTargetKeys = [];
    const tempData = [];

    modalContent?.stockByLocation?.forEach((loc, index) => {
      for (let i = 0; i < loc.quantity; i++) {
        const key = `${loc.location}-${i}`;
        tempData.push({
          key,
          title: `Qty ${i + 1}`,
          description: `From ${loc.location}`,
          location: loc.location,
        });

        // If this is NOT the source location, push it as already transferred
        if (loc.location !== modalContent.location) {
          tempTargetKeys.push(key);
        }
      }
    });

    setData(tempData);
    setTargetKeys(tempTargetKeys);
  };

  useEffect(() => {
    getMock();
  }, []);

  const filterOption = (inputValue, item) => {
    return item.description.toLowerCase().includes(inputValue.toLowerCase());
  };

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSearch = (dir, value) => {
    console.log("search:", dir, value);
  };

  return (
    <Modal
      title={modalContent ? modalContent.description : "Product Details"}
      footer={
        <Button type="primary" onClick={() => setOpenTransferModal(false)}>
          Close
        </Button>
      }
      open={openTransferModal}
      onCancel={() => setOpenTransferModal(false)}
      confirmLoading={loading}
      width={1200}
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
          </Col>{" "}
          <Col span={14}>
            <Transfer
              titles={[modalContent.location.toUpperCase(), "OTHER SHOPS"]}
              dataSource={data}
              filterOption={filterOption}
              targetKeys={targetKeys}
              onChange={handleChange}
              onSearch={handleSearch}
              render={(item) => item.title}
              rowKey={(record) => record.key}
            />
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default TransferModal;
