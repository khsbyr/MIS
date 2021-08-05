/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio, Space, InputNumber } from 'antd';
import { postService, putService } from '../../../service/service';
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

export default function CriteriaModal(props) {
  const { Criteriacontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [value, setValue] = React.useState(1);
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...Criteriacontroller,
      });
    }
  }, []);

  const onChange = e => {
    setValue(e.target.value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`criteria/update/${Criteriacontroller.id}`, values)
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
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="resultTobeAchieved"
            label="Хүрэх үр дүн:"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="processResult"
            label="Үр дүнгийн биелэлт"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="percentIndicator"
            label="Шалгуур үзүүлэлтийн төрөл"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Radio.Group
              value={value}
              onChange={onChange}
              className="radioButton"
            >
              <Space direction="vertical">
                <Radio value={1}>Тоо</Radio>
                <Radio value={2}>Хувь</Radio>
                <Radio value={3}>Томъё</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
