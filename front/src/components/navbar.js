import React, { useEffect, useState } from "react";
import {
  BarChartOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  TeamOutlined,
  UserAddOutlined,
  SolutionOutlined,
  UserSwitchOutlined,
  CreditCardOutlined,
  PoweroffOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../assets/css/navbar.css";
import { format } from "date-fns";

const { Header, Content, Sider } = Layout;

const siderStyle = {
  overflow: "hidden",
  height: "120vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const menuItems = [
  {
    key: "0",
    icon: DashboardOutlined,
    label: "Dashboard",
    path: "/",
  },
  {
    key: "1",
    icon: ProductOutlined,
    label: "Inventory",
    path: "/products",
  },
  {
    key: "2",
    icon: ShoppingCartOutlined,
    label: "Sales",
    path: "/sales",
  },
  {
    key: "3",
    icon: TeamOutlined,
    label: "Customers",
    path: "/customers",
  },
  {
    key: "4",
    icon: CreditCardOutlined,
    label: "Expenses",
    path: "/expenses",
  },
  {
    key: "5",
    icon: UserSwitchOutlined,
    label: "Salespersons",
    path: "/salespersons",
  },
  {
    key: "6",
    icon: BarChartOutlined,
    label: "Reports",
    path: "/reports",
  },
  {
    key: "7",
    icon: SolutionOutlined,
    label: "Logs",
    path: "/logs",
  },
  {
    key: "8",
    icon: UserAddOutlined,
    label: "Add User",
    path: "/register",
  },
  {
    key: "9",
    icon: PoweroffOutlined,
    label: "Log Out",
    path: "/log-out",
  },
];

function Navbar() {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const yearOnly = currentDateTime.toLocaleDateString("en-Us", {
    year: "numeric",
  });

  const formattedDate2 = currentDateTime.toLocaleDateString("en-UK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div
          style={{
            padding: "16px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          John Doe
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          onClick={handleClick}
          items={menuItems.map(({ key, icon, label, path }) => ({
            key: path,
            icon: React.createElement(icon, { style: { fontSize: "1.6rem" } }),
            label: <Link to={path}>{label}</Link>,
            style: { fontSize: "20px", padding: "5px", margin: "15px 6px" },
          }))}
        />
      </Sider>
      <Layout>
        {/* <Header
          style={{
            margin: "10px 10px",
            background: colorBgContainer,
            fontSize: "15px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between", // Pushes title to center, time to right
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Dashboard 
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            {format(new Date(currentDateTime), "PPPP")}
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <ClockCircleOutlined />
              {format(new Date(currentDateTime), "pp")}
            </span>
          </div>
        </Header> */}
        <Content style={{ margin: "26px 16px", overflow: "auto" }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: "100vh",
              fontSize: "18px",
            }}
          >
            <Outlet /> {/* THIS IS WHERE THE PAGE CONTENT WILL LOAD */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Navbar;
