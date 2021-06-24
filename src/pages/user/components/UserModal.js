import { Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getService, postService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
// const layout = {
//   labelCol: {
//     span: 10,
//   },
//   wrapperCol: {
//     span: 14,
//   },
// };
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
export default function UserModal(props) {
  const { Usercontroller, isModalVisible, isEditMode } = props;
  const [stateController, setStateController] = useState([]);
  const [form] = Form.useForm();
  const { Option } = Select;

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
          putService("criteria/put" + Usercontroller.id, values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
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
        title="Хэрэглэгч бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={800}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <Form
          form={form}
          labelAlign={"left"}
          name="nest-messages"
          layout="vertical"
          validateMessages={validateMessages}
        >
          <Row gutter={32}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Овог:" name="firstname">
                <Input placeholder="Овог..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Нэр:" name="lastname">
                <Input placeholder="Нэр..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Регистрийн дугаар:" name="register">
                <Input placeholder="Регистрийн дугаар..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            {/* <Col xs={24} md={24} lg={8}>
              <Form layout="vertical">
                <Form.Item label="Нас:">
                  <Select placeholder="Нас" allowClear>
                    <Option value="tugrug">Төгрөг</Option>
                    <Option value="dollar">$</Option>
                    <Option value="other">other</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col> */}
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Нас:" name="Нас">
                <Input type="number" placeholder="Нас..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form layout="vertical">
                <Form.Item label="Хүйс:">
                  <Select placeholder="Хүйс..." allowClear>
                    <Option value="1">Эрэгтэй</Option>
                    <Option value="2">Эмэгтэй</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form layout="vertical">
                <Form.Item label="Улс:">
                  <Select placeholder="Улс..." allowClear>
                    <Option value="tugrug">uls</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={8}>
              <Form layout="vertical">
                <Form.Item label="Харьяа байгууллагын нэр:">
                  <Select placeholder="Харьяа байгууллагын нэр..." allowClear>
                    <Option value="Харьяа байгууллагын нэр">uls</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Албан тушаал:"
                name="lastname"
              >
                <Input
                  placeholder="Албан тушаал..."
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Утасны дугаар:" name="">
                <Input placeholder="Утасны дугаар..."/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={8}>
            <Form layout="vertical">
                <Form.Item label="Аймаг, Нийслэл:">
                  <Select placeholder="Аймаг, Нийслэл:..." allowClear>
                    <Option value=""></Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={8}>
            <Form layout="vertical">
                <Form.Item label="Сум, Дүүрэг:">
                  <Select placeholder="Сум, Дүүрэг:..." allowClear>
                    <Option value=""></Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={8}>
            <Form layout="vertical">
                <Form.Item label="Баг, Хороо:">
                  <Select placeholder="Баг, Хороо:..." allowClear>
                    <Option value=""></Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={16}>
              <Form.Item label="Хаяг:" name="">
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Оруулсан мэдээлэл үнэн болно." name="">
                <Input type="checkbox" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* <Form.Item
            name="upIndicator"
            label="Нас"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item> */}
      </Modal>
    </div>
  );
}
