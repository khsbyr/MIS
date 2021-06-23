import React, {useState, useEffect} from "react";
import HeaderWrapper from "./plan.styled";
import ContentWrapper  from "./criteria.style";
import CriteriaModal from "./criteriaModal";
import {
  DownOutlined,
  SearchOutlined,
  CopyOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { Row, Col, DatePicker, Input, Button, Table, Modal, Form, InputNumber, Select, Menu, Dropdown } from "antd";
import PageHeaderWrapper from "../container/Layout/component/Pageheader.style";
import { useTranslation } from 'react-i18next';
import i18n from "../i18n";
import { getService } from "../service/service";

const { SubMenu } = Menu;

function onChange(date, dateString) {
  console.log(date, dateString);
}
const onSearch = (value) => console.log(value);
const { Option } = Select;
const provinceData = ['Хувиар', 'Тоогоор'];

const cityData = {
  Хувиар: [],
  Тоогоор: [],
};


export default function Composition1() {
  //const { Search } = Input;
  const { t, i18 } = useTranslation();
  const [cities, setCities] = React.useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = React.useState(cityData[provinceData[0]][0]);

  const handleProvinceChange = value => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = value => {
    setSecondCity(value);
  };

  const [list, setList] = useState([]);
  function handleClick(lang) {
    i18n.changeLanguage(lang)
  }
  for (let i = 0; i <= 100; i++){
    console.log(i)
  }
  
  const columns = [
    {
      title: '№',
      dataIndex: 'code',
      key: 'code',
      name: 'code'
    },
    {
      title: 'Сургалтын агууллага',
      dataIndex: 'name',
      key: 'name',
      name: 'name',
      // render: (value, row, index) => {
      //   const obj = {
      //     children: value,
      //     props: {},
      //   };
      //   if (index === 1) {
      //     obj.props.rowSpan = 2;
      //   }
      //   return obj;
      // },
    },
    {
      title: 'Зорилтот үр дүн',
      dataIndex: 'Row1_Col3',
      key: 'Row1_Col3',
    },
    {
      title: 'Шалгуур үзүүлэлт',
      dataIndex: 'Row1_Col4',
      key: 'Row1_Col4',
    },
    {
      title: 'I улирал',
      dataIndex: 'Row1_Col5',
      key: 'Row1_Col5',
    },
    {
      title: 'II улирал',
      dataIndex: 'Row1_Col6',
      key: 'Row1_Col6',
    },
    {
      title: 'III улирал',
    },
    {
      title: 'IV улирал',
    },
    {
      title: 'Нийт',
    },
    {
      title: 'Үр дүнгийн биелэлт',
    },
  ];

  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    getService("composition1/get").then(result=>{
      let list  = result.content || []
      debugger
      setList(list)

    })
    },[])
  return (
    <HeaderWrapper>
      <Row>
        <Col xs={24} md={24} lg={10}>
          <p className="title">Бүрэлдэхүүн хэсэг 1: {list.name}</p>
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
                      <Form layout="vertical">
                          <Form.Item label="Мэдээлэл цуглуулах аргачлал:" >                    
                          {/* <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            onChange={onChangee}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onSearch={onSearchhj}
          
                          >
                            <Option><Input placeholder="Basic usage" /></Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="tom">Tom</Option>
                          </Select> */}
                        <Select defaultValue={provinceData[0]} style={{ width: 120 }} onChange={handleProvinceChange}>
                        {provinceData.map(province => (
                          <Option key={province}>{province}</Option>
                        ))}
                      </Select>
                      <Select style={{ width: 120 }} value={secondCity} onChange={onSecondCityChange}>
                        {cities.map(city => (
                          <Option key={city}>{city}</Option>                  
                        ))}                       
                      </Select>
                   
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
