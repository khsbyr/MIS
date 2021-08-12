import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../components/Autocomplete';
import MulticompleteSelect from '../../components/MulticompleteSelect';
import { getService, postService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import validateMessages from '../../tools/validateMessage';
import ContentWrapper from './tabs/components/training.style';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};
export default function TrainingModal(props) {
  const { Trainingcontroller, isModalVisible, isEditMode, trainingID } = props;
  const [form] = Form.useForm();
  const [stateOrg, setStateOrg] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateCriteria, setStateCriteria] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState();

  function onStartDateChange(date, value) {
    setStartDate(value);
  }

  function onEndDateChange(date, value) {
    setEndDate(value);
  }

  useEffect(() => {
    if (trainingID) {
      getService(`training/getCriteriaList/${trainingID}`).then(result => {
        if (result) {
          const list = result || [];
          setSelectedCriteria(list);
          if (isEditMode) {
            setStartDate(Trainingcontroller.trainingStartDate);
            setEndDate(Trainingcontroller.trainingEndDate);
            // console.log(Trainingcontroller);
            form.setFieldsValue({
              ...Trainingcontroller,
              CriteriaID: list.map(item => item.id),
              orgID: Trainingcontroller.organization
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
              trainingStartDate: Trainingcontroller
                ? Trainingcontroller.trainingStartDate
                : '',
              trainingEndDate: Trainingcontroller
                ? Trainingcontroller.trainingEndDate
                : '',
            });
          }
        }
      });
    } else {
      setSelectedCriteria([]);
    }
    getService('criteria/getListByForWhatId/1').then(result => {
      if (result) {
        setStateCriteria(result || []);
      }
    });

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
  }, [Trainingcontroller, form, isEditMode]);

  const SelectCriteria = value => {
    setSelectedCriteria(value);
  };
  // const selectCriterias = (value, criteriaID) => {
  //   setSelectedCriteria([value]);
  //   console.log(value);
  // };
  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  };
  const selectOrg = value => {};

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
        // values.criteriaIds = selectedCriteria;
        values.organization = { id: values.orgID };
        values.trainingStartDate = startDate;
        values.trainingEndDate = endDate;
        values.address = {
          org: {
            id: values.orgID,
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
          const saveData = {
            training: values,
            criteriaIds: values.CriteriaID,
          };
          putService(`training/update/${Trainingcontroller.id}`, saveData)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          const saveData = {
            training: values,
            criteriaIds: values.CriteriaID,
          };

          postService('training/post', saveData)
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
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      label="Шалгуур үзүүлэлт:"
                      name="CriteriaID"
                      valuePropName="option"
                    >
                      {selectedCriteria && (
                        <MulticompleteSelect
                          data={stateCriteria}
                          defaultValue={selectedCriteria.map(row => row.id)}
                          valueField="id"
                          size="medium"
                          onChange={value => SelectCriteria(value)}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      label="Сургалтын сэдэв:"
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
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Төсөв:" name="totalBudget">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      label="Гүйцэтгэлийн төсөв:"
                      name="performanceBudget"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  {/* <Col xs={24} md={24} lg={8}>
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
                  </Col> */}
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Эхэлсэн огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%' }}
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
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Дууссан огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%' }}
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
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Улс:" name="CountryID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateCountry}
                        size="medium"
                        onChange={value => selectCountry(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
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
                  <Col xs={24} md={24} lg={8}>
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
                  <Col xs={24} md={24} lg={8}>
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
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      name="orgID"
                      layout="vertical"
                      label="Байгууллага:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        onChange={value => selectOrg(value)}
                        data={stateOrg}
                        size="medium"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item label="Хаяг:" name="AddressDetail">
                      <TextArea style={{ width: '100%', height: '80px' }} />
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
