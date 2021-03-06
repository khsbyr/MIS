import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

export default function SignuprequestModal(props) {
  const { Usercontroller, isModalVisible, isEditMode } = props;
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
      getService(`criteria/get${Usercontroller.id}`).then(result => {
        Usercontroller.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Usercontroller });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService(`criteria/put${Usercontroller.id}`, values)
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
      });
  };
  return (
    <div>
      <Modal
        title="Шалгуур үзүүлэлт бүртгэх"
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
            label="Шалгуур үзүүлэлтийн нэр:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Код:"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="indicatorProcess"
            label="Хүрэх үр дүн:"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="upIndicator"
            label="Үр дүнгийн биелэлт"
            rules={[
              {
                required: false,
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
