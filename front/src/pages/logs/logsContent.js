import React from "react";
import { Table, Tabs } from "antd";
import useLogs from "../../assets/hooks/logsHook";
import { format } from "date-fns";

function LogsContent() {
  const { logins, loginsLoading, logoutsLoading, logouts } = useLogs();

  const columns1 = [
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Timestamp",
      dataIndex: "loginTime",
      key: "loginTime",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  const columns2 = [
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Timestamp",
      dataIndex: "logoutTime",
      key: "logoutTime",
    },
  ];

  const Logins = () => {
    return (
      <Table
        columns={columns1}
        dataSource={logins}
        loading={loginsLoading}
        rowKey="_id"
      />
    );
  };

  const Logouts = () => {
    return (
      <Table
        columns={columns2}
        dataSource={logouts}
        loading={logoutsLoading}
        rowKey="_id"
      />
    );
  };

  const items = [
    {
      label: <strong>Logins</strong>,
      key: "1",
      content: () => <Logins />,
    },
    {
      label: <strong>Logouts</strong>,
      key: "2",
      content: () => <Logouts />,
    },
  ];

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>User Logs</h2>

        <Tabs
          defaultActiveKey="1"
          items={items.map((item) => ({
            key: item.key,
            label: item.label,
            children: item.content(),
          }))}
        />
      </div>
    </>
  );
}

export default LogsContent;
