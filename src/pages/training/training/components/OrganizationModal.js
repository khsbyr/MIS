import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getService,
  postService,
  putService,
} from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import "./organization.style";

const { Dragger } = Upload;
const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
function onChange(date, dateString) {
  console.log(date, dateString);
}
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
  const { Option } = Select;

  useEffect(() => {
    getService("organization/get", {
      search: "status:true",
    }).then((result) => {
      if (result) {
        setStateController(result.content || []);
      }
    });

    if (isEditMode) {
      getService("organization/get" + Usercontroller.id).then((result) => {
        Usercontroller.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Usercontroller });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService("organization/put" + Usercontroller.id, values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
            debugger
            console.log(values);
          postService("organization/post", values)
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
      >
           <Form
                    form={form}
                    labelAlign={"left"}
                    {...layout}
                    name="nest-messages"
                    validateMessages={validateMessages}
                >
        <Row gutter={[72]}>
          <Col xs={24} md={24} lg={4}>
            <Dragger {...props} style={{}}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>

              <p className="ant-upload-hint">Зураг оруулах</p>
            </Dragger>
          </Col>
          <Col xs={24} md={24} lg={10}>
            <h2 className="title"> Байгууллагын мэдээлэл</h2>
            <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                layout="vertical"
                        name="name"
                        label="Байгууллагын нэр:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
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
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Дансны вальют:">
                    <Select placeholder="Вальют" allowClear>
                      <Option value="tugrug">Төгрөг</Option>
                      <Option value="dollar">$</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>

            <h2 className="title">Холбоо барих мэдээлэл</h2>
            <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Аймаг, хот:">
                    <Select placeholder="Аймаг, хот" allowClear>
                      <Option value="Ulaanbaatar">Улаанбаатар</Option>
                      <Option value="Arkhangai">Архангай</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Сум, дүүрэг:">
                    <Select placeholder="Сум, дүүрэг" allowClear>
                      <Option value="Sukhbaatar">Сүхбаатар дүүрэг</Option>
                      <Option value="Bayangol">Баянгол</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Баг, хороо:">
                    <Select placeholder="Баг, хороо" allowClear>
                      <Option value="1khoroo">1-р хороо</Option>
                      <Option value="2khoroo">2-р хороо</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Утас:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Е-майл хаяг:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Веб хаяг:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form layout="vertical">
                  <Form.Item label="Хаяг:">
                    <Input.TextArea
                      style={{
                        width: "100%",
                        height: "110px",
                      }}
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={24} lg={10}>
            <h2 className="title">Хариуцсан ажилтан:</h2>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Овог:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Нэр:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Регистрийн дугаар:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Албан тушаал:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Утасны дугаар:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Е-майл хаяг:">
                    <Input />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item label="Танилцуулга оруулах:">
                    <Upload {...props}>
                      <Button
                        icon={<UploadOutlined />}
                        style={{ height: "40px" }}
                      >
                        Танилцуулга оруулах
                      </Button>
                    </Upload>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form layout="vertical">
                  <Form.Item>
                    <Checkbox onChange={onChange}>
                      Оруулсан мэдээлэл үнэн болно.
                    </Checkbox>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
        </Form>
      </Modal>
    </div>
  );
}
