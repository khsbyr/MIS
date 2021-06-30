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
    const { Guidelinescontroller, isModalVisible, isEditMode } = props;
    const [stateController, setStateController] = useState([]);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    useEffect(() => {
        // getService("trainingGuidelines/get", {
        //     search: "status:true",
        // }).then((result) => {
        //     if (result) {
        //         setStateController(result.content || []);
        //     }
        // });

        if (isEditMode) {
  
                form.setFieldsValue({ ...Guidelinescontroller });


        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                if (isEditMode) {
                    putService(
                        "trainingGuidelines/put" + Guidelinescontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("trainingGuidelines/post", values)
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
                width={1000}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            >
                <Form
                    form={form}
                    labelAlign={"left"}
                    {...layout}
                    layout="vertical"
                    name="nest-messages"
                    validateMessages={validateMessages}
                >
          <Row>
            <Col  xs={24} md={24} lg={14}>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <Form.Item label="Сургалтын сэдэв:" name="subject" rules={[
                            {
                                required: true,
                            },
                        ]}>                              
                                        <Input />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <Form.Item label="Сургалт зохион байгуулах үндэслэл:" name="reason" rules={[
                            {
                                required: true,
                            },
                        ]}>                              
                                        <Input />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <Form.Item label="Сургалтын зорилго:" name="aim" rules={[
                            {
                                required: true,
                            },
                        ]}>                              
                                        <Input />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <Form.Item label="Хэрэгжүүлэх үйл ажиллагаа:" name="operation" rules={[
                            {
                                required: true,
                            },
                        ]}>                              
                                        <Input />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <Form.Item label="Хүлээгдэж буй үр дүн:" name="result" rules={[
                            {
                                required: true,
                            },
                        ]}>                              
                                        <Input />
                                    </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <p style={{color: "#7d7d7d", fontSize: "13px"}}>Сургалт зохион байгуулагдах газар:</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                    <Form.Item label="Хаяг:"> 
                                        <Input.TextArea 
                                            style={{
                                                width: "100%",
                                                height: "110px"
                                            }}
                                        />
                                    </Form.Item>
                            </Col>
                        </Row>
                </Col>
                <Col xs={24} md={24} lg={10}>
                    <Row>
                        <Col xs={24} md={24} lg={24}>
                                <Form.Item label="Сургалтын оролцогчид:"> 
                                    <Input.TextArea 
                                        style={{
                                            width: "100%",
                                            height: "110px"
                                        }}
                                    />
                                </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={24}>
                                <Form.Item label="Сургалтын оролцогчид:">                              
                                    <Table dataSource={data} columns={columns} />
                                </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={24}>
                                <Form.Item label="Суралцагч:">                              
                                    <Table dataSource={dataa} columns={column} />
                                </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} md={24} lg={24}>
                                <Form.Item label="Сургалтын хугацаа:">                              
                                    <RangePicker/>
                                </Form.Item>
                        </Col>
                    </Row>

                </Col>
            </Row>
            </Form>
            </Modal>
        </div >
    );
}
