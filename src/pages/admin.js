import React from "react";
import styled from 'styled-components'
import "antd/dist/antd.css";
import LogoWrapper from './admin.style'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Divider, Layout, Menu } from "antd";
import { Row, Col, Avatar, Dropdown } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  CaretDownOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
// import {useTranslation} from 'react-i18next';
import Criteria from "./criteria";
import Plan from "./plan";
import Tunshlel from "./tunshlel";
import Company from "./Company";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
    <PoweroffOutlined />
      <a style={{ color: "black" ,paddingLeft: "0px"}}>Гарах</a>
    </Menu.Item>
  </Menu>
);

class Admin extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  

  render() {
    return (
      <adminWrapper>
        <Router>
          <Layout>
            <Layout>
              <Sider
                className="site-layout-background"
                // trigger={null}
                // collapsible
                // collapsed={this.state.collapsed}              
                style={{ background: "#fff"}}
                breakpoint="lg"
                width= "300px"
                collapsedWidth="0"
                trigger={<MenuOutlined />}
                onBreakpoint={broken => {
                  console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
                }}
              >
                <Menu
                  className="menu"
                  mode="inline"
                  defaultSelectedKeys={["1"]}
                  style={{
                    height: "100%",
                    borderRight: 0,
                    marginTop: "75px",
                    background: "#fff",
                  }}
                >
                  <SubMenu
                    key="sub1"
                    icon={<UserOutlined />}
                    title="Шалгуур үзүүлэлт"
                  >
                    <Menu.Item key="1">
                      {" "}
                      <Link to="/criteria">Шалгуур үзүүлэлт</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                    {" "}
                      <Link to="/company">option2</Link>
                    </Menu.Item>
                    <Menu.Item key="3">option3</Menu.Item>
                    <Menu.Item key="4">option4</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" icon={<LaptopOutlined />} title="Сургалт">
                    <Menu.Item key="5">
                      {" "}
                      <Link to="/plan">Төлөвлөгөө</Link>
                    </Menu.Item>
                    <Menu.Item key="6">option6</Menu.Item>
                    <Menu.Item key="7">option7</Menu.Item>
                    <Menu.Item key="8">option8</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub3"
                    icon={<NotificationOutlined />}
                    title="Түншлэл"
                  >
                    <Menu.Item key="9">
                      {" "}
                      <Link to="/tunshlel">Түншлэл</Link>
                    </Menu.Item>{" "}
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                  </SubMenu>
                  <Menu.Item key="13" icon={<NotificationOutlined />}>
                    Төсөл
                  </Menu.Item>
                  <Menu.Item key="14" icon={<NotificationOutlined />}>
                    Төлөвлөгөө
                  </Menu.Item>
                  <Menu.Item key="15" icon={<NotificationOutlined />}>
                    Тайлан
                  </Menu.Item>
                  <Menu.Item key="15" icon={<NotificationOutlined />}>
                    Хянах самбар
                  </Menu.Item>
                </Menu>
                {/* <LogoWrapper id="myDIV">
                    <h2 className="title"> МЭДЭЭЛЛИЙН УДИРДЛАГЫН</h2>
                    <img
                          src="/images/svg/logo-head.svg"
                          className="icon"
                          alt="card-icon"
                    />
                </LogoWrapper> */}
              </Sider>
              <Layout className="site-layout">
                <Header
                  className="site-layout-background"
                  style={{
                    backgroundColor: "white",
                    height: "50px",
                    lineHeight: "50px",
                  }}
                >
                  <Row>
                    {/* <Col span={20}>
                      {React.createElement(
                        this.state.collapsed
                          ? MenuUnfoldOutlined
                          : MenuFoldOutlined,
                        {
                          className: "trigger",
                          onClick: this.toggle,
                        }
                      )}
                      <a style={{ float: "right" }}>
                        МЭДЭЭЛЛИЙН УДИРДЛАГЫН СИСТЕМ
                      </a>
                    </Col> */}
                    <Col span={24} style={{ textAlign: "end " }}>
                      <div>
                        <Avatar
                          size="small"
                          style={{
                            color: "#f56a00",
                            backgroundColor: "#103154",
                            marginRight: "5px",
                          }}
                        >
                          A
                        </Avatar>
                        <Dropdown overlay={menu} trigger={["click"]}>
                          <a
                            className="ant-dropdown-link"
                            href="#"
                            style={{ color: "#103154", marginRight: "5px" }}
                          >
                            Айтмухамед
                            <CaretDownOutlined />
                          </a>
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                  <Divider
                    style={{
                      position: "relative",
                      left: "0px",
                      backgroundColor: "#103154",
                      margin: "0px 0px",
                      width: "100%",
                      minWidth: "100%",
                    }}
                  />
                </Header>
                <Content
                  className="site-layout-background"
                  style={{
                    padding: 0,
                    margin: 0,
                    minHeight: "100%",
                  }}
                >
                  <Switch>
                    <Route exact path="/criteria">
                      <Criteria />
                    </Route>
                    <Route path="/company">
                      <Company />
                    </Route>
                    <Route path="/plan">
                      <Plan />
                    </Route>
                    <Route path="/tunshlel">
                      <Tunshlel />
                    </Route>
                  </Switch>{" "}
                </Content>
              </Layout>
            </Layout>
          </Layout>
          ,
        </Router>
      </adminWrapper>
    );
  }
}
export default Admin;
