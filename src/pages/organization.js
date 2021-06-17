import React from "react";
import HeaderWrapper from "./plan.styled"
import ContentWrapper  from "./organization.style";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined  } from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Upload, message, Form, Select, InputNumber, Checkbox } from "antd";
import Pageheader from "../container/Layout/component/Pageheader";
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

const Orgoanization = () => {
    return (
        <>
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={12} lg={9}>
                    <p className="title" style={{marginLeft: "45px"}}>Байгууллага</p>
                </Col>
                <Col xs={24} md={12} lg={15} >
                    <Pageheader/>
                </Col>      
            </Row>
            <Row>
                <Col>

                </Col>
            </Row>
        </HeaderWrapper>

      <ContentWrapper>
        <Row gutter={[72]}>
            <Col  xs={24} md={24} lg={4}>
                <Dragger {...props} style={{}}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                   
                    <p className="ant-upload-hint">
                    Зураг оруулах
                    </p>
                </Dragger>
              
            </Col>
            <Col  xs={24} md={24} lg={10}>
                  <h2 className="title"> Байгууллагын мэдээлэл</h2>
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Байгууллагын нэр:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Регистрийн дугаар:">                              
                                <Input />
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Банкны нэр:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Дансны нэр:">                              
                                <Input />
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
                  <Row gutter={32}> 
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Дансны дугаар:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Дансны вальют:">                              
                                <Select
                                placeholder="Вальют"
                                allowClear
                                >
                                    <Option value="tugrug">Төгрөг</Option>
                                    <Option value="dollar">$</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>

                  <h2 className="title">Холбоо барих мэдээлэл</h2>
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
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
                      <Col xs={24} md={24} lg={12}>
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
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Баг, хороо:">                              
                                <Select
                                        placeholder="Баг, хороо"
                                        allowClear
       
                                        >
                                            <Option value="1khoroo">1-р хороо</Option>
                                            <Option value="2khoroo">2-р хороо</Option>
                                            <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Утас:">                              
                                <Input />
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Е-майл хаяг:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Веб хаяг:">                              
                                <Input />
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
                  <Row>
                      <Col xs={24} md={24} lg={24}>
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
            <Col  xs={24} md={24} lg={10}>
                <h2 className="title">Хариуцсан ажилтан:</h2>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Овог:">                              
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Нэр:">                              
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Регистрийн дугаар:">                              
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Албан тушаал:">                              
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Утасны дугаар:">                              
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Е-майл хаяг:">                              
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item label="Танилцуулга оруулах:">                              
                                <Upload {...props}>
                                    <Button icon={<UploadOutlined />}  style={{height: "40px"}}>Танилцуулга оруулах</Button>
                                </Upload>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
                            <Form layout="vertical">
                                <Form.Item>                              
                                    <Checkbox onChange={onChange}>Оруулсан мэдээлэл үнэн болно.</Checkbox>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={12}>
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

export default Orgoanization;