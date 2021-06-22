import { Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import { postService, putService } from "../service/service";
import { errorCatch } from "../tools/Tools";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
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
export default function CriteriaModal(props) {
  const { isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  useEffect(() => {
  }, []);
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          putService(
            "criteria/put",
            values
          )
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
        title="АЙМАГ/ХОТ"
        okText="Хадгалах"
        cancelText="Буцах"
        width={650}
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
          <Row>
            <Col style={{ padding: "10px" }} span={12}>
              <Form.Item
                name="name"
                label="Аймаг/хот"
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
                label="Код"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} style={{ padding: "10px" }}>
              <Form.Item
                name="shortName"
                label="Товч нэр:"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Тайлбар"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
