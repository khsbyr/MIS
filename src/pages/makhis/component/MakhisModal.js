import { Form, Input, message, Modal, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './makhisModal.style';
import validateMessages from '../../../tools/validateMessage';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { useToolsStore } from '../../../context/Tools';

export default function MakhisModal(props) {
  const { EditRow, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);

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

  useEffect(() => {
    if (EditRow !== undefined) {
      getService(`soum/getList/${EditRow.address?.aimag?.id}`).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(`bag/getList/${EditRow.address?.soum?.id}`).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        CountryID: EditRow?.address ? EditRow?.address?.country?.id : '',
        AimagID: EditRow?.address ? EditRow?.address?.aimag?.id : '',
        SoumID: EditRow?.address ? EditRow?.address?.soum?.id : '',
        BagID: EditRow?.address ? EditRow?.address?.bag?.id : '',
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.address = {
          addressDetail: values.AddressDetail,
          country: {
            id: 107,
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
        if (isEditMode) {
          putService(`makhisVeterinary/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`makhisVeterinary/post`, values)
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
      });
  };
  return (
    <div>
      <Modal
        title="Үйл аижллагаа бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={900}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  label="Мал эмнэлэгийн нэр:"
                  name="veterinaryName"
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
                <Form.Item label="Регистр:" name="register">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Улс:" name="CountryID">
                  <AutoCompleteSelect
                    defaultValue={[107]}
                    valueField="id"
                    data={toolsStore.countryList}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  label="Аймаг, хот:"
                  name="AimagID"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
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
                  rules={[
                    {
                      required: true,
                    },
                  ]}
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
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect valueField="id" data={stateBag} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
