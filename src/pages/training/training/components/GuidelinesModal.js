import React, { useEffect, useState } from "react";
import { Modal, Form, Input , Table, Button, DatePicker} from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined  } from "@ant-design/icons";
import { Row, Col, Select, Option,Upload } from "antd";
import AutocompleteSelect from "../../../components/Autocomplete";
const columns = [
    {
      title: '№',
      dataIndex: 'code',
      key: 'code',    
    },
    {
      title: 'Нэрс',
      dataIndex: 'name',
      key: 'name',   
    },
    {
      title: 'Сургалтын үйл ажиллагаанд гүйцэтгэх үүрэг',
      dataIndex: 'uureg',
      key: 'uureg',   
    }
  ];

  const data = [
      {
          key: "1",
          code: "1",
          name: "Болд",
          uureg: "Илтгэгч"
      }
  ]

  const column = [
    {
      title: '№',
      dataIndex: 'code',
      key: 'code',    
    },
    {
      title: 'Суралцагчийн нэрс',
      dataIndex: 'name',
      key: 'name',   
    },
    {
      title: 'Байгууллага, албан тушаал, ажил эрхлэлт',
      dataIndex: 'uureg',
      key: 'uureg',   
    }
  ];

  const dataa = [
      {
          key: "1",
          code: "1",
          name: "Сувд",
          uureg: "Албан тушаал"
      }
  ]
const { Dragger } = Upload;
const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};
const validateMessages = {
    required: "${label} хоосон байна!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};
export default function GuidelinesModal(props) {
    const { Usercontroller, isModalVisible, isEditMode } = props;
    const [stateController, setStateController] = useState([]);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    useEffect(() => {
        getService("criteria/get", {
            search: "status:true",
        }).then((result) => {
            if (result) {
                setStateController(result.content || []);
            }
        });

        if (isEditMode) {
            getService("criteria/get" + Usercontroller.id).then((result) => {
                Usercontroller.userServiceId = result.userService.id
                form.setFieldsValue({ ...Usercontroller });
            })

        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.userService = { id: values.userServiceId }
                if (isEditMode) {
                    putService(
                        "criteria/put" + Usercontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("criteria/post", values)
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        });
                }
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };
    return (
        <div>
            <Modal
                title="Сургалтын удирдамж бүртгэх"
                okText="Хадгалах"
                cancelText="Буцах"
                width={1200}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            >
          <Row>
            <Col  xs={24} md={24} lg={10}>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сургалтын сэдэв:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сургалт зохион байгуулах үндэслэл:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сургалтын зорилго:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Хэрэгжүүлэх үйл ажиллагаа:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Хүлээгдэж буй үр дүн:">                              
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <p style={{color: "#7d7d7d", fontSize: "13px"}}>Сургалт зохион байгуулагдах газар:</p>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Аймаг, хот:">                              
                                        <Select
                                        placeholder="Аймаг, хот"
                                        allowClear 
                                        >
                                            <Option value="Ulaanbaatar">Улаанбаатар</Option>
                                            <Option value="Arkhangai">Архангай</Option>
                                            <Option value="other">other</Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Сум, дүүрэг:">                              
                                        <Select
                                                placeholder="Сум, дүүрэг"
                                                allowClear         
                                                >
                                                    <Option value="Sukhbaatar">Сүхбаатар дүүрэг</Option>
                                                    <Option value="Bayangol">Баянгол</Option>
                                                    <Option value="other">other</Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={15}>
                                <Form layout="vertical">
                                    <Form.Item label="Хаяг:"> 
                                        <Input.TextArea 
                                            style={{
                                                width: "100%",
                                                height: "110px"
                                            }}
                                        />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                </Col>
                <Col xs={24} md={24} lg={14}>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Сургалтын оролцогчид:"> 
                                    <Input.TextArea 
                                        style={{
                                            width: "100%",
                                            height: "110px"
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Сургалтын оролцогчид:">                              
                                    <Table dataSource={data} columns={columns} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Суралцагч:">                              
                                    <Table dataSource={dataa} columns={column} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={20}>
                            <Form layout="vertical">
                                <Form.Item label="Сургалтын хугацаа:">                              
                                    <RangePicker/>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>

                </Col>
            </Row>
            </Modal>
        </div >
    );
}
