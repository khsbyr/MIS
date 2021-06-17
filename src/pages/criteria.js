import React, {useState} from "react";
import HeaderWrapper from "./plan.styled";
import ContentWrapper  from "./criteria.style";
import CriteriaModal from "./criteriaModal";
import {
  DownOutlined,
  SearchOutlined,
  CopyOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Table, Modal, Form, InputNumber } from "antd";
import PageHeaderWrapper from "../container/Layout/component/Pageheader.style";

function onChange(date, dateString) {
  console.log(date, dateString);
}
const onSearch = (value) => console.log(value);
// function addCriteria() {
//   confirm({
//     title: 'Do you Want to delete these items?',
//     icon: <ExclamationCircleOutlined />,
//     content: 'Some descriptions',
//     Input: 'asda',
//     onOk() {
//       console.log('OK');
//     },
//     onCancel() {
//       console.log('Cancel');
//     },
//   });
// }


export default function Criteria() {
  //const { Search } = Input;
  
  const dataSource = [
    {
      code: "1",
      name: "Criteria",
      result: "bla2",
      results: "10 Downing Street",
      type: "torol",
      type: ""
    },
  ];

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Criteria name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Achieved results",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Execution of results",
      dataIndex: "results",
      key: "results",
    },
    {
      title: "Criteria type",
      dataIndex: "type",
      key: "type",
    },
  ];
  const [visible, setVisible] = useState(false);

  return (
    <HeaderWrapper>
      <Row>
        <Col xs={24} md={24} lg={10}>
          <p className="title">Шалгуур үзүүлэлт</p>
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
                  title="Шалгуур үзүүлэлт бүртгэх "
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
                              <Input placeholder="Код /Дугаар/:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Шалгуур үзүүлэлтийн нэр:" >                    
                              <Input placeholder="Шалгуур үзүүлэлтийн нэр:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Хүрэх үр дүн:" >                    
                              <InputNumber style={{ width: "20vw" }} placeholder="Хүрэх үр дүн:"/>
                          </Form.Item>
                      </Form>
                  </Col>
                  <Col span={12}>
                      <Form layout="vertical">
                          <Form.Item label="Үр дүнгийн биелэлт:" >                    
                              <InputNumber style={{ width: "20vw" }} placeholder="Үр дүнгийн биелэлт:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Шалгуур үзүүлэлтийн төрөл:" >                    
                              <Input placeholder="Шалгуур үзүүлэлтийн төрөл:"/>
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
          
      </ContentWrapper>
    </HeaderWrapper>

  );
}
