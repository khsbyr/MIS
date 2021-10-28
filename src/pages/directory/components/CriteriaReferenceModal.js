import { Form, Input, Modal, message } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/CvModal.style';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

export default function CriteriaReferenceModal(props) {
  const { Criteriareferencecontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...Criteriareferencecontroller,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(
            `criteriaReference/update/${Criteriareferencecontroller.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('criteriaReference/post', values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
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
        title="Бүрэлдэхүүн бүртгэх"
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
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Бүрэлдэхүүний нэр:"
              name="name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea style={{ width: '100%', height: '100px' }} />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
