import { Form, Input, Modal } from 'antd';
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
  const { ExperienceAdviceController, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({ ...ExperienceAdviceController });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(
            `expierenceForAdvice/update/${ExperienceAdviceController.id}`,
            values
          )
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('expierenceForAdvice/post', values)
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
              name="position"
              label="Албан тушаал:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="organizationName" label="Байгууллагын нэр:">
              <Input />
            </Form.Item>
            <Form.Item
              name="hiredDate"
              label="Огноо:"
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
