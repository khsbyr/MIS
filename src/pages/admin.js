/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CaretDownOutlined,
  MenuOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import {
  faClipboardCheck,
  faFileSignature,
  faHandsHelping,
  faLayerGroup,
  faList,
  faListAlt,
  faProjectDiagram,
  faUserAlt,
  faUserCheck,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Col, Divider, Dropdown, Layout, Menu, Row } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import Attendance from './training/training/attendance';
import Composition1 from './training/trainingplan/composition1';
import Composition2 from './training/trainingplan/composition2';
import Composition3 from './training/trainingplan/composition3';
import Composition4 from './training/trainingplan/composition4';
import Criteria from './criteria/criteria';
import CV from './training/training/cv';
import Guidelines from './training/training/guidelines';
import Organization from './training/training/organization';
import Plan from './training/training/plan';
import TrainingProgram from './training/training/trainingProgram';
import TrainingReport from './training/training/trainingReport';
import Partnership from './partnership/partnership';
import TestAggregation from './training/training/testAggregation';
import Budget from './training/training/budget';
import User from './user/user';
import Role from './user/role';
import Signuprequest from './user/signuprequest';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Admin = () => {
  const { t } = useTranslation();

  const history = useHistory();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  }

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
            style={{
              height: '100%',
              borderRight: 0,
              marginTop: '75px',
              background: '#fff',
            }}
          >
            {' '}
            <SubMenu
              key="sub1"
              icon={<FontAwesomeIcon icon={faUserAlt} />}
              title={t('user')}
            >
              <Menu.Item key="1" icon={<FontAwesomeIcon icon={faUserAlt} />}>
                {' '}
                <Link to="/admin/user">{t('user')}</Link>
              </Menu.Item>{' '}
              <Menu.Item key="2" icon={<FontAwesomeIcon icon={faUserCog} />}>
                {' '}
                <Link to="/admin/role">{t('user_role')}</Link>
              </Menu.Item>
              <Menu.Item key="52" icon={<FontAwesomeIcon icon={faUserCheck} />}>
                {' '}
                <Link to="/admin/signuprequest">{t('signreq')}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<FontAwesomeIcon icon={faClipboardCheck} />}
              title={t('criteria')}
            >
              <Menu.Item
                key="3"
                icon={<FontAwesomeIcon icon={faClipboardCheck} />}
              >
                {' '}
                <Link to="/admin/criteria">{t('criteria_regist')}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              icon={<FontAwesomeIcon icon={faLayerGroup} />}
              title={t('training')}
            >
              <Menu.Item key="8">
                <Link to="/admin//organization">{t('consulting_orga')}</Link>
              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/admin//guidelines">{t('training_intro')}</Link>
              </Menu.Item>
              <Menu.Item key="10">
                <Link to="/admin//plan">{t('training_team')}</Link>
              </Menu.Item>
              <Menu.Item key="11">
                <Link to="/admin//cv">{t('cv_teachers')}</Link>
              </Menu.Item>
              <Menu.Item key="12">
                <Link to="/admin//training_program">
                  {t('training_program')}
                </Link>
              </Menu.Item>
              <Menu.Item key="13">
                <Link to="/admin//attendance">
                  {t('attendance_registration')}
                </Link>
              </Menu.Item>
              <Menu.Item key="14">
                <Link to="/admin//test_aggregation">
                  {t('test_aggregation')}
                </Link>
              </Menu.Item>
              <Menu.Item key="15">
                <Link to="/admin//training_report">{t('training_report')}</Link>
              </Menu.Item>
              <Menu.Item key="16">
                <Link to="/admin//budget">{t('training_budget')}</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub6"
              icon={<FontAwesomeIcon icon={faHandsHelping} />}
              title={t('partnership')}
            >
              <SubMenu
                key="sub7"
                icon={<FontAwesomeIcon icon={faHandsHelping} />}
                title={t('productive_project')}
              >
                {' '}
                <Menu.Item key="17">
                  {' '}
                  <Link to="/admin//partnership">{t('consulting_orga')}</Link>
                </Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub8"
              icon={<FontAwesomeIcon icon={faProjectDiagram} />}
              title={t('project')}
            >
              <SubMenu
                key="sub9"
                icon={<FontAwesomeIcon icon={faProjectDiagram} />}
                title={t('productive_project')}
              >
                {' '}
                <Menu.Item key="18">
                  {' '}
                  <Link to="/admin//partnership">{t('brief_draft')}</Link>
                </Menu.Item>
                <Menu.Item key="19">
                  {' '}
                  <Link to="/admin//partnership">{t('investment')}</Link>
                </Menu.Item>
                <Menu.Item key="20">
                  {' '}
                  <Link to="/admin//partnership">{t('income_expenses')}</Link>
                </Menu.Item>
                <Menu.Item key="21">
                  {' '}
                  <Link to="/admin//partnership">{t('consulting_orga')}</Link>
                </Menu.Item>
                <Menu.Item key="22">
                  {' '}
                  <Link to="/admin//partnership">{t('detailed_project')}</Link>
                </Menu.Item>
              </SubMenu>
            </SubMenu>
            <Menu.Item key="23" icon={<FontAwesomeIcon icon={faListAlt} />}>
              {t('plan')}
            </Menu.Item>
            <Menu.Item
              key="24"
              icon={<FontAwesomeIcon icon={faFileSignature} />}
            >
              {t('report')}
            </Menu.Item>
            <Menu.Item key="25" icon={<FontAwesomeIcon icon={faList} />}>
              {t('dashboard')}
            </Menu.Item>
            <SubMenu
              key="sub10"
              icon={<FontAwesomeIcon icon={faLayerGroup} />}
              title={t('directory_regis')}
            >
              <Menu.Item
                key="26"
                icon={<FontAwesomeIcon icon={faLayerGroup} />}
              >
                {t('scope')}
              </Menu.Item>
              <Menu.Item
                key="27"
                icon={<FontAwesomeIcon icon={faLayerGroup} />}
              >
                {t('address')}
              </Menu.Item>
              <Menu.Item
                key="28"
                icon={<FontAwesomeIcon icon={faLayerGroup} />}
              >
                {t('contact_side')}
              </Menu.Item>
              <Menu.Item
                key="29"
                icon={<FontAwesomeIcon icon={faLayerGroup} />}
              >
                {t('criteria_type')}{' '}
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              backgroundColor: 'white',
              height: '50px',
              lineHeight: '50px',
            }}
          >
            <Row>
              <Col span={24} style={{ textAlign: 'end ' }}>
                <div>
                  <Avatar
                    size="small"
                    style={{
                      color: '#f56a00',
                      backgroundColor: '#103154',
                      marginRight: '5px',
                    }}
                  >
                    A
                  </Avatar>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="0"
                          onClick={e => {
                            handleLogout();
                          }}
                        >
                          <PoweroffOutlined />
                          <a style={"color: 'black', paddingLeft: '0px'"}>
                            Logout
                          </a>
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <a
                      className="ant-dropdown-link"
                      style={{ color: '#103154', marginRight: '5px' }}
                    >
                      user
                      <CaretDownOutlined />
                    </a>
                  </Dropdown>
                </div>
              </Col>
            </Row>
            <Divider
              style={{
                position: 'relative',
                left: '0px',
                backgroundColor: '#103154',
                margin: '0px 0px',
                width: '100%',
                minWidth: '100%',
              }}
            />
          </Header>
          <Content
            className="site-layout-background"
            style={{
              padding: 0,
              margin: 0,
              minHeight: '100%',
            }}
          >
            <Switch>
              <Route exact path="/admin/user">
                <User />
              </Route>
              <Route exact path="/admin/role">
                <Role />
              </Route>
              <Route exact path="/admin/signuprequest">
                <Signuprequest />
              </Route>
              <Route exact path="/admin/criteria">
                <Criteria />
              </Route>
              <Route path="/admin//guidelines">
                <Guidelines />
              </Route>
              <Route path="/admin//plan">
                <Plan />
              </Route>
              <Route path="/admin//partnership">
                <Partnership />
              </Route>
              <Route path="/admin//organization">
                <Organization />
              </Route>
              <Route path="/admin//cv">
                <CV />
              </Route>
              <Route path="/admin//training_report">
                <TrainingReport />
              </Route>
              <Route path="/admin//composition1">
                <Composition1 />
              </Route>
              <Route path="/admin//composition2">
                <Composition2 />
              </Route>
              <Route path="/admin//composition3">
                <Composition3 />
              </Route>
              <Route path="/admin//composition4">
                <Composition4 />
              </Route>
              <Route path="/admin//training_program">
                <TrainingProgram />
              </Route>
              <Route path="/admin//attendance">
                <Attendance />
              </Route>
              <Route path="/admin//test_aggregation">
                <TestAggregation />
              </Route>
              <Route path="/admin//budget">
                <Budget />
              </Route>
            </Switch>{' '}
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
export default Admin;
