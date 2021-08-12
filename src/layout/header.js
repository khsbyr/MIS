/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  EnvironmentFilled,
  MailFilled,
  PhoneFilled,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Layout, Row, Select, Menu, Dropdown, Avatar, Button } from 'antd';
import 'antd/dist/antd.css';
import { React, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import i18n from '../i18n';
import HeaderWrapper from './header.style';
import { ToolsContext } from '../context/Tools';

const { Option } = Select;
const { Header } = Layout;

const AvatarDropdown = () => {
  const history = useHistory();
  function logout() {
    localStorage.removeItem('token');
    history.push('/login');
  }
  return (
    <Menu className="app-header-dropdown">
      <Menu.Item key="3">
        <Link to="/" onClick={logout}>
          <Button type="link" icon={<PoweroffOutlined />}>
            Гарах
          </Button>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

const Headers = () => {
  const toolsStore = useContext(ToolsContext);

  function handleChange(value) {
    i18n.changeLanguage(value);
  }

  return (
    <HeaderWrapper>
      <Header
        style={{
          backgroundColor: '#103154',
          height: '50px',
          lineHeight: '50px',
        }}
      >
        <Row justify="start">
          <Col xs={0} md={0} lg={17}>
            <p style={{ color: 'white', float: 'left', marginLeft: '50px' }}>
              <EnvironmentFilled /> Монгол Улс, Улаанбаатар, 1-р хороо,
              Сүхбаатар дүүрэг, Парк плэйс оффис, 602 тоот
            </p>
          </Col>
          <Col xs={24} md={24} lg={7}>
            <Row justify="end" style={{ color: 'white', cursor: 'pointer' }}>
              <Col xs={0} md={0} lg={6}>
                <MailFilled /> info@lcp.mn
              </Col>
              <Col xs={3} md={3} lg={5}>
                <PhoneFilled /> 70104041
              </Col>
              <Col xs={5} md={2} lg={4}>
                <Select
                  defaultValue="MN"
                  className="selectArrow"
                  style={{ width: 70, color: 'blue' }}
                  onChange={handleChange}
                >
                  <Option value="mn">MN</Option>
                  <Option value="en">EN</Option>
                </Select>
              </Col>
              {localStorage.getItem('token') ? (
                <Col xs={8} md={4} lg={8}>
                  <Dropdown
                    className="list-inline-item"
                    overlay={<AvatarDropdown />}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <a className="ant-dropdown-link">
                      <Avatar icon={<UserOutlined />} />
                      <span className="avatar-text">
                        {localStorage.getItem('name')}
                      </span>
                    </a>
                  </Dropdown>
                </Col>
              ) : (
                ''
              )}
            </Row>
          </Col>
        </Row>
      </Header>
    </HeaderWrapper>
  );
};
export default Headers;
