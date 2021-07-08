import React from "react";
import "antd/dist/antd.css";
import { Button, Row, Col, Form, Input, Select } from "antd";
import { LogIn } from "./Login.style";
import { useHistory } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import Partner from "./components/Partner";
import { putService, getService } from "../../service/service";
function Register() {

  const history = useHistory();
  const {t} = useTranslation();
  function moveToLogin() {
    history.push("/login");
  }
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
      <Row>
        <Partner></Partner>
        <Col xs={24} md={24} lg={9} style={{ backgroundColor: "#F8F8F8" }}>
          <LogIn>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
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
                    required: true,
                    message: "Please input your Email!",
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
                    message: "Please input your Username!",
                  },
                ]}
              >
              <Input placeholder={t('username')} bordered={false} />
              </Form.Item>
              
              <Form.Item>
                <p className="subTitle">Сонго</p>
              </Form.Item>
              <Form.Item
                name="asd"
                className="underline"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                  <Select placeholder="songoh" style={{ width: "100%" }} onChange={handleChange} bordered={false} allowClear>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
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
                    message: "Please input your Password!",
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
                name="password1"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
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
                <a className="login-form-forgot" href="/">
                {t('forgot_pass')}
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="ghost"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={moveToLogin}
                >
                  {t('register')}
                </Button>
              </Form.Item>

              <Form.Item>
                <p className="copyright">
                {t('rights_reserved')}
                </p>
              </Form.Item>
            </Form>
          </LogIn>
        </Col>
      </Row>
  );
}

export default Register;
