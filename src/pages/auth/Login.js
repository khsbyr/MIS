import {React , useState} from "react";
import "antd/dist/antd.css";
import { Button, Row, Col, Form, Input, message } from "antd";
import { LogIn } from "./Login.style";
import { useHistory } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import { postService } from "../../service/service";
import { errorCatch } from "../../tools/Tools";
import { isShowLoading } from '../../context/Tools';
import Partner from "./components/Partner";

function Login() {
  const {t} = useTranslation();
  const username = useFormInput('');
  const password = useFormInput('');


  const history = useHistory();

  function moveToRegister() {
    history.push("/register");
  }

  function handleLogin() {
    if(username.value && password.value) {
      isShowLoading(true);
      postService("user/login", {username:username.value, password:password.value})
      .then((result) => {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('myHID', result.data.userId);
        history.push("/admin");
      })
      .finally(() => {
        isShowLoading(false);
      })
      .catch((error) => {
        if (error?.response) {
          if (error?.response.status === 400) {
            message.error('Таны нэр нууц үг буруу байна!!!')
          }
          else if (error?.response.status === 401)
              message.warning('Системд нэвтрэхэд алдаа гарлаа')
          else
              errorCatch(error)
        }
        else errorCatch(error)
      });
    }
  }

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  
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
                <p className="title">{t('login_system')}</p>
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
              <Input placeholder={t('username')} {...username} bordered={false} />
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
                  {...password}
                  className="underline"
                />
              </Form.Item>
              <Form.Item>
                <a className="login-form-forgot" href="/forget-password">
                {t('forgot_pass')}
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={handleLogin}
                >
                  {t('login')}
                </Button>
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

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;
