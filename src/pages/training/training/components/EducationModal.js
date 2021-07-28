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

export default function EducationModal(props) {
  const { CvEducationController, isModalVisibleEducation, isEditMode } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({ ...CvEducationController });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`education/update/${CvEducationController.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`education/post/${CvEducationController.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
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
            <Form.Item
              label="Элссэн огноо:"
              name="enrolledDate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
              {/* <DatePicker format={dateFormat} onChange={onChangeDate}
                                defaultValue={CvEducationController && moment(CvEducationController.enrolledDate, dateFormat)}/> */}
            </Form.Item>
            <Form.Item
              label="Төгссөн огноо:"
              name="graduatedDate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />

              {/* <DatePicker format={dateFormat} onChange={onChangeDate}
                                defaultValue={CvEducationController && moment(CvEducationController.graduatedDate, dateFormat)}/> */}
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
