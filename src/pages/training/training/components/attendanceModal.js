import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import ContentWrapper from './attendance.style';
import validateMessages from '../../../../tools/validateMessage';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
export default function TrainingProgramModal(props) {
  const { Attendancecontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const { Option } = Select;
  const [genderID, setGenderID] = useState([]);

  function handleChange(value) {
    setGenderID(value);
  }

  useEffect(() => {
    if (isEditMode) {
      setGenderID(Attendancecontroller.gender.id);
      form.setFieldsValue({
        ...Attendancecontroller,
        Gender: Attendancecontroller.gender.gender,
        GenderID: Attendancecontroller.gender.id,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.training = { id: trainingID };
        values.gender = { id: genderID };
        if (isEditMode) {
          putService(`participants/update/${Attendancecontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('participants/post', values)
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
        title="Ирцийн бүртгэл"
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
              name="name"
              label="Суралцагийн нэр:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="jobDescription"
              label="Ажил эрхлэлт:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Холбогдох утас:">
              <Input />
            </Form.Item>
            <Form.Item name="register" label="Регистрийн дугаар">
              <Input />
            </Form.Item>

            <Form.Item label="Хүйс" name="Gender">
              <Select
                placeholder="Хүйс сонгох"
                style={{ width: 150 }}
                onChange={handleChange}
              >
                <Option value={1}>Эрэгтэй</Option>
                <Option value={2}>Эмэгтэй</Option>
              </Select>
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
