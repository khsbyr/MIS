import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
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
  // const [setStateController] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    // getService('hotelTravelExpenses/get', {
    //   search: 'status:true',
    // }).then(result => {
    //   if (result) {
    //     setStateController(result.content || []);
    //   }
    // });

    if (isEditMode) {
      // getService(`hotelTravelExpenses/get${Roadcontroller.id}`).then(result => {
      //   Roadcontroller.userServiceId = result.userService.id;
      form.setFieldsValue({ ...Roadcontroller });
      // });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`hotelTravelExpenses/update/${Roadcontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('hotelTravelExpenses/post', values)
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

        // errorCatch(info);
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
            name="numberOfPeople"
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
            name="costPerDay"
            label="Хоногт /₮/"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Төлбөрийн төрөл"
            name="costType.name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="days"
            label="Хоног"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="total" label="Нийт">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}