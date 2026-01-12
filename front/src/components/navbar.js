import React, { useState } from "react";
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  FloatButton,
  Layout,
  Menu,
  Tooltip,
  Typography,
} from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../assets/css/navbar.css";
import Swal from "sweetalert2";
import logo from "../assets/images/office-chair.png";
import { useAuth } from "../contexts/AuthContext";

const { Content, Header, Sider } = Layout;
const { Title, Text } = Typography;

function getItem(label, path, key, icon, children) {
  return { key, icon, path, children, label };
}

const items = [
  getItem("Dashboard", "/", 1, DashboardOutlined),
  getItem("Inventory", "/products", 2, ProductOutlined),
  getItem("Sales", "/sales", 3, ShoppingCartOutlined),
  getItem("Customers", "/customers", 4, TeamOutlined),
  getItem("Expenses", "/expenses", 5, CreditCardOutlined),
  getItem("Salespersons", "/salespersons", 6, UserSwitchOutlined),
  getItem("Reports", "/reports", 7, BarChartOutlined),
  getItem("Logs", "/logs", 8, SolutionOutlined),
  getItem("Add User", "/register", 9, UserAddOutlined),
];

const flattenItems = (arr) =>
  arr.reduce((acc, item) => {
    if (item.children) acc.push(...flattenItems(item.children));
    else acc.push(item);
    return acc;
  }, []);

// Find the matching menu item label
const getTitleFromPath = (path) => {
  const allItems = flattenItems(items);
  const found = allItems.find((item) => item.path === path);
  return found ? found.label : "Dashboard";
};

function Navbar() {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const { logout, collapsed, setCollapsed } = useAuth();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <FloatButton
        description=""
        tooltip={collapsed ? "Open" : "Collapse"}
        type="primary"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed((prev) => !prev)}
        style={{
          left: 24,
          bottom: 24,
          right: "auto",
          fontSize: "14px",
          position: "fixed",
          zIndex: 1000,
        }}
      />
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onBreakpoint={(broken) => setCollapsed(broken)}
          width={240}
          style={{
            padding: collapsed ? 4 : 8,
            background:
              "linear-gradient(to right, #232527ff 0%, #000000d6 100% )",
            borderColor: "#fff",
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            insetInlineStart: 0,
            top: 0,
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
          }}
        >
          <div style={{ margin: "2px 0px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <img
                    src={logo}
                    alt="logo"
                    style={{
                      width: 0,
                      height: 0,
                      borderRadius: "50%",
                      transition: "all 0.3s ease-in-out",
                    }}
                  />
                </div>
              </div>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemColor: "#fea549",
                    itemHoverColor: "#fea549",
                    itemSelectedColor: "#fea549",
                    horizontalItemSelectedColor: "#fea549",
                    itemBg: "transparent",
                  },
                },
              }}
            >
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[current]}
                onClick={handleClick}
                inlineCollapsed={collapsed}
                style={{
                  fontFamily: "Raleway",
                  border: "none",
                  background: "transparent",
                }}
                items={items.map(({ key, icon, label, path, children }) => ({
                  key: path || key,
                  icon: React.createElement(icon, {
                    style: {
                      fontSize: collapsed ? "1.5rem" : "1.9rem",
                      color: "whitesmoke",
                      margin: "3px 0",
                    },
                  }),
                  label: path ? (
                    <Link
                      to={path}
                      style={{
                        fontSize: "20px",
                        color: "whitesmoke",
                      }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <Text
                      style={{
                        fontSize: "18px",
                        color: "whitesmoke",
                        fontFamily: "Raleway",
                      }}
                    >
                      {label}
                    </Text>
                  ),
                  children: children?.map((child) => ({
                    key: child.path || child.key,
                    icon: React.createElement(child.icon, {
                      style: {
                        fontSize: collapsed ? "1.5rem" : "1.7rem",
                        color: "whitesmoke",
                        margin: "4px 0px",
                      },
                    }),
                    label: (
                      <Link
                        to={child.path}
                        style={{
                          fontSize: "16px",
                          color: "whitesmoke",
                          background: "transparent",
                          fontFamily: "Raleway",
                        }}
                      >
                        {child.label}
                      </Link>
                    ),
                  })),
                  style: {
                    textAlign: "left",
                    margin: collapsed ? "10px" : "16px 2px",
                  },
                }))}
              />
            </ConfigProvider>
          </div>
        </Sider>
        <Layout>
          <Header
            style={{
              background:
                "linear-gradient(to left, #232527ff 0%, #000000d6 100% )",
              borderBottom: "1px solid #cccccc",
              height: "auto",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ marginLeft: 10 }}>
                <Title style={{ fontFamily: "Raleway", color: "#fff" }}>
                  {getTitleFromPath(current)}
                </Title>
              </div>

              <div style={{ marginRight: 20 }}>
                <Tooltip title="Logout">
                  <Button
                    type="primary"
                    icon={<PoweroffOutlined />}
                    danger
                    shape="circle"
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You will be logged out.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          await logout();
                        } else {
                          return;
                        }
                      });
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "0px",
              padding: 10,
              minHeight: "100vh",
              borderRadius: 0,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Navbar;
