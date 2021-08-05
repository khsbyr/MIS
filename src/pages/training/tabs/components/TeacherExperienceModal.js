import { Form, Input, Modal, DatePicker, message } from 'antd';
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
export default function TeacherExperienceModal(props) {
  const { TeacherExperienceController, isModalVisible, isEditMode, trainerID } =
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
      setHiredDate(TeacherExperienceController.hiredDate);
      setFiredDate(TeacherExperienceController.firedDate);
      form.setFieldsValue({ ...TeacherExperienceController });
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
            `expierenceForTeach/update/${TeacherExperienceController.id}`,
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
          postService('expierenceForTeach/post', values)
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
        title="Багшийн ажлын туршлага"
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
                onChange={onChangeHiredDate}
                defaultValue={
                  isEditMode
                    ? moment(TeacherExperienceController.hiredDate)
                    : ''
                }
              />
            </Form.Item>
            <Form.Item label="Ажлаас гарсан огноо:">
              <DatePicker
                onChange={onChangeFiredDate}
                defaultValue={
                  isEditMode
                    ? moment(TeacherExperienceController.firedDate)
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
