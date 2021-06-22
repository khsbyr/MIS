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
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";
import Criteria from "./criteria";
import Tester from "./tester"
import Plan from "./plan";
import Tunshlel from "./tunshlel";
import Organization from "./organization";
import Guidelines from "./guidelines";
import CV from "./cv";
import Composition1 from "./composition1";
import TrainingReport from "./trainingReport";
import TrainingProgram from "./trainingProgram";
import { faClipboardCheck, faFileSignature, faHandsHelping, faLayerGroup, faList, faListAlt, faProjectDiagram, faUser, faUserAlt, faUserAltSlash, faUserCheck, faUserCircle, faUserCog, faUserGraduate, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import Attendance from "./attendance";

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



const Admin = () => {
  const { t, i18 } = useTranslation();

  function handleClick(lang) {
    i18n.changeLanguage(lang)
  }
  // state = {
  //   collapsed: false,
  // };

  // toggle = () => {
  //   this.setState({
  //     collapsed: !this.state.collapsed,
  //   });
  // };
  return (
    
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
                <SubMenu key="sub1" icon={<FontAwesomeIcon icon={faUserAlt} />}
                  title={t("user")}>
                  <Menu.Item key="1" icon={<FontAwesomeIcon icon={faUserAlt} />}
                  >
                    {" "}
                    <Link to="#">{t("user")}</Link>
                  </Menu.Item>{" "}
                  <Menu.Item key="2" icon={<FontAwesomeIcon icon={faUserCog} />}>{t("user_role")}</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub2"
                  icon={<FontAwesomeIcon icon={faClipboardCheck} />}
                  title={t("criteria")}
                >
                  <Menu.Item key="3" icon={<FontAwesomeIcon icon={faClipboardCheck} />}
                  >
                    {" "}
                    <Link to="/criteria" >{t("criteria_regist")}</Link>
                  </Menu.Item>
                  <Menu.Item key="40" icon={<FontAwesomeIcon icon={faClipboardCheck} />}
                  >
                    {" "}
                    <Link to="/tester" >{t("criteria_regist")} test</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key="sub3"
                  icon={<FontAwesomeIcon icon={faLayerGroup} />}
                  title={t("training")}
                >
                  <SubMenu
                    key="sub4"
                    icon={<FontAwesomeIcon icon={faLayerGroup} />}
                    title={t("training_plan")}
                  >
                    <Menu.Item key="4"><Link to="/composition1">{t("composition1")}</Link></Menu.Item>
                    <Menu.Item key="5">{t("composition2")}</Menu.Item>
                    <Menu.Item key="6">{t("composition3")}</Menu.Item>
                    <Menu.Item key="7">{t("composition4")}</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub5"
                    icon={<FontAwesomeIcon icon={faLayerGroup} />}
                    title={t("training")}
                  >
                    <Menu.Item key="8">
                      <Link to="/organization">{t("consulting_orga")}</Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                      <Link to="/guidelines">{t("training_intro")}</Link>
                    </Menu.Item>
                    <Menu.Item key="10">
                      <Link to="/plan">{t("training_plan")}</Link>
                    </Menu.Item>
                    <Menu.Item key="11">
                      <Link to="/cv">{t("cv_teachers")}</Link>
                    </Menu.Item>
                    <Menu.Item key="12">
                      <Link to="/training_program">{t("training_program")}</Link>
                    </Menu.Item>
                    <Menu.Item key="13"><Link to="/attendance">{t("attendance_registration")}</Link></Menu.Item>
                    <Menu.Item key="14">{t("test_aggregation")}</Menu.Item>
                    <Menu.Item key="15"><Link to="/training_report">{t("training_report")}</Link></Menu.Item>
                    <Menu.Item key="16">{t("training_budget")}</Menu.Item>
                  </SubMenu>
                </SubMenu>
                <SubMenu
                  key="sub6"
                  icon={<FontAwesomeIcon icon={faHandsHelping} />}

                  title={t("partnership")}
                >
                  <SubMenu
                    key="sub7"
                    icon={<FontAwesomeIcon icon={faHandsHelping} />}
                    title={t("productive_project")}
                  >
                    {" "}
                    <Menu.Item key="17">
                      {" "}
                      <Link to="/tunshlel">{t("consulting_orga")}</Link>
                    </Menu.Item>
                  </SubMenu>
                </SubMenu>
                <SubMenu
                  key="sub8"
                  icon={<FontAwesomeIcon icon={faProjectDiagram} />} title={t("project")}
                >
                  <SubMenu
                    key="sub9"
                    icon={<FontAwesomeIcon icon={faProjectDiagram} />}
                    title={t("productive_project")}
                  >
                    {" "}
                    <Menu.Item key="18">
                      {" "}
                      <Link to="/tunshlel">{t("brief_draft")}</Link>
                    </Menu.Item>
                    <Menu.Item key="19">
                      {" "}
                      <Link to="/tunshlel">{t("investment")}</Link>
                    </Menu.Item>
                    <Menu.Item key="20">
                      {" "}
                      <Link to="/tunshlel">{t("income_expenses")}</Link>
                    </Menu.Item>
                    <Menu.Item key="21">
                      {" "}
                      <Link to="/tunshlel">{t("consulting_orga")}</Link>
                    </Menu.Item>
                    <Menu.Item key="22">
                      {" "}
                      <Link to="/tunshlel">{t("detailed_project")}</Link>
                    </Menu.Item>
                  </SubMenu>
                </SubMenu>
                <Menu.Item key="23" icon={<FontAwesomeIcon icon={faListAlt} />}>
                  {t("plan")}
                </Menu.Item>
                <Menu.Item key="24" icon={<FontAwesomeIcon icon={faFileSignature} />}>
                  {t("report")}
                </Menu.Item>
                <Menu.Item key="25" icon={<FontAwesomeIcon icon={faList} />}>
                  {t("dashboard")}
                </Menu.Item>
                <SubMenu
                  key="sub10"
                  icon={<FontAwesomeIcon icon={faLayerGroup} />}
                  title={t("directory_regis")}
                >
                  <Menu.Item key="26" icon={<FontAwesomeIcon icon={faLayerGroup} />}>
                  {t("scope")}
                  </Menu.Item>
                  <Menu.Item key="27" icon={<FontAwesomeIcon icon={faLayerGroup} />}>
                    {t("address")}
                  </Menu.Item>
                  <Menu.Item key="28" icon={<FontAwesomeIcon icon={faLayerGroup} />}>
                  {t("contact_side")}
                  </Menu.Item>
                  <Menu.Item key="29" icon={<FontAwesomeIcon icon={faLayerGroup} />}>
                    {t("criteria_type")}{" "}
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
                  <Route exact path="/tester">
                    <Tester />
                  </Route>
                  <Route exact path="/criteria">
                    <Tester />
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
                  <Route path="/training_report">
                    <TrainingReport />
                  </Route>
                  <Route path="/composition1">
                    <Composition1 />
                  </Route>
                  <Route path="/training_program">
                    <TrainingProgram />
                  </Route>
                  <Route path="/attendance">
                    <Attendance />
                  </Route>
                </Switch>{" "}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    
  );

}
export default Admin;
