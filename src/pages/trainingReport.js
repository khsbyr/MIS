import { Typography, Row, Col, DatePicker, Input, Button, Table, Popconfirm, Form, Upload, message } from "antd"
import React, {Component} from "react"
import HeaderWrapper from "./plan.styled"
import ContentWrapper from "./trainingReport.style";
import { UploadOutlined  } from "@ant-design/icons";

const { Dragger } = Upload;

function onChange(date, dateString) {
    console.log(date, dateString);
  }

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

const TrainingReport = () => {
    return(    
        <>
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={12} lg={9}>
                    <p className="title">Сургалтын тайлан</p>
                </Col>
                <Col xs={24} md={12} lg={15} >
                    <Row> 
                    </Row>
                </Col>      
            </Row>
        </HeaderWrapper>

        <ContentWrapper>
            <Row>
                <Col xs={24} md={24} lg={7}>
                    <Form layout="vertical">
                        <Form.Item label="Сургалтын нэр:">                              
                            <Input className="FormItem"/>
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        <Form.Item label="Сургалтад хамрагдсан:">                              
                            <Input className="FormItem"/>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={24} md={24} lg={7}>
                    <Form layout="vertical">
                        <Form.Item label="Огноо:">                              
                            <DatePicker 
                            onChange={onChange} 
                            bordered={false}
                            />
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        <Form.Item label="Сургалт явуулсан байгууллага, хүний нэр:">                              
                            <Input className="FormItem"/>
                        </Form.Item>
                    </Form>
                </Col >
                <Col xs={24} md={24} lg={7}>
                    <Form layout="vertical">
                        <Form.Item label="Сургалт явагдсан газар:">                              
                            <Input className="FormItem"/>
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        <Form.Item label="Сургагч багшийн нэр:">                              
                            <Input className="FormItem"/>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={24} md={24} lg={3}>
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} lg={20}>
                    <h1 className="title">1. Сургалтын зорилго</h1>
                    <Input.TextArea 
                        placeholder="(Сургалтын бэлтгэл, өмнө тодорхойлсон сургалтын хэрэгцээ, сургалтын үйл ажиллагааны зорилтын талаар мэдээлнэ үү)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                    <h1 className="title">2. Сургалтын хөтөлбөр, төлөвлөгөөний  дагуу гүйцэтгэсэн ажил, сургалтын үйл явц: </h1>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12} lg={12}>
                            <Input.TextArea 
                                placeholder="(2.1. Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт)"
                                style={{
                                    width: "100%",
                                    height: "140px"
                                }}
                            />
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                            <Input.TextArea 
                                placeholder="(2.2. Хичээлийн явц, сургалтын хэлбэр, аргачлал)"
                                style={{
                                    width: "100%",
                                    height: "140px"
                                }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={[32, 32]} style={{marginTop: "32px"}}>
                        <Col xs={24} md={12} lg={12}>
                            <Input.TextArea 
                                placeholder="(2.3. Сургалтын тараах материал,  гарын авлагын тухай)"
                                style={{
                                    width: "100%",
                                    height: "140px"
                                }}
                            />
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                            <Input.TextArea 
                                placeholder="(2.4. Сургалтын танхим, зохион байгуулалтын тухай)"
                                style={{
                                    width: "100%",
                                    height: "140px"
                                }}
                            />
                        </Col>
                    </Row>
                    <h1 className="title">3. Амжилт, бэрхшээлийн тойм</h1>
                    <Input.TextArea 
                        placeholder="(Суралцагчид сургалтыг хэрхэн хүлээн авсан, сургалт бодит хэрэгцээг  хангасан эсэх, тулгарсан бэрхшээл, хэрхэн шийдвэрлэсэн тухай, сургалтын үнэлгээний санал асуулгын дүн  г.м.)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                    <h1 className="title">4. Гарсан үр дүн</h1>
                    <Input.TextArea 
                        placeholder="(Суралцагчид сургалтыг хэрхэн хүлээн авсан, сургалт бодит хэрэгцээг  хангасан эсэх, тулгарсан бэрхшээл, хэрхэн шийдвэрлэсэн тухай, сургалтын үнэлгээний санал асуулгын дүн  г.м.)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                    <h1 className="title">5. Зөвлөмж</h1>
                    <Input.TextArea 
                        placeholder="((Үйлчлүүлэгчдэд шаардлагатай цаашдын сургалт/зөвлөгөө зэрэг)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                    <h1 className="title">6. Зураг, хавсралт файл</h1>
                    <Form layout="vertical">
                        <Form.Item  >                              
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}  style={{height: "40px"}}>Зураг, хавсралт файл</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                    <Form.Item layout="vertical">
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

export default TrainingReport;