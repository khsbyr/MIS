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
    if (EditRow !== undefined) {
      getService(`soum/getList/${EditRow.address?.aimag?.id}`).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
    }
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
              message.success('?????????????????? ??????????????????');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`makhisFrequencyOfAnalysis/post/${serviceID}`, values)
            .then(() => {
              message.success('?????????????????? ??????????????????');
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
        title="?????????? ?????????? ?????????????? ?????????????????? ??????????????"
        okText="????????????????"
        cancelText="??????????"
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
                  <Form.Item label="????, ??????:">
                    <DatePicker
                      placeholder="?????????? ????????????"
                      onChange={date}
                      defaultValue={isEditMode ? moment(EditRow.date) : ''}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="?????? ????????????:" name="megNumber">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="??????????????:" name="fromWhere">
                    <Input />
                  </Form.Item>
                </Col>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="???????????????? ??????????????:">
                    <DatePicker
                      placeholder="?????????? ????????????"
                      onChange={validDate}
                      defaultValue={isEditMode ? moment(EditRow.validDate) : ''}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="??????????????????:" name="purpose">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="???????????????????????? ??????:" name="certificateNumber">
                    <Input />
                  </Form.Item>
                </Col>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="??????:" name="CountryID">
                    <AutoCompleteSelect
                      defaultValue={[107]}
                      valueField="id"
                      data={toolsStore.countryList}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <Form.Item
                    label="??????????, ??????:"
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
                    label="??????, ????????????:"
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
