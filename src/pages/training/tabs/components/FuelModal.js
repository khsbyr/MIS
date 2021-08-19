import { Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './budgets.style';

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

export default function FuelModal(props) {
  const { Fuelcontroller, isModalVisible, isEditMode, budgetID } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    // getService('fuelExpenses/get', {
    //   search: 'status:true',
    // }).then(result => {
    //   if (result) {
    //     setStateController(result.content || []);
    //   }
    // });

    if (isEditMode) {
      form.setFieldsValue({ ...Fuelcontroller });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`fuelExpenses/update/${Fuelcontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`fuelExpenses/post/${budgetID}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
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
        title="Шатахууны зардал /маршрутаар/"
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
              name="route"
              label="Маршрут:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="roadLength"
              label="Замын урт /км/:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="regionalSupplement"
              label="Бүсийн нэмэгдэл /%/:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="fuelConsumption"
              label="Зарцуулах шатахуун /л/"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="fuelCost"
              label="Шатахууны үнэ /₮/ A92"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input precision="0" suffix=" ₮" />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
