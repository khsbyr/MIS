import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import ContentWrapper from './cv.styled';
import validateMessages from '../../../../tools/validateMessage';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

export default function EducationModal(props) {
  const { Composition, isModalVisible, isEditMode } = props;
  const [stateController, setStateController] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getService('criteria/get', {
      search: 'status:true',
    }).then(result => {
      if (result) {
        setStateController(result.content || []);
      }
    });

    if (isEditMode) {
      getService(`criteria/get${Composition.id}`).then(result => {
        Composition.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Composition });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService(`criteria/put${Composition.id}`, values)
            .then(result => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('criteria/post', values)
            .then(result => {
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
              label="Зэрэг, цол:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="work" label="Их дээд сургуулийн нэр:">
              <Input />
            </Form.Item>
            <Form.Item
              name="code"
              label="Огноо:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
