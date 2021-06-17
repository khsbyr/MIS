import React from "react";
import HeaderWrapper from "./plan.styled"
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined  } from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Upload, message, Form, Select, InputNumber, Checkbox, Table } from "antd";
import Pageheader from "../container/Layout/component/Pageheader";
import ContentWrapper  from "./guidelines.style";

function onChange(date, dateString) {
    console.log(date, dateString);
  }
const onSearch = (value) => console.log(value);
const { Dragger } = Upload;
const { Option } = Select;
const { RangePicker } = DatePicker;

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


const Guidelines = () => {
    return (
        <>
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={12} lg={9}>
                    <p className="title" style={{marginLeft: "45px"}}>Сургалтын удирдамж</p>
                </Col>
                <Col xs={24} md={12} lg={15} >
                </Col>      
            </Row>
        </HeaderWrapper>

        <ContentWrapper>
            <Row>
            <Col  xs={24} md={24} lg={10}>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сургалтын сэдэв:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сургалт зохион байгуулах үндэслэл:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сургалтын зорилго:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Хэрэгжүүлэх үйл ажиллагаа:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Хүлээгдэж буй үр дүн:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <p style={{color: "#7d7d7d", fontSize: "13px"}}>Сургалт зохион байгуулагдах газар:</p>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Аймаг, хот:">                              
                                        <Select
                                        placeholder="Аймаг, хот"
                                        allowClear 
                                        >
                                            <Option value="Ulaanbaatar">Улаанбаатар</Option>
                                            <Option value="Arkhangai">Архангай</Option>
                                            <Option value="other">other</Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сум, дүүрэг:">                              
                                        <Select
                                                placeholder="Сум, дүүрэг"
                                                allowClear         
                                                >
                                                    <Option value="Sukhbaatar">Сүхбаатар дүүрэг</Option>
                                                    <Option value="Bayangol">Баянгол</Option>
                                                    <Option value="other">other</Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Хаяг:"> 
                                        <Input.TextArea 
                                            style={{
                                                width: "100%",
                                                height: "110px"
                                            }}
                                        />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                </Col>
                <Col xs={24} md={24} lg={14}>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Сургалтын оролцогчид:"> 
                                    <Input.TextArea 
                                        style={{
                                            width: "100%",
                                            height: "110px"
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Сургалтын оролцогчид:">                              
                                    <Table dataSource={dataSource} columns={columns} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Суралцагч:">                              
                                    <Table dataSource={dataSource} columns={columns} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Сургалтын хугацаа:">                              
                                    <RangePicker/>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                        <Form.Item layout="vertical">
                            <Button type="primary" htmlType="submit" className="button">
                            Хадгалах
                            </Button>
                        </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ContentWrapper>
        </>
    )
}

export default Guidelines;