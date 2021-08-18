import { Form, InputNumber, message, Modal, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
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

export default function RoadModal(props) {
  const { Roadcontroller, isModalVisible, isEditMode, budgetID } = props;
  const [form] = Form.useForm();
  const [stateCostType, setStateCostType] = useState([]);
  const [stateCostID, setStateCostID] = useState([]);

  useEffect(() => {
    getService('costType/get').then(result => {
      if (result) {
        setStateCostType(result || []);
      }
    });
    if (isEditMode) {
      setStateCostID(Roadcontroller.costType.id);
      form.setFieldsValue({
        ...Roadcontroller,
        costID: Roadcontroller.costType ? Roadcontroller.costType.name : '',
      });
    }
  }, []);
  const selectCostType = value => {
    setStateCostID(value);
  };
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.costType = { id: stateCostID };
        if (isEditMode) {
          putService(`hotelTravelExpenses/update/${Roadcontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          values.costType = { id: values.costID };
          postService(`hotelTravelExpenses/post/${budgetID}`, values)
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
        title="Зам хоног, буудлын зардал"
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
              name="numberOfPeople"
              label="МЗҮБ хүний тоо:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
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
              <Input precision="0" suffix=" ₮" />
            </Form.Item>
            <Form.Item
              label="Төлбөрийн төрөл"
              name="costID"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <AutoCompleteSelect
                valueField="id"
                data={stateCostType}
                size="medium"
                onChange={value => selectCostType(value)}
              />
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
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
