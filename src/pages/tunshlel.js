import { Row, Col, DatePicker, Input, Button, Table } from "antd";
import React from "react";
import HeaderWrapper from "../pages/training/training/components/plan.styled";
import { DownOutlined, SearchOutlined, CopyOutlined } from "@ant-design/icons";

export default function Tunshlel() {
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  const onSearch = (value) => console.log(value);
  //const { Search } = Input;
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
  
  return (
    <HeaderWrapper>
      <Row>
        <Col xs={24} md={24} lg={10}>
          <p className="title">Шалгуур үзүүлэлт</p>
        </Col>
        <Col xs={24} md={24} lg={14}>
          <Row>
            <Col xs={24} md={24} lg={6}>
              <DatePicker
                onChange={onChange}
                bordered={false}
                suffixIcon={<DownOutlined />}
                placeholder="Select date"
                className="DatePicker"
                style={{
                  width: "120px",
                  color: "black",
                  cursor: "pointer",
                }}
              />
            </Col>
            <Col xs={24} md={24} lg={6}>
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
            <Col xs={24} md={24} lg={4}>
              <Button icon={<CopyOutlined />}>Хэвлэх</Button>
            </Col>
            <Col xs={24} md={24} lg={4}>
              <Button icon={<CopyOutlined />}>Экспорт</Button>
            </Col>
            <Col xs={24} md={24} lg={4}>
              <Button icon={<CopyOutlined />}>Нэмэх</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table dataSource={dataSource} columns={columns} />;
    </HeaderWrapper>
  );
}
