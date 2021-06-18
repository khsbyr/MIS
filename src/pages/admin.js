import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Divider, Layout, Menu } from "antd";
import { Row, Col, Avatar, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
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
import Organization from "./organization";
import Guidelines from "./guidelines";
import CV from "./cv";
import { faClipboardCheck, faFileSignature, faHandsHelping, faLayerGroup, faList, faListAlt, faProjectDiagram, faUser, faUserAlt, faUserAltSlash, faUserCheck, faUserCircle, faUserCog, faUserGraduate, faUserSecret } from "@fortawesome/free-solid-svg-icons";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <PoweroffOutlined />
      <a style={{ color: "black", paddingLeft: "0px" }}>Гарах</a>
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
                style={{ background: "#fff" }}
                breakpoint="lg"
                width="300px"
                collapsedWidth="0"
                trigger={<MenuOutlined />}
                onBreakpoint={(broken) => {
                  console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
                }}
              >
                <Menu
                  className="menu"
                  mode="inline"
                  // defaultSelectedKeys={["1"]}
                  style={{
                    height: "100%",
                    borderRight: 0,
                    marginTop: "75px",
                    background: "#fff",
                  }}
                >
                  {" "}
                  <SubMenu key="sub1"                     icon={<FontAwesomeIcon icon={faUserAlt}/>}                    
 title="Хэрэглэгч">
                    <Menu.Item key="1"                    icon={<FontAwesomeIcon icon={faUserAlt}/>}                    
>
                      {" "}
                      <Link>Хэрэглэгч</Link>
                    </Menu.Item>{" "}
                    <Menu.Item key="2" icon={<FontAwesomeIcon icon={faUserCog}/>}>Эрхийн тохиргоо</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub2"
                    icon={<FontAwesomeIcon icon={faClipboardCheck}/>}                    
                    title="Шалгуур үзүүлэлт"
                  >
                    <Menu.Item key="3"                    icon={<FontAwesomeIcon icon={faClipboardCheck}/>}                    
>
                      {" "}
                      <Link to="/criteria" >Шалгуур үзүүлэлтийн бүртгэл</Link>
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub3"
                    icon={<FontAwesomeIcon icon={faLayerGroup} />}
                    title="Сургалт"
                  >
                    <SubMenu
                      key="sub4"
                      icon={<FontAwesomeIcon icon={faLayerGroup} />}
                      title="Сургалтын төлөвлөгөө"
                    >
                      <Menu.Item key="4">Бүрэлдэхүүн 1</Menu.Item>
                      <Menu.Item key="5">Бүрэлдэхүүн 2</Menu.Item>
                      <Menu.Item key="6">Бүрэлдэхүүн 3</Menu.Item>
                      <Menu.Item key="7">Бүрэлдэхүүн 4</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub5"
                      icon={<FontAwesomeIcon icon={faLayerGroup} />}
                      title="Сургалт"
                    >
                      <Menu.Item key="8">
                        <Link to="/organization">Зөвлөх байгууллага</Link>
                      </Menu.Item>
                      <Menu.Item key="9">
                        <Link to="/guidelines">Сургалтын удирдамж</Link>
                      </Menu.Item>
                      <Menu.Item key="10">
                        <Link to="/plan">Сургалтын төлөвлөгөө</Link>
                      </Menu.Item>
                      <Menu.Item key="11">
                        <Link to="/cv">Сургагч багшийн CV</Link>
                      </Menu.Item>
                      <Menu.Item key="12">
                        <Link>Сургалтын хөтөлбөр</Link>
                      </Menu.Item>
                      <Menu.Item key="13">Ирцийн бүртгэл</Menu.Item>
                      <Menu.Item key="14">Сорилын нэгтгэл</Menu.Item>
                      <Menu.Item key="15">Сургалтын тайлан</Menu.Item>
                      <Menu.Item key="16">Сургалтын төсөв</Menu.Item>
                    </SubMenu>
                  </SubMenu>
                  <SubMenu
                    key="sub6"
                    icon={<FontAwesomeIcon icon={faHandsHelping}/>}                    

                    title="Түншлэл"
                  >
                    <SubMenu
                      key="sub7"
                      icon={<FontAwesomeIcon icon={faHandsHelping}/>}
                      title="Бүтээмжит түншлэл"
                    >
                      {" "}
                      <Menu.Item key="17">
                        {" "}
                        <Link to="/tunshlel">Зөвлөх байгууллага</Link>
                      </Menu.Item>
                    </SubMenu>
                  </SubMenu>
                  <SubMenu
                    key="sub8"
                    icon={<FontAwesomeIcon icon={faProjectDiagram}/>}                    title="Төсөл"
                  >
                    <SubMenu
                      key="sub9"
                      icon={<FontAwesomeIcon icon={faProjectDiagram}/>}
                      title="Бүтээмжит төсөл"
                    >
                      {" "}
                      <Menu.Item key="18">
                        {" "}
                        <Link to="/tunshlel">Товч төсөл</Link>
                      </Menu.Item>
                      <Menu.Item key="19">
                        {" "}
                        <Link to="/tunshlel">Хөрөнгө оруулалт</Link>
                      </Menu.Item>
                      <Menu.Item key="20">
                        {" "}
                        <Link to="/tunshlel">Орлого зардал</Link>
                      </Menu.Item>
                      <Menu.Item key="21">
                        {" "}
                        <Link to="/tunshlel">Зөвлөх байгууллага</Link>
                      </Menu.Item>
                      <Menu.Item key="22">
                        {" "}
                        <Link to="/tunshlel">Дэлгэрэнгүй төсөл</Link>
                      </Menu.Item>
                    </SubMenu>
                  </SubMenu>
                  <Menu.Item key="23" icon={<FontAwesomeIcon icon={faListAlt}/>}>
                    Төлөвлөгөө
                  </Menu.Item>
                  <Menu.Item key="24" icon={<FontAwesomeIcon icon={faFileSignature}/>}>
                    Тайлан
                  </Menu.Item>
                  <Menu.Item key="25" icon={<FontAwesomeIcon icon={faList}/>}>
                    Хянах самбар
                  </Menu.Item>
                  <SubMenu
                    key="sub10"
                    icon={<FontAwesomeIcon icon={faLayerGroup}/>}
                    title="Лавлах бүртгэл"
                  >
                    <Menu.Item key="26" icon={<FontAwesomeIcon icon={faLayerGroup}/>}>
                      Хамрах хүрээ
                    </Menu.Item>
                    <Menu.Item key="27" icon={<FontAwesomeIcon icon={faLayerGroup}/>}>
                      Хаяг
                    </Menu.Item>
                    <Menu.Item key="28" icon={<FontAwesomeIcon icon={faLayerGroup}/>}>
                      Харилцах тал{" "}
                    </Menu.Item>
                    <Menu.Item key="29" icon={<FontAwesomeIcon icon={faLayerGroup}/>}>
                      Шалгуур үзүүлэлтийн төрөл{" "}
                    </Menu.Item>
                  </SubMenu>
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
                    <Route path="/guidelines">
                      <Guidelines />
                    </Route>
                    <Route path="/plan">
                      <Plan />
                    </Route>
                    <Route path="/tunshlel">
                      <Tunshlel />
                    </Route>
                    <Route path="/organization">
                      <Organization />
                    </Route>
                    <Route path="/cv">
                      <CV />
                    </Route>
                  </Switch>{" "}
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      </adminWrapper>
    );
  }
}
export default Admin;
