import { React, useState, useContext } from 'react';
import 'antd/dist/antd.css';
import { Button, Row, Col, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from './Login.style';
import { postService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import { ToolsContext } from '../../context/Tools';
import Partner from './components/Partner';
import Header from '../../layout/header';

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

function ForgetPassword() {
  const { t } = useTranslation();
  const email = useFormInput('');
  const toolsStore = useContext(ToolsContext);

  const history = useHistory();

  function handleForgetPassword() {
    if (email.value) {
      toolsStore.setIsShowLoader(true);
      postService('user/forgetPassword', { resetEmailOrUsername: email.value })
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
    } else message.error('Бүртгэлтэй Имэйл хаягаа оруулна уу!!!');
  }

  return (
    <>
      <Header />
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
                <p className="title">{t('forget_password')}</p>
              </Form.Item>
              <Form.Item>
                <p className="subTitle">{t('email')}</p>
              </Form.Item>
              <Form.Item
                name="email"
                className="underline"
                rules={[
                  {
                    required: true,
                    message: 'Энэ хэсгийг заавал бөглөнө үү!',
                  },
                ]}
              >
                <Input placeholder={t('email')} {...email} bordered={false} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  className="reset-form-button"
                  onClick={handleForgetPassword}
                >
                  {t('send_password')}
                </Button>
              </Form.Item>

              <Form.Item>
                <p className="copyright">{t('rights_reserved')}</p>
              </Form.Item>
            </Form>
          </LogIn>
        </Col>
      </Row>
    </>
  );
}

export default ForgetPassword;
