import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import { getService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import { useToolsStore } from '../../../../context/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './attendance.style';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};
export default function TrainingGuidelinesModal(props) {
  const { Result, isModalVisible, trainingID } = props;
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [valueState, setStateValue] = useState([]);

  useEffect(() => {
    getService(`trainingGuidelines/get/${trainingID}`).then(result => {
      const value = result;
      setStateValue(value);
      form.setFieldsValue({
        ...result,
        subject: result.subject,
        CountryID: result.address.country.id,
        AimagID: result.address.aimag.id,
        SoumID: result.address.soum.id,
        BagID: result.address.bag.id,
        AddressDetail: result.address.addressDetail,
      });
    });

    if (Result) {
      getService(`soum/getList/${Result.address.aimag.id}`).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(`bag/getList/${Result.address.soum.id}`).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
  }, []);

  const getSum = aimagId => {
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
  };

  const selectAimag = value => {
    getSum(value);
  };

  const getBag = sumID => {
    getService(`bag/getList/${sumID}`, {}).then(result => {
      if (result) {
        setStateBag(result || []);
      }
    });
  };

  const selectSum = value => {
    getBag(value);
  };

  const onReset = () => {
    form.resetFields();
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.address = {
          addressDetail: values.AddressDetail,
          country: {
            id: values.CountryID,
          },
          aimag: {
            id: values.AimagID,
          },
          soum: {
            id: values.SoumID,
          },
          bag: {
            id: values.BagID,
          },
        };
        // if (isEditMode) {
        putService(`trainingGuidelines/update/${valueState.id}`, values)
          .then(() => {
            props.close(true);
          })
          .catch(error => {
            errorCatch(error);
          });
        // }
      })
      .catch(info => {
        errorCatch(info);
      });
  };
  return (
    <div>
      <Modal
        title="Сургалтын удирдамж"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1000}
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
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалтын сэдэв:"
                      name="subject"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалт зохион байгуулах үндэслэл:"
                      name="reason"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалтын зорилго:"
                      name="aim"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Хэрэгжүүлэх үйл ажиллагаа:"
                      name="operation"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Хүлээгдэж буй үр дүн:"
                      name="result"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <p style={{ color: '#7d7d7d', fontSize: '13px' }}>
                      Сургалт зохион байгуулагдах газар:
                    </p>
                  </Col>
                </Row>
                <Row style={{ maxWidth: '95%' }}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Улс:" name="CountryID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={toolsStore.countryList}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Аймаг, хот:" name="AimagID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={toolsStore.aimagList}
                        onChange={value => selectAimag(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="SoumID"
                      layout="vertical"
                      label="Сум, Дүүрэг:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateSum}
                        onChange={value => selectSum(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="BagID"
                      layout="vertical"
                      label="Баг, Хороо:"
                    >
                      <AutoCompleteSelect valueField="id" data={stateBag} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item label="Хаяг:" name="AddressDetail">
                      <Input.TextArea
                        style={{
                          width: '100%',
                          height: '110px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
