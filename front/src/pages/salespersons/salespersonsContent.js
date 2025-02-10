import React from "react";
import { Table, Button } from "antd";

const sampleSalespersons = [
  {
    key: "1",
    name: "John Doe",
    role: "Sales Manager",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    salesMade: 150,
  },
  {
    key: "2",
    name: "Jane Smith",
    role: "Sales Associate",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    salesMade: 120,
  },
  {
    key: "3",
    name: "Alice Johnson",
    role: "Sales Associate",
    email: "alice.johnson@example.com",
    phone: "555-555-5555",
    salesMade: 100,
  },
  {
    key: "4",
    name: "Bob Brown",
    role: "Sales Representative",
    email: "bob.brown@example.com",
    phone: "444-444-4444",
    salesMade: 80,
  },
  {
    key: "5",
    name: "Charlie Black",
    role: "Sales Associate",
    email: "charlie.black@example.com",
    phone: "333-333-3333",
    salesMade: 90,
  },
];

function SalespersonsContent() {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Sales Made",
      dataIndex: "salesMade",
      key: "salesMade",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button type="link">View Details</Button>
          <Button type="link" danger>
            Remove
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Salespersons</h2>
        <Table columns={columns} dataSource={sampleSalespersons} />
      </div>
    </>
  );
}

export default SalespersonsContent;
