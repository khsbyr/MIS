import { Typography, Row, Col, DatePicker, Input, Button, Table, Popconfirm } from "antd"
import React, {Component} from "react"
import HeaderWrapper from "./plan.styled"
import Pageheader from "../container/Layout/component/Pageheader";
import ContentWrapper from "./plan.styled";

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


export default function Plan(){

    function onChange(date, dateString) {
        console.log(date, dateString);
    }
    const onSearch = value => console.log(value);
    //const { Search } = Input;
    

    return(    
        <>
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={12} lg={9}>
                    <p className="title">Сургалтын төлөвлөгөө</p>
                </Col>
                <Col xs={24} md={12} lg={15} >
                    <Row> 
                      <Pageheader/>
                    </Row>
                </Col>      
            </Row>
        </HeaderWrapper>

        <ContentWrapper>
            <Row>
                <Col>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>
        </ContentWrapper>
        </>
    )
}