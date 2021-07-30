import { Form, Input, Modal, DatePicker } from 'antd';
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

export default function EducationModal(props) {
  const {
    CvEducationController,
    isModalVisibleEducation,
    isEditMode,
    trainerID,
  } = props;
  const [form] = Form.useForm();
  const [enrolledDate, setEnrolledDate] = useState(null);
  const [graduatedDate, setGraduatedDate] = useState(null);
  useEffect(() => {
    if (isEditMode) {
      setGraduatedDate(CvEducationController.graduatedDate);
      setEnrolledDate(CvEducationController.enrolledDate);
      form.setFieldsValue({ ...CvEducationController });
    }
  }, []);

  function onChangeEnrolledDate(date, value) {
    setEnrolledDate(value);
  }

  function onChangeGraduatedDate(date, value) {
    setGraduatedDate(value);
  }

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainer = { id: trainerID };
        values.enrolledDate = enrolledDate;
        values.graduatedDate = graduatedDate;
        if (isEditMode) {
          putService(`education/update/${CvEducationController.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(
            `education/post/${CvEducationController.trainer.id}`,
            values
          )
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
        title="Боловсрол"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisibleEducation}
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
              name="degree"
              label="Зэрэг, цол:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="universityName" label="Их дээд сургуулийн нэр:">
              <Input />
            </Form.Item>
            <Form.Item label="Элссэн огноо:">
              <DatePicker
                onChange={onChangeEnrolledDate}
                defaultValue={
                  isEditMode ? moment(CvEducationController.enrolledDate) : ''
                }
              />
            </Form.Item>
            <Form.Item label="Төгссөн огноо:">
              <DatePicker
                onChange={onChangeGraduatedDate}
                defaultValue={
                  isEditMode ? moment(CvEducationController.graduatedDate) : ''
                }
              />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
