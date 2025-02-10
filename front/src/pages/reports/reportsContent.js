import React from "react";
import { Card, Row, Col } from "antd";

const salesData = [
  { month: "Jan", sales: 300 },
  { month: "Feb", sales: 400 },
  { month: "Mar", sales: 350 },
  { month: "Apr", sales: 500 },
  { month: "May", sales: 450 },
  { month: "Jun", sales: 600 },
];

const userActivityData = [
  { month: "Jan", activeUsers: 50 },
  { month: "Feb", activeUsers: 70 },
  { month: "Mar", activeUsers: 60 },
  { month: "Apr", activeUsers: 80 },
  { month: "May", activeUsers: 90 },
  { month: "Jun", activeUsers: 100 },
];

function ReportsContent() {
  const salesConfig = {
    data: salesData,
    xField: "month",
    yField: "sales",
    smooth: true,
    height: 200,
    tooltip: {
      formatter: (datum) => ({
        name: "Sales",
        value: `$${datum.sales}`,
      }),
    },
  };

  const userActivityConfig = {
    data: userActivityData,
    xField: "month",
    yField: "activeUsers",
    smooth: true,
    height: 200,
    tooltip: {
      formatter: (datum) => ({
        name: "Active Users",
        value: datum.activeUsers,
      }),
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Sales Overview" bordered={false}>
            {/* <Line {...salesConfig} /> */}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="User Activity" bordered={false}>
            {/* <Line {...userActivityConfig} /> */}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportsContent;
