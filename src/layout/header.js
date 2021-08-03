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
          <Col xs={24} md={15} lg={15}>
            <p
              style={{ color: 'white', float: 'left', marginLeft: '80px' }}
              className="texthide"
            >
              <EnvironmentFilled /> Монгол Улс, Улаанбаатар, 1-р хороо,
              Сүхбаатар дүүрэг, Парк плэйс оффис, 602 тоот
            </p>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Row justify="end" style={{ color: 'white', cursor: 'pointer' }}>
              <Col lg={6}>
                <p className="texthide">
                  <MailFilled /> info@lcp.mn
                </p>
              </Col>
              <Col xs={12} lg={6} md={12}>
                <p className="textshow">
                  <PhoneFilled /> 70104041
                </p>
              </Col>
              <Col xs={12} lg={6} md={12}>
                <Select
                  defaultValue="MN"
                  style={{ width: 80, color: 'blue' }}
                  onChange={handleChange}
                >
                  <Option value="mn">MN</Option>
                  <Option value="en">EN</Option>
                </Select>
              </Col>
              {localStorage.getItem('token') ? (
                <Col xs={12} lg={6} md={12}>
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
