import { Col, Form, Input, Modal, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import AutocompleteSelect from '../../../components/Autocomplete';
import validateMessages from '../../../tools/validateMessage';

export default function SettingsModal(props) {
  const { Usercontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateCountry, setStateCountry] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    getService('country/get').then(result => {
      if (result) {
        setStateCountry(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }
  }, []);

  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }
  };

  const selectCountry = val => {
    getAimag(val);
  };

  const getSum = aimagId => {
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }
  };

  const selectAimag = valData => {
    getSum(valData);
  };

  const getBag = sumID => {
    getService(`bag/getList/${sumID}`, {}).then(result => {
      if (result) {
        setStateBag(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }
  };

  const selectSum = val => {
    getBag(val);
  };

  const onChange = e => {
    getService(`gender/get/${e.target.value}`);
    setValue(e.target.value);
  };
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`user/update${Usercontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('user/saveByAdmin/', values)
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
        title="Хэрэглэгч бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1000}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <Form
          form={form}
          labelAlign="left"
          name="nest-messages"
          layout="vertical"
          validateMessages={validateMessages}
        >
          <Row gutter={32}>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Нэр:" name="firstname">
                <Input placeholder="Нэр..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Овог:" name="lastname">
                <Input placeholder="Овог..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Регистрийн дугаар:" name="register">
                <Input placeholder="Регистрийн дугаар..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Нас:" name="age">
                <Input type="number" placeholder="Нас..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="Хүйс:">
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>эр</Radio>
                    <Radio value={2}>эм</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Утасны дугаар:" name="phoneNumber">
                <Input placeholder="Утасны дугаар..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="Улс:">
                  <AutocompleteSelect
                    valueField="id"
                    data={stateCountry}
                    onChange={val => selectCountry(val)}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item
                  name="name"
                  layout="vertical"
                  label="Аймаг, Нийслэл:"
                >
                  <AutocompleteSelect
                    valueField="id"
                    data={stateAimag}
                    onChange={valData => selectAimag(valData)}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="Сум, Дүүрэг:">
                  <AutocompleteSelect
                    valueField="id"
                    data={stateSum}
                    onChange={val => selectSum(val)}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="Баг, Хороо:">
                  <AutocompleteSelect valueField="id" data={stateBag} />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Хаяг:" name="address">
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Оруулсан мэдээлэл үнэн болно." name="check">
                <Input type="checkbox" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
