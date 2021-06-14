import React from "react";
import "antd/dist/antd.css";
import { Button, Row, Col, Form, Input, Carousel} from "antd";
import TextWrapper, { LogIn } from "./Login.style";
import { useHistory } from "react-router-dom";

const Register = () => {
  const history = useHistory();
  function moveToLogin() {
    history.push("/login");
  }

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  function onChange(a, b, c) {
    console.log(a, b, c);
  }
  
  const contentStyle = {
    height: '180px',
    color: '#103154',
    textAlign: 'left',
   //backgroundColor: "blue"
  };

  return (
    <>
      <Row>
        <Col
          xs={24}
          md={24}
          lg={14}
          style={{ backgroundColor: "white", height: "93vh" }}
        >
          <TextWrapper>
            <h2 className="title">
              МАЛ АЖ АХУЙН ЭДИЙН ЗАСГИЙН <br /> ЭРГЭЛТИЙГ НЭМЭГДҮҮЛЭХ ТӨСӨЛ
            </h2>
            <h3 className="subTitle">МЭДЭЭЛЭЛИЙН УДИРДЛАГЫН СИСТЕМ</h3>
            <h2 className="title" style={{ marginTop: "50px" }}>
              Төслийн зорилго:
            </h2>
          <Carousel afterChange={onChange}  style={{height:"160px", width:"600px"}}>
              <div>           
                <p style={contentStyle} className="subTitle1">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy text
                  ever since  the 1500s Lorem Ipsum has been the industry's standard
                  dummy text ever since the 1500s
                </p>             
              </div>
              <div>
                <p style={contentStyle} className="subTitle1">
                It is a long established fact that a reader will be distracted by the 
                readable content of a page when looking at its layout. The point of using Lorem 
                Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 
                'Content here, content here', making it look like readable English. Many desktop publishing 
                </p>  
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
          </Carousel> 
            <h2 className="title" style={{ marginTop: "50px" }}>
              Хамтран ажиллагч байгууллагууд:
            </h2>
            <img
              src="/images/svg/logos.svg"
              className="icon"
              alt="card-icon"
              />
          </TextWrapper>
        </Col>

        <Col xs={24} md={24} lg={10} style={{ backgroundColor: "#F8F8F8" }}>
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
                <p className="title">СИСТЕМД БҮРТГҮҮЛЭХ</p>
              </Form.Item>
              <Form.Item>
                <p className="subTitle">И-Мэйл хаяг:</p>
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
                <Input placeholder="Example@yahoo.com" bordered={false} />
              </Form.Item>
              <Form.Item>
                <p className="subTitle">Хэрэглэгчийн нэр</p>
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
                <Input placeholder="Хэрэглэгчийн нэр" bordered={false} />
              </Form.Item>
              <Form.Item>
                <p className="subTitle">Нууц үг</p>
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
                <Input
                  type="password"
                  placeholder="**************"
                  bordered={false}
                  className="underline"
                />
              </Form.Item>
              <Form.Item>
                <p className="subTitle">Нууц үг давтах</p>
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
                <Input
                  type="password"
                  placeholder="**************"
                  bordered={false}
                  className="underline"
                />
              </Form.Item>
              <Form.Item>
                <a className="login-form-forgot" href="">
                  Нууц үг мартсан
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-form-button2"
                  onClick={moveToLogin}
                >
                  Бүртгүүлэх
                </Button>
              </Form.Item>

              <Form.Item>
                <p className="copyright">
                  ©2021 Мал аж ахуйн эдийн засгийн эргэлтийг нэмэгдүүлэх төсөл.
                  Бүх эрх хуулиар хамгаалагдсан
                </p>
              </Form.Item>
            </Form>
          </LogIn>
        </Col>
      </Row>
    </>
  );
};

export default Register;
