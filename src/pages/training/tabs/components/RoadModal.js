import { Form, Input, Modal } from 'antd';
import React, { useEffect, useState, message } from 'react';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import AutoCompleteSelect from '../../../../components/Autocomplete';

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

  useEffect(() => {
    getService('costType/get').then(result => {
      if (result) {
        setStateCostType(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...Roadcontroller,
        costID: Roadcontroller.costType ? Roadcontroller.costType.id : '',
      });
    }
  }, []);
  const selectCostType = value => {};
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.costType = { id: values.costID };
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
          postService(`hotelTravelExpenses/post/${budgetID}`, values)
            .then(() => {
              // message.success('Амжилттай хадгаллаа');
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
            name="costID"
            // rules={[
            //   {
            //     required: true,
            //   },
            // ]}
          >
            <AutoCompleteSelect
              valueField="id"
              data={stateCostType}
              size="medium"
              onChange={value => selectCostType(value)}
            />{' '}
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
