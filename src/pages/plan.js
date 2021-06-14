import { Row, Col, DatePicker, Input, Button, Table } from "antd"
import React from "react"
import HeaderWrapper from "./plan.styled"
import {
    DownOutlined, 
    SearchOutlined,
    CopyOutlined,
} from "@ant-design/icons";


export default function Plan(){
    function onChange(date, dateString) {
        console.log(date, dateString);
    }
    const onSearch = value => console.log(value);
    //const { Search } = Input;
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Age',
          dataIndex: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
        },
      ];
      const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park',
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
        },
      ];
      

    return(
        <HeaderWrapper>
            <Row>           
                <Col xs={24} md={24} lg={10}>
                    <p className="title">Сургалтын төлөвлөгөө</p>
                </Col>
                <Col xs={24} md={24} lg={14} >
                    <Row>
                        
                        <Col xs={24} md={24} lg={6}>
                            <DatePicker 
                                onChange={onChange}
                                bordered={false}                          
                                suffixIcon={<DownOutlined/>}
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
                                    borderBottom: "1px solid #103154"
                                }} />
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
            <Row>
                <Col>

                </Col>
            </Row>
        </HeaderWrapper>
    )
}