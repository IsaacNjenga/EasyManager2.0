import React from "react";
import { Table } from "antd";

const sampleLogs = [
  {
    key: "1",
    username: "john.doe",
    action: "Login",
    timestamp: "2023-01-15 08:30:00",
    ipAddress: "192.168.1.1",
  },
  {
    key: "2",
    username: "jane.smith",
    action: "Login",
    timestamp: "2023-01-15 09:00:00",
    ipAddress: "192.168.1.2",
  },
  {
    key: "3",
    username: "alice.johnson",
    action: "Logout",
    timestamp: "2023-01-15 09:30:00",
    ipAddress: "192.168.1.3",
  },
  {
    key: "4",
    username: "bob.brown",
    action: "Login",
    timestamp: "2023-01-15 10:00:00",
    ipAddress: "192.168.1.4",
  },
  {
    key: "5",
    username: "john.doe",
    action: "Logout",
    timestamp: "2023-01-15 10:15:00",
    ipAddress: "192.168.1.1",
  },
];

function LogsContent() {
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
  ];

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>User Logs</h2>
        <Table columns={columns} dataSource={sampleLogs} />
      </div>
    </>
  );
}

export default LogsContent;
