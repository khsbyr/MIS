import { RepeatRounded } from "@material-ui/icons";
import React, {useState, useEffect} from "react";
import { Row, Col, DatePicker, Input, Button, Table, Modal, Form, InputNumber, Select } from "antd";
import PageHeaderWrapper from "../../../container/Layout/Header/Header";
import HeaderWrapper from "../training/components/plan.styled";
import ContentWrapper from "./components/trainingProgram.style";
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
      title: 'Үйл ажиллагаа',
    },
    {
      title: 'Хэрэгжих хугацаа',
    },
    {
      title: 'Хариуцлах эзэн',
    },
    {
      title: 'Сургалтын материал',
    },
  ];

  const data = [
      {
          key: "1",
          code: "adasd"
      }
  ]

const TrainingProgram = () => {
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

        <ContentWrapper>
        <Row >
            <Col xs={24} md={24} lg={8}>
                <Form>
                    <Form.Item>                   
                        <Input className="FormItem" placeholder="Малын эрүүл мэнд"/>
                    </Form.Item>
                </Form>
                <Form>
                    <Form.Item>                   
                        <DatePicker
                        bordered={false}
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
                        placeholder="Аймаг, хот"
                        allowClear
                        >
                            <Option value="Ulaanbaatar">Улаанбаатар</Option>
                            <Option value="Arkhangai">Архангай</Option>
                            <Option value="other">other</Option>
                    </Select>
                </Form.Item>
                <Form.Item>                              
                    <Select
                        placeholder="Сургууль, цэцэрлэг"
                        allowClear
                        >
                            <Option value="Surguuli">Сургууль</Option>
                            <Option value="Tsetserleg">Цэцэрлэг</Option>
                            <Option value="other">other</Option>
                    </Select>
                </Form.Item>
             </Form>
            </Col>
            <Col xs={24} md={24} lg={8}>
            </Col>
        </Row>


        <Table dataSource={data} columns={columns} bordered />
        </ContentWrapper>
      </HeaderWrapper>
    )
}

export default TrainingProgram;