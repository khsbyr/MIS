import { Col, Form, message, Modal, Row, Input, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../more/certificate.style';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { useToolsStore } from '../../../context/Tools';

export default function CertificateModal(props) {
  const { EditRow, isModalVisible, isEditMode, serviceID } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [dateValue, setDateValue] = useState();
  const [validDateValue, setValidDateValue] = useState();

  function date(event, value) {
    setDateValue(value);
  }

  function validDate(event, value) {
    setValidDateValue(value);
  }

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

  useEffect(() => {
    getService(`soum/getList/${EditRow.address?.aimag?.id}`).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        CountryID: EditRow?.address ? EditRow?.address?.country?.id : '',
        AimagID: EditRow?.address ? EditRow?.address?.aimag?.id : '',
        SoumID: EditRow?.address ? EditRow?.address?.soum?.id : '',
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.address = {
          country: {
            id: 107,
          },
          aimag: {
            id: values.AimagID,
          },
          soum: {
            id: values.SoumID,
          },
          bag: null,
        };
        values.validDate = validDateValue;
        values.date = dateValue;
        if (isEditMode) {
          putService(`makhisFrequencyOfAnalysis/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`makhisFrequencyOfAnalysis/post/${serviceID}`, values)
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
        title="Малын гарал үүслийн гэрчилгээ бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1100}
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
            <Row gutter={30}>
              <Col xs={24} md={24} lg={8}>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="Он, сар:" name="date">
                    <DatePicker
                      placeholder="Огноо сонгох"
                      onChange={date}
                      defaultValue={
                        isEditMode ? moment(EditRow.date).zone(0) : ''
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="МЭГ дугаар:" name="megNumber">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="Хаанаас:" name="fromWhere">
                    <Input />
                  </Form.Item>
                </Col>
              </Col>
              <Col Col xs={24} md={24} lg={8}>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="Он, сар:" name="validDate">
                    <DatePicker
                      placeholder="Огноо сонгох"
                      onChange={validDate}
                      defaultValue={
                        isEditMode ? moment(EditRow.validDate).zone(0) : ''
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="Зориулалт:" name="purpose">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="Гэрчилгээний тоо:" name="certificateNumber">
                    <Input />
                  </Form.Item>
                </Col>
              </Col>
              <Col Col xs={24} md={24} lg={8}>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="Улс:" name="CountryID">
                    <AutoCompleteSelect
                      defaultValue={[107]}
                      valueField="id"
                      data={toolsStore.countryList}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
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
                <Col xs={24} md={24} lg={24}>
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
                    <AutoCompleteSelect valueField="id" data={stateSum} />
                  </Form.Item>
                </Col>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
