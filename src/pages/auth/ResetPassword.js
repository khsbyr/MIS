import { React, useState, useContext } from 'react';
import 'antd/dist/antd.css';
import { Button, Row, Col, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { LogIn } from './Login.style';
import { putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import { ToolsContext } from '../../context/Tools';
import Partner from './components/Partner';

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

function ResetPassword() {
  const { t } = useTranslation();

  const history = useHistory();
  const value = queryString.parse(history.location.search);
  localStorage.setItem('token', value.token);
  const password = useFormInput('');
  const repeatPassword = useFormInput('');
  const toolsStore = useContext(ToolsContext);

  function handleResetPassword() {
    if (password.value !== repeatPassword.value) {
      message.error("Passwords don't match");
    } else {
      toolsStore.setIsShowLoader(true);
      putService('user/resetPassword', {
        newPassword: password.value,
        repeatPassword: repeatPassword.value,
      })
        .then(() => {
          message.success('The email was sent successfully');
          history.push('/login');
        })
        .finally(() => {
          toolsStore.setIsShowLoader(false);
        })
        .catch(error => {
          if (error?.response) {
            if (error?.response.status === 400) {
              message.error('Хэрэглэгч олдсонгүй!');
            } else if (error?.response.status === 401) {
              message.warning('Системд алдаа гарлаа');
            } else {
              errorCatch(error);
            }
          } else errorCatch(error);
        });
    }
  }

  return (
    <Row>
      <Partner />
      <Col xs={24} md={24} lg={9} style={{ backgroundColor: '#F8F8F8' }}>
        <LogIn>
          <Form
            name="forget_password"
            className="forget-password-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item>
              <p className="title">{t('reset_password')}</p>
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
                {...password}
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
                {...repeatPassword}
                bordered={false}
                className="underline"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                className="reset-form-button"
                onClick={handleResetPassword}
              >
                {t('reset_password')}
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

export default ResetPassword;
