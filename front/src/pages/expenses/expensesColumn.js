// import { format } from "date-fns";
// import { Tag } from "antd";
// import { EditOutlined } from "@ant-design/icons";

// function ExpensesColumn() {
//   const ExpensesColumns = [
//     { title: "No.", dataIndex: "number", key: "number" },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//       render: (date) => {
//         if (!date) return "N/A"; // Handle missing or undefined date
//         const parsedDate = new Date(date);
//         return isNaN(parsedDate)
//           ? "Invalid Date"
//           : format(parsedDate, "yyyy-MM-dd");
//       },
//     },
//     {
//       title: "Cost",
//       dataIndex: "cost",
//       key: "cost",
//       render: (text) => (
//         <Tag
//           color="#fc0100"
//           style={{
//             boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
//             border: "1px solid rgba(0, 0, 0, 0.2)",
//           }}
//         >
//           <strong>KSh. {text?.toLocaleString()}</strong>
//         </Tag>
//       ),
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//       key: "category",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     //   {
//     //     title: "Action",
//     //     key: "action",
//     //     render: (_, record) => (
//     //       <span>
//     //         <Button type="link" title="Edit this item">
//     //           <EditOutlined />
//     //         </Button>
//     //         <Popconfirm
//     //           title="Are you sure?"
//     //           description="This action cannot be undone!"
//     //           open={openDelete}
//     //           onConfirm={() => handleDelete(record)}
//     //           okButtonProps={{ loading: confirmLoading }}
//     //           onCancel={handleDeleteCancel}
//     //         >
//     //           <Button
//     //             type="link"
//     //             danger
//     //             title="Delete this item"
//     //             onClick={() => showDeleteConfirm(record)}
//     //           >
//     //             <DeleteOutlined />
//     //           </Button>
//     //         </Popconfirm>
//     //       </span>
//     //     ),
//     //   },
//   ];
// }

// export default ExpensesColumn;
