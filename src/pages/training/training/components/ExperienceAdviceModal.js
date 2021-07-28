import { DatePicker, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './cv.styled';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
export default function ExperienceAdviceModal(props) {
  const { Composition, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({ ...Composition });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService(`criteria/put${Composition.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('criteria/post', values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        errorCatch(info);
      });
  };
  return (
    <div>
      <Modal
        title="Зөвлөх үйлчилгээний ажлын туршлага"
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
            labelAlign="left"
            {...layout}
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Form.Item
              name="role"
              label="Албан тушаал:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="nameOfOrga" label="Байгууллагын нэр:">
              <Input />
            </Form.Item>
            <Form.Item
              name="date"
              label="Огноо:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
