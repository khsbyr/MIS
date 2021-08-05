import { Form, Input, Modal, message, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
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
export default function MembershipModal(props) {
  const { MembershipController, isModalVisible, isEditMode, trainerID } = props;
  const [form] = Form.useForm();
  const [enrolledDate, setEnrolledDate] = useState(null);
  function onChangeEnrolledDate(date, value) {
    setEnrolledDate(value);
  }
  useEffect(() => {
    setEnrolledDate(MembershipController && MembershipController.enrolledDate);
    if (isEditMode) {
      form.setFieldsValue({ ...MembershipController });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainer = { id: trainerID };
        values.enrolledDate = enrolledDate;
        if (isEditMode) {
          putService(`membership/update/${MembershipController.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('membership/post', values)
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
        title="Гишүүнчлэл"
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
            <Form.Item name="organization" label="Байгууллагын нэр:">
              <Input />
            </Form.Item>
            <Form.Item label="Огноо:">
              <DatePicker
                onChange={onChangeEnrolledDate}
                defaultValue={
                  isEditMode ? moment(MembershipController.enrolledDate) : ''
                }
              />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
