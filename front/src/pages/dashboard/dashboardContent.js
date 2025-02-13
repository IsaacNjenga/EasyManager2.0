import {
  CreditCardOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  RiseOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  Popover,
  DatePicker,
  Image,
  Button,
  Table,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Empty } from "antd";
import { format } from "date-fns";
//import { ExpensesData } from "../../assets/data/expensesData";
//import { SalesData } from "../../assets/data/salesData";
import SalesModal from "../../components/salesModal";
import { getDashboardData } from "./dateLogic";
import useSales from "../../assets/hooks/saleHook";
import useExpenses from "../../assets/hooks/expensesHook";

function DashboardContent() {
  const { salesData, salesLoading } = useSales();
  const { expenses, expensesLoading } = useExpenses();
  const currentDateTime = new Date();
  const [day, setDay] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedRevenue, setSelectedRevenue] = useState("today");
  const [selectedProfit, setSelectedProfit] = useState("today");
  const [selectedExpense, setSelectedExpense] = useState("today");
  const [selectedCommission, setSelectedCommission] = useState("today");
  const [filteredSales, setFilteredSales] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const dashboardData = getDashboardData({ salesData, expenses, day });

  console.log("Expenses:", expenses);
  console.log("Sales:", salesData);

  const formatter = (value) => {
    const numericValue = Number(value.replace(/KSh\.|\s|,/g, "").trim());

    return (
      <span>
        KSh. <CountUp start={0} end={numericValue} duration={1} separator="," />
      </span>
    );
  };
  useEffect(() => {
    const filterByDateRange = (data, dateKey, days) => {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      return data.filter((item) => {
        const itemDate = new Date(item[dateKey]);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate;
      });
    };

    let filteredSalesData = [];
    let filteredExpensesData = [];

    switch (selectedPeriod) {
      case "today":
        filteredSalesData = filterByDateRange(salesData, "datesold", 0);
        filteredExpensesData = filterByDateRange(expenses, "date", 0);
        break;
      case "yesterday":
        filteredSalesData = filterByDateRange(salesData, "datesold", 1);
        filteredExpensesData = filterByDateRange(expenses, "date", 1);
        break;
      case "lastWeek":
        filteredSalesData = filterByDateRange(salesData, "datesold", 7);
        filteredExpensesData = filterByDateRange(expenses, "date", 7);
        break;
      case "lastMonth":
        filteredSalesData = filterByDateRange(salesData, "datesold", 30);
        filteredExpensesData = filterByDateRange(expenses, "date", 30);
        break;
      default:
        filteredSalesData = filterByDateRange(salesData, "datesold", 0);
        filteredExpensesData = filterByDateRange(expenses, "date", 0);
    }

    setFilteredSales(filteredSalesData);
    setFilteredExpenses(filteredExpensesData);
  }, [selectedPeriod, salesData, expenses]); // Runs only when selectedPeriod or sales change

  const lastMonthStarting = new Date();
  lastMonthStarting.setDate(lastMonthStarting.getDate() - 30);

  const lastMonthEnding = new Date();
  lastMonthEnding.setDate(lastMonthEnding.getDate() - 0);

  const lastWeekStarting = new Date();
  lastWeekStarting.setDate(lastWeekStarting.getDate() - 7);

  const lastWeekEnding = new Date();
  lastWeekEnding.setDate(lastWeekEnding.getDate() - 0);

  const dateYesterday = new Date(currentDateTime);
  dateYesterday.setDate(currentDateTime.getDate() - 1);

  const iconStyle = {
    fontSize: "4rem",
  };
  const tagStyle = { cursor: "pointer" };

  const onDateChange = (date) => {
    if (date) {
      const selectedDate = format(new Date(date.$d), "yyyy-MM-dd");
      setSelectedRevenue("randomDay");
      setSelectedExpense("randomDay");
      setSelectedCommission("randomDay");
      setSelectedProfit("randomDay");
      setDay(selectedDate);
      if (date === null) {
        setSelectedRevenue("today");
        setSelectedExpense("today");
        setSelectedCommission("today");
        setSelectedProfit("today");
      }
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: " Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={image}
          alt="N/a"
          style={{ width: 100, height: 100, borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Colour",
      dataIndex: "colour",
      key: "colour",
      render: (colour) =>
        colour.split("-").map((col) => (
          <Tag
            key={col}
            color={col.toLowerCase()}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.2)",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
              color: [
                "white",
                "yellow",
                "lightgray",
                "cream brown",
                "blue",
                "red",
                "green",
                "metalic",
                "coffee",
                "beige",
                "silver",
              ].includes(col.toLowerCase())
                ? "black"
                : "white",
            }}
          >
            {col}
          </Tag>
        )),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `KSh. ${Number(text || 0).toLocaleString()}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => (
        <Tag
          color="#039622"
          style={{
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          KSh. {Number(text || 0).toLocaleString()}
        </Tag>
      ),
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (text) => (
        <Tag
          color="#fc0100"
          style={{
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          KSh. {Number(text || 0).toLocaleString()}
        </Tag>
      ),
    },
    {
      title: "Sold By",
      dataIndex: "saleperson",
      key: "saleperson",
    },
    {
      title: "Date",
      dataIndex: "datesold",
      key: "datesold",
      render: (text) => format(new Date(text), "dd/MM/yyyy"),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            warning="true"
            onClick={() => {
              viewDetails(record);
            }}
            title={"View this item"}
          >
            <EyeOutlined />
            <br />
            View
          </Button>
        </>
      ),
    },
  ];

  const expenseColumns = [
    { title: "No.", dataIndex: "number", key: "number" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        if (!date) return "N/A"; // Handle missing or undefined date
        const parsedDate = new Date(date);
        return isNaN(parsedDate)
          ? "Invalid Date"
          : format(parsedDate, "yyyy-MM-dd");
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (text) => (
        <Tag
          color="red"
          style={{
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          <strong>KSh. {text?.toLocaleString()}</strong>
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const viewDetails = (product) => {
    setOpenModal(true);
    setLoading(true);
    setModalContent(product);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const revenueMap = {
    today: dashboardData.revenueToday,
    yesterday: dashboardData.revenueYesterday,
    lastWeek: dashboardData.revenueWeekly,
    lastMonth: dashboardData.revenueMonthly,
    randomDay: dashboardData.selectedDateRevenue,
  };

  const expensesMap = {
    today: dashboardData.expenseToday,
    yesterday: dashboardData.expenseYesterday,
    lastWeek: dashboardData.expenseWeekly,
    lastMonth: dashboardData.expenseMonthly,
    randomDay: dashboardData.selectedDateExpense,
  };

  const profitMap = {
    today: dashboardData.profitToday,
    yesterday: dashboardData.profitYesterday,
    lastWeek: dashboardData.profitWeekly,
    lastMonth: dashboardData.profitMonthly,
    randomDay: dashboardData.selectedDateProfit,
  };

  const commissionsMap = {
    today: dashboardData.commissionsToday,
    yesterday: dashboardData.commissionsYesterday,
    lastWeek: dashboardData.commissionsWeekly,
    lastMonth: dashboardData.commissionsMonthly,
    randomDay: dashboardData.selectedDateCommissions,
  };

  const revenueDisplay = () =>
    revenueMap[selectedRevenue] ?? dashboardData.revenueToday;
  const expensesDisplay = () =>
    expensesMap[selectedExpense] ?? dashboardData.expenseToday;
  const commissionsDisplay = () =>
    commissionsMap[selectedCommission] ?? dashboardData.commissionsToday;
  const profitDisplay = () =>
    profitMap[selectedProfit] ?? dashboardData.profitToday;

  const SalesContent = ({ filteredSales, selectedPeriod }) => {
    return (
      <>
        <h3>
          {selectedPeriod === "lastWeek"
            ? `${format(new Date(lastWeekStarting), "dd/MM/yyyy")} - ${format(
                new Date(lastWeekEnding),
                "dd/MM/yyyy"
              )}`
            : selectedPeriod === "lastMonth"
            ? `${format(new Date(lastMonthStarting), "dd/MM/yyyy")} - ${format(
                new Date(lastMonthEnding),
                "dd/MM/yyyy"
              )}`
            : selectedPeriod === "yesterday"
            ? `${format(new Date(dateYesterday), "EEEE, do MMMM yyyy")}`
            : format(new Date(currentDateTime), "EEEE, do MMMM yyyy")}
        </h3>
        <Table
          dataSource={filteredSales}
          columns={columns}
          rowKey="_id"
          pagination={true}
          loading={salesLoading}
        />
      </>
    );
  };

  const ExpensesContent = ({ filteredExpenses, selectedPeriod }) => {
    return (
      <>
        <h3>
          {selectedPeriod === "lastWeek"
            ? `${format(new Date(lastWeekStarting), "dd/MM/yyyy")} - ${format(
                new Date(lastWeekEnding),
                "dd/MM/yyyy"
              )}`
            : selectedPeriod === "lastMonth"
            ? `${format(new Date(lastMonthStarting), "dd/MM/yyyy")} - ${format(
                new Date(lastMonthEnding),
                "dd/MM/yyyy"
              )}`
            : selectedPeriod === "yesterday"
            ? `${format(new Date(dateYesterday), "EEEE, do MMMM yyyy")}`
            : format(new Date(currentDateTime), "EEEE, do MMMM yyyy")}
        </h3>
        <Table
          dataSource={filteredExpenses}
          columns={expenseColumns}
          rowKey="_id"
          pagination={true}
          loading={expensesLoading}
        />
      </>
    );
  };

  const items = [
    {
      label: (
        <strong>
          Sales{" "}
          {selectedPeriod === "lastWeek"
            ? "for the last 7 days"
            : selectedPeriod === "lastMonth"
            ? "for the last 30 days"
            : selectedPeriod}
        </strong>
      ),
      key: "1",
      content: (selectedPeriod, filteredSales) => (
        <SalesContent
          filteredSales={filteredSales}
          selectedPeriod={selectedPeriod}
        />
      ),
    },
    {
      label: (
        <strong>
          Expenses{" "}
          {selectedPeriod === "lastWeek"
            ? "for the last 7 days"
            : selectedPeriod === "lastMonth"
            ? "for the last 30 days"
            : selectedPeriod}
        </strong>
      ),
      key: "2",
      content: (selectedPeriod, filteredExpenses) => (
        <ExpensesContent
          filteredExpenses={filteredExpenses}
          selectedPeriod={selectedPeriod}
        />
      ),
    },
    {
      label: (
        <strong>
          Reports{" "}
          {selectedPeriod === "lastWeek"
            ? "for the last 7 days"
            : selectedPeriod === "lastMonth"
            ? "for the last 30 days"
            : selectedPeriod}
        </strong>
      ),
      key: "3",
      content: (selectedPeriod) => (
        <>
          {/* <h3>{format(new Date(currentDateTime), "EEEE, do MMMM yyyy")}</h3> */}
          <div style={{ margin: "30px auto" }}>
            <Empty />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <DatePicker onChange={onDateChange} needConfirm />
        {day ? <p>Selected Date: {day}</p> : null}
      </div>
      <div>
        <Popover
          trigger="hover"
          title="Last 30 days"
          content={`${format(new Date(lastMonthStarting), "PPPP")} - ${format(
            new Date(lastMonthEnding),
            "PPPP"
          )}`}
        >
          <Tag
            color="#fc0100"
            style={tagStyle}
            onClick={() => {
              setSelectedRevenue("lastMonth");
              setSelectedExpense("lastMonth");
              setSelectedProfit("lastMonth");
              setSelectedCommission("lastMonth");
              setSelectedPeriod("lastMonth");
            }}
          >
            Last 30 days
          </Tag>
        </Popover>{" "}
        <Popover
          trigger="hover"
          title="Last 7 days"
          content={`${format(new Date(lastWeekStarting), "PPPP")} - ${format(
            new Date(lastWeekEnding),
            "PPPP"
          )}`}
        >
          <Tag
            style={tagStyle}
            color="#f1b622"
            onClick={() => {
              setSelectedRevenue("lastWeek");
              setSelectedExpense("lastWeek");
              setSelectedProfit("lastWeek");
              setSelectedCommission("lastWeek");
              setSelectedPeriod("lastWeek");
            }}
          >
            Last 7 days
          </Tag>
        </Popover>{" "}
        <Popover
          trigger="hover"
          title="Yesterday"
          content={format(new Date(dateYesterday), "PPPP")}
        >
          <Tag
            color="#4076c7"
            style={tagStyle}
            onClick={() => {
              setSelectedRevenue("yesterday");
              setSelectedExpense("yesterday");
              setSelectedProfit("yesterday");
              setSelectedCommission("yesterday");
              setSelectedPeriod("yesterday");
            }}
          >
            Yesterday
          </Tag>
        </Popover>{" "}
        <Popover
          trigger="hover"
          title="Today"
          content={format(new Date(currentDateTime), "PPPP")}
        >
          <Tag
            style={tagStyle}
            color="#008001"
            bordered={false}
            onClick={() => {
              setSelectedRevenue("today");
              setSelectedExpense("today");
              setSelectedProfit("today");
              setSelectedCommission("today");
              setSelectedPeriod("today");
            }}
          >
            Today
          </Tag>
        </Popover>
      </div>
      <div
        style={{
          margin: "25px 10px",
          width: "100%",
          justifyContent: "center", // Centers horizontally
          alignItems: "center", // Centers vertically
          padding: "15px 1px",
          textAlign: "center", // Ensures content inside is centered
        }}
      >
        <Row gutter={30} justify="center">
          <Col span={6}>
            <Card style={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)" }}>
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#00152a",
                    }}
                  >
                    Revenue <br />
                    <DollarCircleOutlined style={iconStyle} />
                  </span>
                }
                value={`KSh.${revenueDisplay().toLocaleString()}`}
                precision={2}
                valueStyle={{ color: "#00152a" }}
                //prefix={<DollarCircleOutlined style={iconStyle} />}
                formatter={formatter}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)" }}>
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#fc0100",
                    }}
                  >
                    Expenses
                    <br />
                    <CreditCardOutlined style={iconStyle} />
                  </span>
                }
                value={`KSh.${expensesDisplay().toLocaleString()}`}
                precision={2}
                valueStyle={{ color: "#fc0100" }}
                formatter={formatter}
                // prefix={<CreditCardOutlined style={iconStyle} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)" }}>
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "orange",
                    }}
                  >
                    Commissions
                    <br />
                    <UserDeleteOutlined style={iconStyle} />
                  </span>
                }
                value={`KSh.${commissionsDisplay().toLocaleString()}`}
                precision={2}
                valueStyle={{ color: "orange" }}
                formatter={formatter}
                // prefix={<UserDeleteOutlined style={iconStyle} />}
                // formatter={formatter}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.9)" }}>
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#008001",
                    }}
                  >
                    Profits
                    <br />
                    <RiseOutlined style={iconStyle} />
                  </span>
                }
                value={`KSh.${profitDisplay().toLocaleString()}`}
                precision={2}
                valueStyle={{ color: "#008001" }}
                formatter={formatter}
                //prefix={<RiseOutlined style={iconStyle} />}
                // formatter={formatter}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          children: item.content(
            selectedPeriod,
            item.key === "1" ? filteredSales : filteredExpenses
          ),
        }))}
      />

      <div>
        <SalesModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          modalContent={modalContent}
          loading={loading}
        />
      </div>
    </>
  );
}

export default DashboardContent;
