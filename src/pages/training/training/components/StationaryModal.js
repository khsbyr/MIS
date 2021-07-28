import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
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

export default function StationaryModal(props) {
  const { Stationarycontroller, isModalVisible, isEditMode } = props;
  const [setStateController] = useState([]);
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
      getService(`criteria/get${Stationarycontroller.id}`).then(result => {
        Stationarycontroller.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Stationarycontroller });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`criteria/put${Stationarycontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('criteria/post', values)
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

        // console.log('Validate Failed:', info);
      });
  };
  return (
    <div>
      <Modal
        title="Бичгийн хэрэгсэл"
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
              label="Зардлын нэр:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="une"
              label="Нэгж үнэ:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="too"
              label="Тоо ширхэг:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="huniiToo"
              label="Хүний тоо"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Dun"
              label="Дүн"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
