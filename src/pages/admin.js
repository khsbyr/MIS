import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Divider, Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
// import {useTranslation} from 'react-i18next';
import Criteria from "./criteria";
import Plan from "./plan";
import adminWrapper from "./admin.style";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
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
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              width="300px"
              style={{background: "#fff"}}
            >
              <Menu
                className="menu"
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%", borderRight: 0 , marginTop: "50px", background:"#fff"}}
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
                  <Menu.Item key="2">option2</Menu.Item>
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
                  <Menu.Item key="9">option9</Menu.Item>
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
                <Menu.Item key="20" icon={<NotificationOutlined />}>
                  Login
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="site-layout">
            <Header className="site-layout-background" style={{ backgroundColor: "white" }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            <Divider style={{ position:"absolute" ,backgroundColor:"#103154"}} />
          </Header>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <Switch>
                  <Route exact path="/criteria">
                    <Criteria />
                  </Route>
                  <Route path="/plan">
                    <Plan />
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
