import { MenuOutlined } from '@ant-design/icons';
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { getService } from '../service/service';
import { ToolsContext } from '../context/Tools';
import Page from './Page';
import Menu from './Menu';
import { buildPaths, generateRoutes } from './utils';
import CriteriaMore from '../pages/criteria/more/CriteriaMore';
import TrainingInfo from '../pages/training/more/TraningInfo';
import CriteriaContextProvider from '../context/CriteriaContext';

const { Sider, Content } = Layout;

let menus = [];

function Admin() {
  const toolsStore = useContext(ToolsContext);
  const [collapsed, setCollapsed] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);

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
          collapsedWidth="0"
          trigger={<MenuOutlined />}
        >
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
            collapsed={collapsed}
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
                <Route path="/trainingList/:id">
                  <TrainingInfo />
                </Route>
              </Switch>
            </CriteriaContextProvider>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
export default Admin;
