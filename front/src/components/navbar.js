import React, { useContext, useState } from "react";
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
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/navbar.css";
import { UserContext } from "../App";
import Swal from "sweetalert2";
import axios from "axios";

const { Content, Sider } = Layout;

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

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [current, setCurrent] = useState(location.pathname);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    try {
      Swal.fire({
        icon: "warning",
        text: "Are you sure you want to logout?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await axios.post("logout", user);
          if (res.data.success) {
            localStorage.clear();
            setUser(null);
          }
          navigate("/login");
        }
      });
    } catch (error) {
      console.log("error logging out", error);
    }
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
      onClick: handleLogout,
    },
  ];

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
          {user && <p>{user.name}</p>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          onClick={handleClick}
          items={menuItems.map(({ key, icon, label, path, onClick }) => ({
            key: path || key,
            icon: React.createElement(icon, { style: { fontSize: "1.9rem" } }),
            label: path ? <Link to={path}>{label}</Link> : label,
            onClick,
            style: { fontSize: "22px", padding: "3px", margin: "15px 6px" },
          }))}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "26px 16px", overflow: "auto" }}>
          <div
            style={{
              padding: 10,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: "100vh",
              fontSize: "18px",
            }}
          >
            <Outlet /> 
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Navbar;
