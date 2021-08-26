import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { ToolsContext } from '../context/Tools';
import CriteriaContextProvider from '../context/CriteriaContext';
import TrainingInfo from '../pages/training/more/TraningInfo';
import ProjectInfo from '../pages/project/more/projectInfo';
import TestResult from '../pages/training/tabs/components/testResult';
import { getService } from '../service/service';
import Menu from './Menu';
import Page from './Page';
import CriteriaMore from '../pages/criteria/more/CriteriaMore';
import { buildPaths, generateRoutes } from './utils';
import ProjectContextProvider from '../context/ProjectContext';

const { Sider, Content } = Layout;

let menus = [];

function Admin() {
  const toolsStore = useContext(ToolsContext);
  const [collapsed, setCollapsed] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);
  const isLoggged = localStorage.getItem('token');
  const history = useHistory();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // if (!toolsStore.user) return;
    if (!isLoggged) {
      history.push('/login');
    }
    getService('/menus/getByToken').then(result => {
      if (!result) return;
      menus = result;
      setRoutes(generateRoutes(result));
    });
  }, []);

  return (
    <Router history={history}>
      <Layout>
        <Sider
          className="site-layout-background"
          breakpoint="lg"
          width="300px"
          collapsedWidth="70"
          collapsible
          trigger={null}
          collapsed={collapsed}
          onCollapse={toggle}
          style={{
            background: '#fff',
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            top: 0,
            left: 0,
          }}
        >
          {!collapsed ? (
            <img
              src="https://i.imgur.com/qmWx2x8.png"
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
              <ProjectContextProvider>
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
                  <Route path="/participantsList/:id">
                    <TestResult />
                  </Route>
                  <Route path="/projectList/:id">
                    <ProjectInfo />
                  </Route>
                </Switch>
              </ProjectContextProvider>
            </CriteriaContextProvider>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
export default Admin;
