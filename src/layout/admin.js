import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { useToolsStore } from '../context/Tools';
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
import PlanMore from '../pages/projectReport/more/PlanMore';
import OrganizationModal from '../pages/training/tabs/components/OrganizationModal';
import TrainingContextProvider from '../context/TrainingContext';

const { Sider, Content } = Layout;

let menus = [];

function Admin() {
  const toolsStore = useToolsStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);
  const isLoggged = localStorage.getItem('token');
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
  };

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (!isLoggged) {
      history.push('/login');
    } else {
      getService('/menus/getByToken').then(resultMenu => {
        if (resultMenu) {
          menus = resultMenu;
          setRoutes(generateRoutes(resultMenu));
        }
      });
      if (!toolsStore.orgList) {
        getService('organization/getAll').then(resultOrg => {
          if (resultOrg) {
            toolsStore.setOrgList(resultOrg || []);
          }
        });
      }
      if (!toolsStore.partnerList) {
        getService('organization/getAllForTunshlegch').then(resultPartner => {
          if (resultPartner) {
            toolsStore.setPartnerList(resultPartner || []);
          }
        });
      }
      if (!toolsStore.countryList) {
        getService('country/get').then(resultCountry => {
          if (resultCountry) {
            toolsStore.setCountryList(resultCountry || []);
          }
        });
      }
      if (!toolsStore.aimagList) {
        getService('aimag/get').then(resultAimag => {
          if (resultAimag) {
            toolsStore.setAimagList(resultAimag || []);
          }
        });
      }
      if (!toolsStore.user) {
        getService(`/user/get/${localStorage.getItem('userId')}`).then(
          resultUser => {
            if (resultUser) {
              toolsStore.setUser(resultUser || []);
            }
          }
        );
      }
    }
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
          {localStorage.getItem('orgName') === '' &&
          toolsStore.user.roleId !== 1 ? (
            <OrganizationModal
              isModalVisible={isModalVisible}
              close={closeModal}
              isOrg
              isEditMode
              orgId={localStorage.getItem('orgId')}
            />
          ) : (
            ''
          )}
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
                <TrainingContextProvider>
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
                    <Route path="/planDetail/:id">
                      <PlanMore />
                    </Route>
                  </Switch>
                </TrainingContextProvider>
              </ProjectContextProvider>
            </CriteriaContextProvider>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}
export default Admin;
