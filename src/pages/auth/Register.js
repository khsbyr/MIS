import React from "react";
import "antd/dist/antd.css";
import { Button, Row, Col, Form, Input, Carousel } from "antd";
import TextWrapper, { LogIn } from "./Login.style";
import { useHistory } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import i18n from "../../i18n"

function Register() {
  const history = useHistory();
  const {t, i18} = useTranslation();
  function moveToRegister() {
    history.push("/register");
  }
  function moveToAdmin() {
    history.push("/admin");
  }
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  function onChange(a, b, c) {
    console.log(a, b, c);
  }
  const contentStyle = {
    height: '180px',
    fontSize: '16px',
    color: '#103154',
    textAlign: 'left',
  };

  return (
      <Row>
        <Col
          xs={0}
          md={0}
          lg={15}
          style={{ backgroundColor: "white", height: "100vh" }}
        >
          <TextWrapper>
            <h2 className="title">
              {t("login_title")}  
            </h2>
            <h3 className="subTitle">{t("login_subtitle")}</h3>
            <h2 className="title" style={{ marginTop: "50px" }}>
            {t("project_background")}
            </h2>
            <Carousel auto afterChange={onChange}  style={{height:"160px", width:"510px"}}>
              <div>           
                <p style={contentStyle}>
                {t("background_content")}
                </p>             
              </div>
              <div>
                <p style={contentStyle}>
                {t("background_content")}
                </p>  
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
          </Carousel> 
            <h2 className="title" style={{ marginTop: "80px", marginBottom: "30px" }}>
            {t("partner")}
            </h2>
            <Row gutter={[32,32]}>
              <Col >
                <img
                  src="/images/svg/logo2.svg"
                  className="icon"
                  alt="card-icon"
                
                />
                </Col>
                <Col>
                <img
                  src="/images/svg/logo1.svg"
                  className="icon"
                  alt="card-icon"
                />
              </Col>
              <Col>
                <img
                  src="/images/svg/logo3.svg"
                  className="icon"
                  alt="card-icon"
                  />
                </Col>
                <Col>
                <img
                  src="/images/svg/logo4.svg"
                  className="icon"
                  alt="card-icon"
                  />
                </Col>
              </Row>
          </TextWrapper>
        </Col>

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
                  onClick={moveToRegister}
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
