import { MenuOutlined } from '@ant-design/icons';
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
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Attendance from '../pages/training/training/attendance';
import Composition1 from '../pages/training/trainingplan/composition1';
import Criteria from '../pages/criteria/criteria';
import CV from '../pages/training/training/cv';
import Guidelines from '../pages/training/training/guidelines';
import Organization from '../pages/training/training/organization';
import Plan from '../pages/training/training/plan';
import TrainingProgram from '../pages/training/training/trainingProgram';
import TrainingReport from '../pages/training/training/trainingReport';
import Partnership from '../pages/partnership/partnership';
import TestAggregation from '../pages/training/training/testAggregation';
import Budget from '../pages/training/training/budget';
import User from '../pages/user/user';
import Role from '../pages/user/role';
import SignUpRequest from '../pages/user/signUpRequest';
import MenuSettings from '../pages/settings/MenuSettings';
import TrainingList from '../pages/TrainingList';
import TrainingInfo from '../pages/TraningInfo';
import Address from '../pages/directory/address';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const Admin = () => {
  const { t } = useTranslation();
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
                <Link to="/admin/signUpRequest">{t('signreq')}</Link>
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
            <Menu.Item key="50" icon={<FontAwesomeIcon icon={faLayerGroup} />}>
              <Link to="/admin/trainingList"> {t('training')}</Link>
            </Menu.Item>
            <SubMenu
              key="sub3"
              icon={<FontAwesomeIcon icon={faLayerGroup} />}
              title={t('training1')}
            >
              <Menu.Item key="8">
                <Link to="/admin/organization">{t('consulting_orga')}</Link>
              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/admin/guidelines">{t('training_intro')}</Link>
              </Menu.Item>
              <Menu.Item key="10">
                <Link to="/admin/plan">{t('training_team')}</Link>
              </Menu.Item>
              <Menu.Item key="11">
                <Link to="/admin/cv">{t('cv_teachers')}</Link>
              </Menu.Item>
              <Menu.Item key="12">
                <Link to="/admin/training_program">
                  {t('training_program')}
                </Link>
              </Menu.Item>
              <Menu.Item key="13">
                <Link to="/admin/attendance">
                  {t('attendance_registration')}
                </Link>
              </Menu.Item>
              <Menu.Item key="14">
                <Link to="/admin/test_aggregation">
                  {t('test_aggregation')}
                </Link>
              </Menu.Item>
              <Menu.Item key="15">
                <Link to="/admin/training_report">{t('training_report')}</Link>
              </Menu.Item>
              <Menu.Item key="16">
                <Link to="/admin/budget">{t('training_budget')}</Link>
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
                  <Link to="/admin/partnership">{t('consulting_orga')}</Link>
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
                  <Link to="/admin/partnership">{t('brief_draft')}</Link>
                </Menu.Item>
                <Menu.Item key="19">
                  {' '}
                  <Link to="/admin/partnership">{t('investment')}</Link>
                </Menu.Item>
                <Menu.Item key="20">
                  {' '}
                  <Link to="/admin/partnership">{t('income_expenses')}</Link>
                </Menu.Item>
                <Menu.Item key="21">
                  {' '}
                  <Link to="/admin/partnership">{t('consulting_orga')}</Link>
                </Menu.Item>
                <Menu.Item key="22">
                  {' '}
                  <Link to="/admin/partnership">{t('detailed_project')}</Link>
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
                {' '}
                <Link to="/admin/address">{t('address')}</Link>
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
            <SubMenu
              key="sub11"
              icon={<FontAwesomeIcon icon={faUserAlt} />}
              title={t('settings')}
            >
              <Menu.Item key="1" icon={<FontAwesomeIcon icon={faUserAlt} />}>
                {' '}
                <Link to="/admin/menu">{t('menu')}</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
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
              <Route exact path="/admin/user">
                <User />
              </Route>
              <Route exact path="/admin/role">
                <Role />
              </Route>
              <Route exact path="/admin/signUpRequest">
                <SignUpRequest />
              </Route>
              <Route exact path="/admin/criteria">
                <Criteria />
              </Route>
              <Route path="/admin/guidelines">
                <Guidelines />
              </Route>
              <Route path="/admin/plan">
                <Plan />
              </Route>
              <Route path="/admin/partnership">
                <Partnership />
              </Route>
              <Route path="/admin/organization">
                <Organization />
              </Route>
              <Route path="/admin/cv">
                <CV />
              </Route>
              <Route path="/admin/training_report">
                <TrainingReport />
              </Route>
              <Route path="/admin/composition1">
                <Composition1 />
              </Route>
              <Route path="/admin/training_program">
                <TrainingProgram />
              </Route>
              <Route path="/admin/attendance">
                <Attendance />
              </Route>
              <Route path="/admin/test_aggregation">
                <TestAggregation />
              </Route>
              <Route path="/admin/budget">
                <Budget />
              </Route>
              <Route exact path="/admin/menu">
                <MenuSettings />
              </Route>
              <Route exact path="/admin/trainingList">
                <TrainingList />
              </Route>
              <Route exact path="/admin/trainingList/:id">
                <TrainingInfo />
              </Route>
              <Route exact path="/admin/address">
                <Address />
              </Route>
            </Switch>{' '}
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
export default Admin;
