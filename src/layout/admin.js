import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useContext, useEffect } from 'react';
import { Media } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToolsContext } from '../context/Tools';
import TrainingInfo from '../pages/training/more/TraningInfo';
import TestResult from '../pages/training/tabs/components/testResult';
import { getService } from '../service/service';
import Menu from './Menu';
import Page from './Page';

import { buildPaths, generateRoutes } from './utils';

const { Sider, Content, Header } = Layout;

let menus = [];

function Admin() {
  const toolsStore = useContext(ToolsContext);
  const [collapsed, setCollapsed] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    // if (!toolsStore.user) return;
    getService('/menus/getByToken').then(result => {
      if (!result) return;
      menus = result;
      setRoutes(generateRoutes(result));
    });
  }, []);

  return (
    <Router>
      <Layout>
        <Sider
          className="site-layout-background"
          style={{ background: '#fff' }}
          breakpoint="lg"
          width="300px"
          collapsedWidth="70"
          collapsible
          trigger={null}
          collapsed={collapsed}
          onCollapse={toggle}
        >
          {!collapsed ? (
            <img
              src="http://lcp.mn/assets/images/logo.png"
              className="logoHeader"
              height={50}
              width={200}
              style={{
                marginLeft: '25px',
                marginTop: '10px',
              }}
            />
          ) : (
            ''
          )}
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              style: { float: 'right' },
              className: 'trigger',
              onClick: () => {
                toggle();
              },
            }
          )}
          <Menu
            className="menu"
            mode="inline"
            style={{
              height: '100%',
              borderRight: 0,
              marginTop: '300px',
              background: '#fff',
            }}
            menus={buildPaths(menus)}
          />
        </Sider>
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              padding: 0,
              margin: 0,
              minHeight: '100%',
            }}
          >
            <CriteriaContextProvider>
              <Switch>
                {routes.map(route => (
                  <Route key={route.code} path={route.path}>
                    <Page route={route} />
                  </Route>
                ))}
                <Route path="/criteriaDetail/:id">
                  <CriteriaMore />
                </Route>
              ))}

              <Route path="/trainingList/:id">
                <TrainingInfo />
              </Route>
              <Route path="/participantsList/:id">
                <TestResult />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
export default Admin;
