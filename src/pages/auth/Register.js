import React, { useEffect, useState, useContext } from 'react';
import 'antd/dist/antd.css';
import { Button, Row, Col, Form, Input, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { LogIn } from './Login.style';
import Partner from './components/Partner';
import { postService, getService } from '../../service/service';
import { requireFieldFocus, errorCatch } from '../../tools/Tools';
import { ToolsContext } from '../../context/Tools';

function Register() {
  const { t } = useTranslation();
  const [userRoles, setUserRoles] = useState([]);
  const { Option } = Select;
  const toolsStore = useContext(ToolsContext);

  useEffect(() => {
    getService('/role/getAdmin').then(result => {
      setUserRoles(result);
    });
  }, []);

  const requestNewUser = values => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords don't match");
    } else {
      toolsStore.setIsShowLoader(true);
      const saveData = {
        username: values.username,
        email: values.email,
        password: values.password,
        isActive: true,
      };
      postService(`signUpRequest/post/${values.code}`, saveData)
        .then(() => {
          message.success('Таны хүсэлтийг хүлээн авлаа. ');
          window.location.href = '/login';
        })
        .finally(() => {
          toolsStore.setIsShowLoader(false);
        })
        .catch(error => {
          if (error?.response) {
            if (error?.response.status === 401) {
              message.error(error);
            } else errorCatch(error);
          } else errorCatch(error);
        });
    }
  };

  return (
    <Row>
      <Partner />
      <Col xs={24} md={24} lg={9} style={{ backgroundColor: '#F8F8F8' }}>
        <LogIn>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={requestNewUser}
            onFinishFailed={requireFieldFocus}
          >
            <Form.Item>
              <p className="title">{t('register_system')}</p>
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t('email')}</p>
            </Form.Item>
            <Form.Item
              name="email"
              className="underline"
              rules={[
                {
                  type: 'email',
                  message: 'И-мэйл буруу байна!',
                },
                {
                  required: true,
                  message: 'Энэ хэсгийг заавал бөглөнө үү!',
                },
              ]}
            >
              <Input placeholder={t('email')} bordered={false} />
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t('username')}</p>
            </Form.Item>
            <Form.Item
              name="username"
              className="underline"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
              <Input placeholder={t('username')} bordered={false} />
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t('user_role')}</p>
            </Form.Item>
            <Form.Item name="code" className="underline">
              <Select
                placeholder="Хэрэглэгчийн төрөл"
                style={{ width: '100%' }}
                bordered={false}
                allowClear
              >
                {userRoles &&
                  userRoles.map((userRole, index) => (
                    <Option key={index} value={userRole.id}>
                      {userRole.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t('password')}</p>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="**************"
                bordered={false}
                className="underline"
              />
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t('confirm_pass')}</p>
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
              <Input
                type="password"
                placeholder="**************"
                bordered={false}
                className="underline"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {t('register')}
              </Button>
            </Form.Item>
            <Form.Item>
              <p className="copyright">{t('rights_reserved')}</p>
            </Form.Item>
          </Form>
        </LogIn>
      </Col>
    </Row>
  );
}

export default Register;
