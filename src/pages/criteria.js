import { Typography, Row, Col, DatePicker, Input, Button, Table } from "antd";
import React from "react";
import HeaderWrapper from "./plan.styled";
import { DownOutlined, SearchOutlined, CopyOutlined } from "@ant-design/icons";
import Pageheader from "../container/Layout/component/Pageheader";

export default function Criteria() {

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
              <Pageheader/>
        </Col>
      </Row>
      <Table dataSource={dataSource} columns={columns} />;
    </HeaderWrapper>
  );
}
