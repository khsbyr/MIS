import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import {
  getService,
  postService,
  putService,
} from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./cv.styled";

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
export default function FuelModal(props) {
  const { Attendancecontroller, isModalVisible, isEditMode } = props;
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
      getService("criteria/get" + Attendancecontroller.id).then((result) => {
        Attendancecontroller.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Attendancecontroller });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService("criteria/put" + Attendancecontroller.id, values)
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
        title="Бичгийн хэрэгсэл"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
          <ContentWrapper>
        <Form
          form={form}
          labelAlign={"left"}
          {...layout}
          name="nest-messages"
          validateMessages={validateMessages}
        >
          <Form.Item
            name="name"
            label="Зардлын нэр:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="une"
            label="Нэгж үнэ:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="too"
            label="Тоо ширхэг:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="huniiToo"
            label="Хүний тоо"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Dun"
            label="Дүн"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}