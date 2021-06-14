import { Typography, Row, Col, DatePicker, Input, Button, Table, Popconfirm } from "antd"
import React, {Component} from "react"
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