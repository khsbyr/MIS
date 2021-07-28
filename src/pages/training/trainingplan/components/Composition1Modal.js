import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import AutocompleteSelect from '../../../../components/Autocomplete';
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

export default function Composition1Modal(props) {
  const { Composition, isModalVisible, isEditMode } = props;
  const [stateController, setStateController] = useState([]);
  const [stateController1, setStateController1] = useState([]);
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
      // getService("" + Composition.id).then((result) => {
      //     Composition.userServiceId = result.userService.id
      form.setFieldsValue({ ...Composition });
      // })
    }
  }, []);
  useEffect(() => {
    getService('trainingPlan/getParents/1', {
      search: 'status:true',
    }).then(result => {
      if (result) {
        setStateController1(result.content || []);
      }
    });

    if (isEditMode) {
      // getService("" + Composition.id).then((result) => {
      //     Composition.userServiceId = result.userService.id
      form.setFieldsValue({ ...Composition });
      // })
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`trainingPlan/update${Composition.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('trainingPlan/post', values)
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
        title="Бүрэлдэхүүн бүртгэх"
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
          <Form.Item name="name" label="Сургалтын нэрс:">
            <AutocompleteSelect valueField="name" data={stateController1} />{' '}
          </Form.Item>
          <Form.Item name="code" label="Код:">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Сургалтын нэр:">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Шалгуур үзүүлэлтийн нэр:">
            <AutocompleteSelect data={stateController} valueField="name" />{' '}
          </Form.Item>
          <Form.Item name="gender" label="Хүйс:">
            <AutocompleteSelect valueField="name" />{' '}
          </Form.Item>
          <Form.Item name="upIndicator" label="Зорилтот үр дүн">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
