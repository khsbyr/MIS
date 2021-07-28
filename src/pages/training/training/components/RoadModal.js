import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

export default function RoadModal(props) {
  const { Roadcontroller, isModalVisible, isEditMode } = props;
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
      getService(`criteria/get${Roadcontroller.id}`).then(result => {
        Roadcontroller.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Roadcontroller });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService(`criteria/put${Roadcontroller.id}`, values)
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
        title="Зам хоног, буудлын зардал"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
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
            name="turul"
            label="Зардлын төрөл:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hiniiToo"
            label="МЗҮБ хүний тоо:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="honogt"
            label="Хоногт"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="honog"
            label="Хоног"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="niit"
            label="Нийт"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
