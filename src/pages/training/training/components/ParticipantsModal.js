import { Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
    postService,
    putService,
    getService
} from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./attendance.style";
import AutocompleteSelect from "../../../../components/Autocomplete";

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
export default function ParticipantsModal(props) {
  const { ParticipantsModalController, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [setTraining, setStateTraining] = useState([]);

  useEffect(() => {
    getService("training/get").then((result) => {
      if (result) {
        setStateTraining(result.content || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...ParticipantsModalController,
        TrainingName: ParticipantsModalController.training.name,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService(
            "participants/update/" + ParticipantsModalController.id,
            values
          )
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
          postService("participants/post", values)
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
        title="Оролцогчийн бүртгэл"
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
              label="Нэр:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="jobDescription"
              label="Ажил эрхлэлт:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Утас:">
              <Input />
            </Form.Item>
            <Form.Item name="register" label="Регистр:">
              <Input />
            </Form.Item>
            <Form.Item
                      layout="vertical"
                      label="Сургалтын нэр:"
                      name="TrainingName"
                    >
                      <AutocompleteSelect
                        valueField="id"
                        data={setTraining}
                        placeholder="Сургалтын нэр сонгох"
                      />
                    </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
