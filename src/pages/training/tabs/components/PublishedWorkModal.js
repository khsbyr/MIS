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
export default function PublishedWorkModal(props) {
  const { PublishedWorkController, isModalVisible, isEditMode, trainerID } =
    props;
  const [form] = Form.useForm();
  const [publishedDate, setPublishedDate] = useState(null);

  function onChangePublishedDate(date, value) {
    setPublishedDate(value);
  }
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({ ...PublishedWorkController });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainer = { id: trainerID };
        values.publishedDate = publishedDate;
        if (isEditMode) {
          putService(
            `publishedWork/update/${PublishedWorkController.id}`,
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
          postService('publishedWork/post', values)
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
        title="Хэвлүүлсэн бүтээл "
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
            <Form.Item name="name" label="Бүтээлийн нэр:">
              <Input />
            </Form.Item>
            <Form.Item label="Огноо:">
              <DatePicker
                onChange={onChangePublishedDate}
                defaultValue={
                  isEditMode
                    ? moment(PublishedWorkController.publishedDate)
                    : ''
                }
              />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
