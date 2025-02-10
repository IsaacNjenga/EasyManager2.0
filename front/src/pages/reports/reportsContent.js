import React from "react";
import { Card, Row, Col } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Sales Overview"
            bordered={false}
            style={{ width: "100%", height: 350 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="User Activity" bordered={false}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={userActivityData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#52c41a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportsContent;
