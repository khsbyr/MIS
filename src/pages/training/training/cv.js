import React from "react";
import HeaderWrapper from "../training/components/plan.styled";
import ContentWrapper  from "./components/cv.styled";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined , UserOutlined } from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Upload, message, Form, Select, InputNumber, Checkbox, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import Pageheader from "../container/Layout/component/Pageheader";
import { faCalendarAlt, faEnvelope, faHome, faPhone, faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";
function onChange(date, dateString) {
    console.log(date, dateString);
  }
const onSearch = (value) => console.log(value);
const { Dragger } = Upload;
const { Option } = Select;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

const CV = () => {
    return (
        <>
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={24} lg={9}>
                    <p className="title" style={{marginLeft: "45px"}}>Сургагч байгшийн CV</p>
                </Col>
                <Col xs={24} md={12} lg={15} >
                </Col>      
            </Row>
        </HeaderWrapper>

        <ContentWrapper>
            <h1 className="title">1. Хувь хүний мэдээлэл</h1>
            <Row>
                
                <Col xs={24} md={24} lg={4}>
                    <Dragger {...props} style={{}}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-hint">
                        Зураг оруулах
                        </p>
                    </Dragger>            
                </Col>
                <Col xs={24} md={24} lg={2}>
                </Col>
                <Col xs={24} md={24} lg={9}>
                    <Form>
                        <Form.Item>                   
                            <Input className="FormItem" placeholder="Овог, нэр:" prefix={<FontAwesomeIcon icon={faUser}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Төрсөн огноо:" prefix={<FontAwesomeIcon icon={faCalendarAlt}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem"placeholder="Регистрийн дугаар:" prefix={<FontAwesomeIcon icon={faUserEdit}/>}/>
                        </Form.Item>
                    </Form>
                </Col>

                <Col xs={24} md={24} lg={9}>
                <Form>
                    <Form.Item>
                            <Input className="FormItem"placeholder="Хаяг:" prefix={<FontAwesomeIcon icon={faHome}/>}/>
                    </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Утас, факс:" prefix={<FontAwesomeIcon icon={faPhone}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="И-мэйл хаяг:" prefix={<FontAwesomeIcon icon={faEnvelope}/>}/>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <h1 className="title">2. Ажлын зорилго</h1>
            <Row>
                <Col xs={24} md={24} lg={22}>
                    <Form layout="vertical">
                        <Form.Item> 
                            <Input.TextArea 
                                placeholder="(Горилж буй ажлын зорилгоо товч бичнэ үү)"
                                style={{
                                    width: "100%",
                                    height: "110px",                                  
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <h1 className="title">3. Боловсрол</h1>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h1 className="title">4. Ажлын туршлага</h1>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h1 className="title">5. Зөвлөх үйлчилгээний ажлын туршлага</h1>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h1 className="title">6. Башгийн ажлын туршлага</h1>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h1 className="title">10. Ур чадвар</h1>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Input.TextArea 
                        placeholder="(Өөрийн давуу тал, ур чадвараа нэрлэнэ үү)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} lg={22}>
                    <Form.Item style={{marginTop: "20px"}}>
                        <Button type="primary" htmlType="submit" className="button">
                        Хадгалах
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </ContentWrapper>
        </>
    )
}

export default CV;