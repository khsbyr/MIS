import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, DatePicker, Form, Input, Modal, Row, Checkbox } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import AutoCompleteSelect from '../../components/Autocomplete';
import { ToolsContext } from '../../context/Tools';
import { getService, postService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import validateMessages from '../../tools/validateMessage';
import ContentWrapper from './tabs/components/guidelines.style';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};

export default function TrainingModal(props) {
  const { Trainingcontroller, isModalVisible, isEditMode, orgID } = props;
  const toolsStore = useContext(ToolsContext);
  const [form] = Form.useForm();
  const [stateOrg, setStateOrg] = useState([]);
  const PAGESIZE = 20;
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);

  function onStartDateChange(date, value) {
    setStartDate(value);
  }

  function onEndDateChange(date, value) {
    setEndDate(value);
  }

  function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }

  useEffect(() => {
    getService('organization/get').then(result => {
      if (result) {
        setStateOrg(result.content || []);
      }
    });

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

    if (Trainingcontroller) {
      getService(
        `soum/getList/${
          Trainingcontroller && Trainingcontroller.address.aimag.id
        }`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });

      getService(
        `bag/getList/${
          Trainingcontroller && Trainingcontroller.address.soum.id
        }`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }

    if (isEditMode) {
      form.setFieldsValue({
        ...Trainingcontroller,
        OrgID: Trainingcontroller.organization
          ? Trainingcontroller.organization.id
          : '',
        CountryID: Trainingcontroller.address
          ? Trainingcontroller.address.country.id
          : '',
        AimagID: Trainingcontroller.address
          ? Trainingcontroller.address.aimag.id
          : '',
        SoumID: Trainingcontroller.address
          ? Trainingcontroller.address.soum.id
          : '',
        BagID: Trainingcontroller.address
          ? Trainingcontroller.address.bag.id
          : '',
        AddressDetail: Trainingcontroller.address
          ? Trainingcontroller.address.addressDetail
          : '',
        totalBudget: Trainingcontroller.trainingBudget
          ? Trainingcontroller.trainingBudget.totalBudget
          : '',
        performanceBudget: Trainingcontroller.trainingBudget
          ? Trainingcontroller.trainingBudget.performanceBudget
          : '',
      });
    }
  }, [Trainingcontroller, form, isEditMode]);

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
        values.organization = { id: orgID };
        values.trainingStartDate = startDate;
        values.trainingEndDate = endDate;
        values.address = {
          org: {
            id: values.OrgID,
          },
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
          addressDetail: values.AddressDetail,
        };
        values.isTrue = true;
        if (isEditMode) {
          putService(`training/update/${Trainingcontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('training/post', values)
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
        title="Сургалт бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1200}
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
                  <h4>Шалгуур үзүүлэлт сонгох</h4>
                  <Col xs={24} md={24} lg={24}>
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      onChange={onChange}
                    >
                      <Row>
                        <Col xs={24} md={24} lg={12}>
                          <Checkbox
                            value="A"
                            style={{ fontSize: '14px', color: '#4e4e4e' }}
                          >
                            {' '}
                            Шалгуур үзүүлэлт сонгох A
                          </Checkbox>
                        </Col>
                        <Col xs={24} md={24} lg={12}>
                          <Checkbox
                            value="B"
                            style={{ fontSize: '14px', color: '#4e4e4e' }}
                          >
                            Шалгуур үзүүлэлт сонгох B
                          </Checkbox>
                        </Col>
                        <br /> <br />
                        <Col xs={24} md={24} lg={12}>
                          <Checkbox
                            value="C"
                            style={{ fontSize: '14px', color: '#4e4e4e' }}
                          >
                            Шалгуур үзүүлэлт сонгох C
                          </Checkbox>
                        </Col>
                        <Col xs={24} md={24} lg={12}>
                          <Checkbox
                            value="D"
                            style={{ fontSize: '14px', color: '#4e4e4e' }}
                          >
                            Шалгуур үзүүлэлт сонгох D
                          </Checkbox>
                        </Col>
                      </Row>{' '}
                      <br />
                    </Checkbox.Group>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалтын нэр:"
                      name="name"
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
                      label="Төсөв:"
                      name="totalBudget"
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
                      label="Гүйцэтгэлийн төсөв:"
                      name="performanceBudget"
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
                      label="Оролцогчдын тоо:"
                      name="totalParticipants"
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
                    <Form.Item label="Эхэлсэн огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        placeholder="Эхэлсэн огноо:"
                        className="FormItem"
                        onChange={onStartDateChange}
                        defaultValue={
                          Trainingcontroller &&
                          moment(Trainingcontroller.trainingStartDate)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Дууссан огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        placeholder="Дууссан огноо:"
                        className="FormItem"
                        onChange={onEndDateChange}
                        defaultValue={
                          Trainingcontroller &&
                          moment(Trainingcontroller.trainingEndDate)
                        }
                      />
                    </Form.Item>
                  </Col>
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
                    <Form.Item
                      name="SoumID"
                      layout="vertical"
                      label="Сум, Дүүрэг:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateSum}
                        size="medium"
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
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateBag}
                        size="medium"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="OrgID"
                      layout="vertical"
                      label="Байгууллага:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateOrg}
                        size="medium"
                      />
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
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}