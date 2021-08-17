import { Form, Input, Modal, message, InputNumber } from 'antd';
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

export default function StationaryModal(props) {
  const { Stationarycontroller, isModalVisible, isEditMode, budgetID } = props;
  // const [setStateController] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    // getService('stationeryExpenses/get', {
    //   search: 'status:true',
    // }).then(result => {
    //   if (result) {
    //     setStateController(result.content || []);
    //   }
    // });

    if (isEditMode) {
      form.setFieldsValue({ ...Stationarycontroller });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(
            `stationeryExpenses/update/${Stationarycontroller.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`stationeryExpenses/post/${budgetID}`, values)
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
              name="costName"
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
              name="unitPrice"
              label="Нэгж үнэ:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input precision="0" suffix=" ₮" />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Тоо ширхэг:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="numberOfPeople"
              label="Хүний тоо"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
