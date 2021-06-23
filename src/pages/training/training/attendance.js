import { RepeatRounded } from "@material-ui/icons";
import React, {useState, useEffect} from "react";
import { Row, Col, DatePicker, Input, Button, Table, Modal, Form, InputNumber, Select } from "antd";
import PageHeaderWrapper from "../../../container/Layout/component/Pageheader.style";
import HeaderWrapper from "../training/components/plan.styled";
import ContentWrapper from "./components/attendance.style";
import CriteriaModal from "../../criteria/components/CriteriaModal";
import { useTranslation } from 'react-i18next';
import i18n from "../../../i18n";
import { getService } from "../../../service/service";
import {
    DownOutlined,
    SearchOutlined,
    CopyOutlined,
  } from "@ant-design/icons";
  
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  const onSearch = (value) => console.log(value);

  const columns = [
    {
      title: 'Код / Дугаар/',
      dataIndex: 'code',
      key: 'code',    
    },
    {
      title: 'Суралцагчийн нэр',
    },
    {
      title: 'Ажил эрхлэлт',
    },
    {
      title: 'Холбогдох утас, мэйл, хаяг',
    },
    {
      title: 'Регистерийн дугаар',
    },
  ];

  const data = [
      {
          key: "1",
          code: "adasd"
      }
  ]

const Attendance = () => {
    const [visible, setVisible] = useState(false);
    const [list, setList] = useState([]);
    const { Option } = Select;
    useEffect(()=>{
        getService("criteria/get").then(result=>{
          let list  = result.content || []
          setList(list)
    
        })
        },[])
    return(
        <HeaderWrapper>
        <Row>
          <Col xs={24} md={24} lg={10}>
            <p className="title">Ирцийн бүртгэл</p>
          </Col>
          <Col xs={24} md={24} lg={14}>
            <PageHeaderWrapper>
              <Row>
                <Col xs={8} md={8} lg={6}>
                  <DatePicker
                    onChange={onChange}
                    bordered={false}
                    suffixIcon={<DownOutlined />}
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
                      borderBottom: "1px solid #103154",
                    }}
                  />
                </Col>
                <Col xs={8} md={8} lg={4}>
                  <Button icon={<CopyOutlined />}>Хэвлэх</Button>
                </Col>
                <Col xs={8} md={8} lg={4}>
                  <Button className="export" icon={<CopyOutlined />}>
                    Экспорт
                  </Button>
                </Col>
                <Col xs={8} md={8} lg={4}>
                <Button className="export" icon={<CopyOutlined />} onClick={() => setVisible(true)}>
                    Нэмэх
                  </Button>
                <CriteriaModal/>
                <Modal
                    title="Сургалтын хөтөлбөр бүртгэх "
                    centered
                    visible={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={1000}
                >
                    <Row gutter={[50]}>
                    <Col span={12}>
                        <Form layout="vertical">
                            <Form.Item label="Код /Дугаар/:" >                    
                                <Input placeholder="Код /Дугаар/"/>
                            </Form.Item>
                        </Form>
                        <Form layout="vertical">
                            <Form.Item label="Үйл ажиллагаа" >                    
                                <Input placeholder="Үйл ажиллагаа"/>
                            </Form.Item>
                        </Form>
                        <Form layout="vertical">
                            <Form.Item label="Хэрэгжих хуагацаа" >                    
                                <DatePicker
                                bordered={false}
                                suffixIcon={<DownOutlined />}
                                className="DatePicker"
                                style={{
                                width: "100%",
                                color: "black",
                                cursor: "pointer",
                                }}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <Form layout="vertical">
                            <Form.Item label="Хариуцах эзэн:" >                    
                                <Input placeholder="Хариуцах эзэн"/>
                            </Form.Item>
                        </Form>
                        <Form layout="vertical">
                            <Form.Item label="Сургалтын материал:" >                    
                                <Input placeholder="Сургалтын материал"/>
                            </Form.Item>
                        </Form>
                    </Col>
                    </Row>
                </Modal>
                </Col>
              </Row>
            </PageHeaderWrapper>{" "}
          </Col>
        </Row>
        <ContentWrapper>
        <Row >
            <Col xs={24} md={24} lg={8}>
                <Form>
                    <Form.Item>                   
                        <Input className="FormItem" placeholder="Сургалтын нэр"/>
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Item>                   
                        <DatePicker
                        bordered={false}
                        placeholder="Огноо"
                        suffixIcon={<DownOutlined />}
                        className="DatePicker"
                        style={{
                        width: "60%",
                        color: "black",
                        cursor: "pointer",
                        }}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col xs={24} md={24} lg={8}>
             <Form>
                <Form.Item>                              
                    <Select
                        placeholder="Аймаг:"
                        allowClear
                        >
                            <Option value="Ulaanbaatar">Улаанбаатар</Option>
                            <Option value="Arkhangai">Архангай</Option>
                            <Option value="other">other</Option>
                    </Select>
                </Form.Item>
                <Form.Item>                              
                    <Select
                        placeholder="Сум:"
                        allowClear
                        >
                            <Option value="Darkhan">Дархан</Option>
                            <Option value="Erdenet">Эрдэнэт</Option>
                            <Option value="other">other</Option>
                    </Select>
                </Form.Item>
             </Form>
            </Col>
            <Col xs={24} md={24} lg={4}>
                <Form>
                    <Form.Item>
                        <InputNumber 
                            placeholder="Эр"
                        />
                    </Form.Item>
                    <Form.Item>
                        <InputNumber 
                            placeholder="Эм"
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col xs={24} md={24} lg={4}>
                <Form>
                    <Form.Item>
                        <InputNumber 
                            placeholder="Нийт"
                        />
                    </Form.Item>
                </Form>
            </Col>
        </Row>


        <Table dataSource={data} columns={columns} bordered />
        </ContentWrapper>
      </HeaderWrapper>
    )
}

export default Attendance;