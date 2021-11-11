import { DatePicker, Form, Input, Modal, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './CvModal.style';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
export default function ExperienceAdviceModal(props) {
  const { ExperienceAdviceController, isModalVisible, isEditMode, trainerID } =
    props;
  const [form] = Form.useForm();
  const [hiredDate, setHiredDate] = useState(null);
  const [firedDate, setFiredDate] = useState(null);
  function onChangeHiredDate(date, value) {
    setHiredDate(value);
  }

  function onChangeFiredDate(date, value) {
    setFiredDate(value);
  }
  useEffect(() => {
    if (isEditMode) {
      setHiredDate(ExperienceAdviceController.hiredDate);
      setFiredDate(ExperienceAdviceController.firedDate);
      form.setFieldsValue({ ...ExperienceAdviceController });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainer = { id: trainerID };
        values.hiredDate = hiredDate;
        values.firedDate = firedDate;
        if (isEditMode) {
          putService(
            `expierenceForAdvice/update/${ExperienceAdviceController.id}`,
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
          postService('expierenceForAdvice/post', values)
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
            <Form.Item label="Ажилд орсон огноо:">
              <DatePicker
                placeholder="Огноо сонгох"
                onChange={onChangeHiredDate}
                defaultValue={
                  isEditMode ? moment(ExperienceAdviceController.hiredDate) : ''
                }
              />
            </Form.Item>
            <Form.Item label="Ажлаас гарсан огноо:">
              <DatePicker
                placeholder="Огноо сонгох"
                onChange={onChangeFiredDate}
                defaultValue={
                  isEditMode ? moment(ExperienceAdviceController.firedDate) : ''
                }
              />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
