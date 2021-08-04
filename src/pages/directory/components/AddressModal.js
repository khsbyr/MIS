import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
// import ReactInputSelect from 'react-input-select';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/guidelines.style';
import validateMessages from '../../../tools/validateMessage';

const [values1, callback, selected] = useState([]);

export default function AddressModal(props) {
  const { Addresscontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateCountry, setStateCountry] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  useEffect(() => {
    getService('country/get').then(result => {
      if (result) {
        setStateCountry(result || []);
      }
    });

    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (Addresscontroller !== undefined) {
      if (Addresscontroller.address) {
        getService(`soum/getList/${Addresscontroller.address.aimag.id}`).then(
          result => {
            if (result) {
              setStateSum(result || []);
            }
          }
        );

        getService(`bag/getList/${Addresscontroller.address.soum.id}`).then(
          result => {
            if (result) {
              setStateBag(result || []);
            }
          }
        );
      }
    }

    if (isEditMode) {
      form.setFieldsValue({
        ...Addresscontroller,
        CountryID: Addresscontroller.address
          ? Addresscontroller.address.country.id
          : '',
        AimagID: Addresscontroller.address
          ? Addresscontroller.address.aimag.id
          : '',
        SoumID: Addresscontroller.address
          ? Addresscontroller.address.soum.id
          : '',
        BagID: Addresscontroller.address
          ? Addresscontroller.address.bag.id
          : '',
      });
    }
  }, [Addresscontroller, form, isEditMode]);
  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  };

  const selectCountry = value => {
    getAimag(value);
  };

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
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.address = {
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
        values.isTrue = true;
        if (isEditMode) {
          putService(`country/update/${Addresscontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('country/post', values)
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
        title="Улс бүртгэх"
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
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Улс:" name="CountryID">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateCountry}
                    size="medium"
                    onChange={value => selectCountry(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  name="AimagID"
                  layout="vertical"
                  label="Аймаг, Нийслэл:"
                >
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateAimag}
                    size="medium"
                    onChange={value => selectAimag(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="SoumID" layout="vertical" label="Сум, Дүүрэг:">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateSum}
                    size="medium"
                    onChange={value => selectSum(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateBag}
                    size="medium"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                  <select
                    defaultValue={selected}
                    onChange={({ target: { value } }) => callback(value)}
                  >
                    {values1.map(([value, text]) => (
                      <option value={value}>{text}</option>
                    ))}
                  </select>{' '}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
