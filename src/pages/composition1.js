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
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";

function onChange(date, dateString) {
  console.log(date, dateString);
}
const onSearch = (value) => console.log(value);


export default function Composition1() {
  //const { Search } = Input;
  const { t, i18 } = useTranslation();
  function handleClick(lang) {
    i18n.changeLanguage(lang)
  }
  
  const columns = [
    {
      title: t("Row1_Col1"),
      dataIndex: 'Row1_Col1',
      key: 'Row1_Col1',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };

        if (index === 2) {
          obj.props.rowSpan = 4;
        }
        // These two are merged into above cell
        if (index === 3) {
          obj.props.rowSpan = 0;
        }
        if (index === 4) {
          obj.props.colSpan = 0;
        }
        if (index === 5) {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: t("Row1_Col2"),
      dataIndex: 'Row1_Col2',
      key: 'Row1_Col2',
    },
    {
      title: t("Row1_Col3"),
      dataIndex: 'Row1_Col3',
      key: 'Row1_Col3',
    },
    {
      title: t("Row1_Col4"),
      dataIndex: 'Row1_Col4',
      key: 'Row1_Col4',
    },
    {
      title: t("Row1_Col5"),
      dataIndex: 'Row1_Col5',
      key: 'Row1_Col5',
    },
    {
      title: t("Row1_Col6"),
      dataIndex: 'Row1_Col6',
      key: 'Row1_Col6',
      children: [
        {
          title: t("Row1_Col6_1"),
          dataIndex: 'Row1_Col6_1',
          key: 'Row1_Col6_1',
          
        },
        {
          title: t("Row1_Col6_2"),
          dataIndex: 'Row1_Col6_2',
          key: 'Row1_Col6_2',
        },
        {
          title: t("Row1_Col6_3"),
          dataIndex: 'Row1_Col6_3',
          key: 'Row1_Col6_3',
        },
        {
          title: t("Row1_Col6_4"),
          dataIndex: 'Row1_Col6_4',
          key: 'Row1_Col6_4',
        },
        {
          title: t("Row1_Col6_5"),
          dataIndex: 'Row1_Col6_5',
          key: 'Row1_Col6_5',
        },
      ],
    },
  ];


  const data = [
    {
      key: '1',
      Row1_Col1: 'ТӨСЛИЙН ХӨГЖЛИЙН ЗОРИЛГЫН ТӨВШНИЙ  ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД',
      colSpan: 6,
    },
    {
      key: '2',
      Row1_Col1: t("Row2_Col1"),
      Row1_Col3: t("Row2_Col3"),
      Row1_Col4: '0',
      Row1_Col5: '10',
      Row1_Col6_1: t("Row2_Col6"),
      Row1_Col6_2: t("Row2_Col7"),
      Row1_Col6_3: t("Row2_Col8"),
      Row1_Col6_5: t("Row2_Col10"),
      
    },
    {
      key: '3',
      Row1_Col1: t("Row3_Col1"),
      Row1_Col3: t("Row3_Col3"),
      Row1_Col4: '0',
      Row1_Col5: '10',
      Row1_Col6_1: t("Row3_Col6"),
      Row1_Col6_2: t("Row3_Col7"),
      Row1_Col6_3: t("Row3_Col8"),
      Row1_Col6_5: t("Row3_Col10"),
      
    },
    {
      key: '4',
      Row1_Col3: t("Row3_Col3_2"),
      Row1_Col4: '0',
      Row1_Col5: '10',
      Row1_Col6_1: t("Row3_Col6_2"),
      Row1_Col6_2: t("Row3_Col7"),
      Row1_Col6_3: t("Row3_Col8_2"),
      Row1_Col6_4: t("Row3_Col9_2"),
      Row1_Col6_5: t("Row3_Col10"),
    },
    {
      key: '5',
      Row1_Col3: t("Row3_Col3_3"),
      Row1_Col4: '0',
      Row1_Col5: '10',
      Row1_Col6_1: t("Row3_Col6_3"),
      Row1_Col6_2: t("Row3_Col7"),
      Row1_Col6_3: t("Row3_Col8_2"),
      Row1_Col6_4: t("Row3_Col9_2"),
      Row1_Col6_5: t("Row3_Col10"),    
    },
    {
      key: '6',
      Row1_Col3: t("Row3_Col3_4"),
      Row1_Col4: '0',
      Row1_Col5: '10',
      Row1_Col6_1: t("Row3_Col6_4"),
      Row1_Col6_2: t("Row3_Col7"),
      Row1_Col6_3: t("Row3_Col8_4"),
      Row1_Col6_4: t("Row3_Col9_4"),
      Row1_Col6_5: t("Row3_Col10_4"),     
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
                          <Form.Item label="Бүрэлдэхүүн хэсэг" >                    
                              <Input placeholder="Бүрэлдэхүүн хэсэг"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Шалгуур үзүүлэлтүүд" >                    
                              <Input placeholder="Шалгуур үзүүлэлтүүд"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Суурь үзүүлэлт:" >                    
                              <InputNumber style={{ width: "20vw" }} placeholder="Суурь үзүүлэлт:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Мэдээллийн эх үүсвэр:" >                    
                              <InputNumber style={{ width: "20vw" }} placeholder="Мэдээллийн эх үүсвэр:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Хариуцах нэгж:" >                    
                          <Input placeholder="Хариуцах нэгж:"/>
                          </Form.Item>
                      </Form>
                  </Col>
                  <Col span={12}>
                      <Form layout="vertical">
                          <Form.Item label="Зорилтот үр дүн:" >                    
                              <InputNumber style={{ width: "20vw" }} placeholder="Зорилтот үр дүн:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Тайлбар/Тодорхойлолт:" >                    
                              <Input placeholder="Тайлбар/Тодорхойлолт:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Давтамж:" >                    
                              <Input placeholder="Давтамж:"/>
                          </Form.Item>
                      </Form>
                      <Form layout="vertical">
                          <Form.Item label="Мэдээлэл цуглуулах аргачлал:" >                    
                              <Input placeholder="Мэдээлэл цуглуулах аргачлал:"/>
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
      <Table dataSource={data} columns={columns} bordered />
     
      </ContentWrapper>
    </HeaderWrapper>

  );
}
