import { Form, Input, message, Modal } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/CvModal.style';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

export default function ActivityModal(props) {
  const { EditRow, isModalVisible, isEditMode, id } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`planActivity/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`planActivity/post/${id}`, values)
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
        title="Үйл аижллагаа бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={900}
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
              label="Үйл ажиллагаа:"
              name="operation"
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
