import { MenuOutlined } from '@ant-design/icons';
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { getService } from '../service/service';
import { ToolsContext } from '../context/Tools';
import Page from './Page';
import Menu from './Menu';
import { buildPaths, generateRoutes } from './utils';

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
          <Menu menus={buildPaths(menus)} collapsed={collapsed} />
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
            <Switch>
              {routes.map(route => (
                <Route key={route.code} path={route.path}>
                  <Page route={route} />
                </Route>
              ))}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
export default Admin;
