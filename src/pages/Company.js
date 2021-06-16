import React from "react";
import HeaderWrapper from "./plan.styled"
import ContentWrapper  from "./Company.style";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined  } from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Upload, message, Form, Select } from "antd";
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

const Company = () => {
    return (
        <>
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={12} lg={9}>
                    <p className="title">Сургалтын төлөвлөгөө</p>
                </Col>
                <Col xs={24} md={12} lg={15} >
                    <Row> 
                        <Col xs={8} md={8} lg={6}>
                            <DatePicker 
                                onChange={onChange}
                                bordered={false}                          
                                suffixIcon={<DownOutlined/>}
                                placeholder="Select year"
                                picker="year"
                                className="DatePicker"
                                style={{
                                    width: "120px",
                                    color: "black",
                                    cursor: "pointer",
                                }}
                                />
                        </Col>
                        <Col xs={8} md={8} lg={6}>
                            <Input 
                                placeholder="Хайлт хийх" 
                                allowClear 
                                prefix={<SearchOutlined />}
                                bordered={false}
                                onSearch={onSearch} 
                                style={{ 
                                    width: 150,
                                    borderBottom: "1px solid #103154"
                                }} />
                        </Col>
                        <Col xs={8} md={8} lg={4}>
                            <Button icon={<CopyOutlined />}>Хэвлэх</Button>
                        </Col>
                        <Col xs={8} md={8} lg={4}>
                            <Button icon={<CopyOutlined />}>Экспорт</Button>
                        </Col>
                        <Col xs={8} md={8} lg={4}>
                            <Button icon={<CopyOutlined />}>Нэмэх</Button>
                        </Col>
                    </Row>
                </Col>      
            </Row>
            <Row>
                <Col>

                </Col>
            </Row>
        </HeaderWrapper>

      <ContentWrapper>
        <Row>
            <Col  xs={24} md={24} lg={6}>
                <Dragger {...props} style={{}}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    {/* <p className="ant-upload-text">Зураг оруулах</p> */}
                    <p className="ant-upload-hint">
                    Зураг оруулах
                    </p>
                </Dragger>
            </Col>
            <Col  xs={24} md={24} lg={10}>
                  <h2 className="title"> Байгууллагын мэдээлэл</h2>
                  <Row>
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
                  <Row>
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
                  <Row>
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
                                style={{
                                    width: "290px",
                                    borderRadius: "3px"

                                }}
                                >
                                    <Option value="tugrug">Төгрөг</Option>
                                    <Option value="dollar">$</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
            </Col>
            <Col  xs={24} md={24} lg={8}>
                  <h2> sd</h2>
            </Col>
        </Row>
        </ContentWrapper>
        </>
    )
}

export default Company;