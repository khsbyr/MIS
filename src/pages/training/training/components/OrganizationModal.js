import React, { useEffect, useState } from "react";
import { Modal, Form, Input } from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined  } from "@ant-design/icons";
import { Row, Col, Select, Option,Upload } from "antd";
import AutocompleteSelect from "../../../components/Autocomplete";
const { Dragger } = Upload;
// const { Option } = Select;
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
export default function OrganizationModal(props) {
    const { Usercontroller, isModalVisible, isEditMode } = props;
    const [stateController, setStateController] = useState([]);
    const [form] = Form.useForm();
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
                title="Шалгуур үзүүлэлт бүртгэх"
                okText="Хадгалах"
                cancelText="Буцах"
                width={1200}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            ><Row gutter={[72]}>
            <Col  xs={24} md={24} lg={4}>
                <Dragger {...props} style={{}}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                   
                    <p className="ant-upload-hint">
                    Зураг оруулах
                    </p>
                </Dragger>
              
            </Col></Row>
            <Col  xs={24} md={24} lg={10}>
                  <h2 className="title"> Байгууллагын мэдээлэл</h2>
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Байгууллагын нэр:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Регистрийн дугаар:">                              
                                <Input />
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
                  <Row gutter={32}>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Банкны нэр:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Дансны нэр:">                              
                                <Input />
                            </Form.Item>
                        </Form> 
                      </Col>
                  </Row>
                  <Row gutter={32}> 
                      <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Дансны дугаар:">                              
                                <Input />
                            </Form.Item>
                        </Form>
                      </Col>
                      {/* <Col xs={24} md={24} lg={12}>
                        <Form layout="vertical">
                            <Form.Item label="Дансны вальют:">                              
                                <Select
                                placeholder="Вальют"
                                allowClear
                                >
                                    <Option value="tugrug">Төгрөг</Option>
                                    <Option value="dollar">$</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                        </Form> 
                      </Col> */}
                  </Row>
                  </Col>
                <Form
                    form={form}
                    labelAlign={"left"}
                    {...layout}
                    name="nest-messages"
                    validateMessages={validateMessages}
                >
                 
                    <Form.Item
                        name="name"
                        label="Шалгуур үзүүлэлтийн нэр:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Код:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
              <Form.Item
                name="indicatorProcess"
                label="Хүрэх үр дүн:"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="upIndicator"
                label="Үр дүнгийн биелэлт"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            
                </Form>
            </Modal>
        </div >
    );
}
