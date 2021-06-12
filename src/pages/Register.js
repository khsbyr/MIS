import React from "react";
import 'antd/dist/antd.css';
import { Header } from "antd/lib/layout/layout";
import { Button, Row, Col, Form, Input  } from "antd";
import {EnvironmentFilled, GlobalOutlined, PhoneFilled, MailFilled } from '@ant-design/icons';
import TextWrapper, {LogIn} from "./Login.style"

const Register = () => {
    
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    }; 
    
    return (
        <>
        <Header style={{backgroundColor: "#103154"}}>
            <Row>
                <Col xs={24} md={15}>
                    
                    <p style={{color: "white", float: "left", marginLeft: "80px"}}><EnvironmentFilled/> Монгол Улс, Улаанбаатар, 1-р хороо, Сүхбаатар дүүрэг, Парк плэйс оффис, 602 тоот</p>
                </Col>
                <Col xs={24} md={9}>
                    <Row style={{color: "white", cursor: "pointer"}}>
                        <Col span={6}><p>И-мэйл шалгах:</p></Col>
                        <Col span={6}><p><MailFilled /> info@lcp.mn</p></Col>
                        <Col span={6}><p><PhoneFilled /> 70104041</p></Col>
                        <Col span={6}><p><GlobalOutlined /> Монгол</p></Col>
                    </Row>
                </Col>
            </Row>
        </Header>
        <Row >
           
            <Col xs={24} md={24} lg={14}  style={{backgroundColor:'white', height: '93vh'}}>
                <TextWrapper>
                    <h2 className="title">МАЛ АЖ АХУЙН ЭДИЙН ЗАСГИЙН <br/> ЭРГЭЛТИЙГ НЭМЭГДҮҮЛЭХ ТӨСӨЛ</h2>
                    <h3 className="subTitle">МЭДЭЭЛЭЛИЙН УДИРДЛАГЫН СИСТЕМ</h3>
                    <h2 className="title" style={{marginTop: "50px"}}>Төслийн зорилго:</h2>
                    <p className="subTitle1">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p> 
                    <h2 className="title" style={{marginTop: "50px"}}>Хамтран ажиллагч байгууллагууд:</h2>
                </TextWrapper>
            </Col>
        
            <Col xs={24} md={24} lg={10} style={{backgroundColor:'#F8F8F8'}}>
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
                            message: 'Please input your Email!',
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
                            message: 'Please input your Username!',
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
                        <p className="subTitle">Нууц үг давтах</p>
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
                        <Button type="primary" htmlType="submit" className="register-form-button2">
                        Бүртгүүлэх
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <p className="copyright">©2021 Мал аж ахуйн эдийн засгийн эргэлтийг нэмэгдүүлэх төсөл. Бүх эрх хуулиар хамгаалагдсан</p>
                    </Form.Item>
                </Form>
                </LogIn>
            </Col>
        </Row>
        </>
    )
}

export default Register;