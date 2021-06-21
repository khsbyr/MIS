import React, {useState, useEffect} from "react";
import HeaderWrapper from "./plan.styled";
import ContentWrapper  from "./criteria.style";
import CriteriaModal from "./criteriaModal";
import {
  DownOutlined,
  SearchOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Table, Modal, Form, InputNumber } from "antd";
import PageHeaderWrapper from "../container/Layout/component/Pageheader.style";
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";
import { getService } from "../service/service";


function onChange(date, dateString) {
  console.log(date, dateString);
}
const onSearch = (value) => console.log(value);


export default function Criteria() {
  //const { Search } = Input;
  const { t, i18 } = useTranslation();
  const [list, setList] = useState([]);
  function handleClick(lang) {
    i18n.changeLanguage(lang)
  }
  
  const columns = [
    {
      title: 'Код / Дугаар/',
      dataIndex: 'code',
      key: 'code',
      code:"code"
      
    },
    {
      title: 'Шалгуур үзүүлэлтийн нэр',
      dataIndex: 'name',
      key: 'name',
      name:"name"
    },
    {
      title: 'Хүрэх үр дүн',
      dataIndex: 'urDun',
      key: 'urDun',
    },
    {
      title: 'Үр дүнгийн биелэлт',
      dataIndex: 'biylelt',
      key: 'biylelt',
    },
    {
      title: 'Шалгуур үзүүлэлтийн төрөл',
      dataIndex: 'indicators',
      key: 'indicators',
    },
  ];


  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    getService("criteria/get").then(result=>{
      let list  = result.content || []
      setList(list)

    })
    },[])

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
      <Table dataSource={list} columns={columns} bordered />
     
      </ContentWrapper>
    </HeaderWrapper>

  );
}
