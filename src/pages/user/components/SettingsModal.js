import { Col, Form, Input, Modal, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import AutocompleteSelect from '../../../components/Autocomplete';
import validateMessages from '../../../tools/validateMessage';
import { useToolsStore } from '../../../context/Tools';

export default function SettingsModal(props) {
  const { Usercontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }
  }, []);

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
        title="?????????????????? ??????????????"
        okText="????????????????"
        cancelText="??????????"
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
              <Form.Item label="??????:" name="firstname">
                <Input placeholder="??????..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="????????:" name="lastname">
                <Input placeholder="????????..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="???????????????????? ????????????:" name="register">
                <Input placeholder="???????????????????? ????????????..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="??????:" name="age">
                <Input type="number" placeholder="??????..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="????????:">
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>????</Radio>
                    <Radio value={2}>????</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="???????????? ????????????:" name="phoneNumber">
                <Input placeholder="???????????? ????????????..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="??????:">
                  <AutocompleteSelect
                    valueField="id"
                    data={toolsStore.countryList}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item
                  name="name"
                  layout="vertical"
                  label="??????????, ??????????????:"
                >
                  <AutocompleteSelect
                    valueField="id"
                    data={toolsStore.aimagList}
                    onChange={valData => selectAimag(valData)}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item name="name" layout="vertical" label="??????, ????????????:">
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
                <Form.Item name="name" layout="vertical" label="??????, ??????????:">
                  <AutocompleteSelect valueField="id" data={stateBag} />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="????????:" name="address">
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="???????????????? ???????????????? ???????? ??????????." name="check">
                <Input type="checkbox" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
