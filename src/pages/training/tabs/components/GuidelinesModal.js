import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faCalendarAlt,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import AutocompleteSelect from '../../../../components/Autocomplete';
import { ToolsContext } from '../../../../context/Tools';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './guidelines.style';
import ParticipantsModal from './ParticipantsModal';
import TrainingGuidelinesModal from './TrainingGuidelinesModal';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};

let editRow;
let isEditModeParticipants;
let isEditModeGuidelines;

export default function GuidelinesModal(props) {
  const { Guidelinescontroller, isModalVisible, isEditMode, orgID } = props;
  const [isModalVisibleParticipants, setIsModalVisibleParticipants] =
    useState(false);
  const [isModalVisibleGuidelines, setIsModalVisibleGuidelines] =
    useState(false);
  const toolsStore = useContext(ToolsContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [list, setList] = useState([]);
  const [listguidelines] = useState([]);
  const [form] = Form.useForm();
  const [stateOrga, setStateOrga] = useState([]);
  const [statePlan, setStatePlan] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const PAGESIZE = 20;
  const [TrainingPlanID, setTrainingPlanID] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [setStateValue] = useState([]);

  const [lazyParams] = useState({
    page: 0,
  });
  const loadLazyTimeout = null;

  function onStartDateChange(date, value) {
    setStartDate(value);
  }

  function onEndDateChange(date, value) {
    setEndDate(value);
  }

  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Guidelinescontroller !== null) {
      getService(`participants/getList/${Guidelinescontroller.id}`, list)
        .then(result => {
          const listResult = result.content || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setList(listResult);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });

      getService(`trainingGuidelines/get/${trainingID}`).then(result => {
        const value = result;
        setStateValue(value);
        form.setFieldsValue({
          ...result,
          // subject: result.subject,
          // CountryID: result.address.country.id,
          // AimagID: result.address.aimag.id,
          // SoumID: result.address.soum.id,
          // BagID: result.address.bag.id,
          // AddressDetail: result.address.addressDetail,
        });
      });
    }
  };

  useEffect(() => {
    onInit();
    getService('organization/get').then(result => {
      if (result) {
        setStateOrga(result.content || []);
      }
    });
    getService('trainingPlan/get').then(result => {
      if (result) {
        setStatePlan(result.content || []);
        // console.log(training_plan.name)
        // training_plan.id =
        // stateplanID(planID)
      }
    });
    if (Guidelinescontroller !== null) {
      getService(`training/get/${Guidelinescontroller.id}`).then(result => {
        if (result) {
          setTrainingID(Guidelinescontroller.id);
        }
      });

      if (isEditMode) {
        form.setFieldsValue({
          ...Guidelinescontroller,
          TrainingPlanName: Guidelinescontroller.training_plan.name,
          OrganizationName: Guidelinescontroller.organization.name,
        });
      }
    }
  }, []);

  const selectTrainingPlan = trainingPlanID => {
    setTrainingPlanID(trainingPlanID);
  };

  const edit = row => {
    editRow = row;
    isEditModeParticipants = true;
    setIsModalVisibleParticipants(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`participants/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirm(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeleted(row);
        onInit();
      },
      onCancel() {},
    });
  }

  const pop = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  const action = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => edit(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => pop(row)}
      />
    </>
  );

  const editUdirdamj = row => {
    editRow = row;
    isEditModeGuidelines = true;
    setIsModalVisibleGuidelines(true);
  };

  const addUdirdamj = () => {
    setIsModalVisibleGuidelines(true);
    isEditModeGuidelines = false;
  };

  const add = () => {
    setIsModalVisibleParticipants(true);
    isEditModeParticipants = false;
  };

  const closeModal = (isSuccess = false) => {
    setIsModalVisibleParticipants(false);

    if (isSuccess) onInit();
  };

  const closeModalUdirdamj = (isSuccess = false) => {
    setIsModalVisibleGuidelines(false);

    if (isSuccess) onInit();
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.organization = { id: orgID };
        values.training_plan = { id: TrainingPlanID };
        values.trainingStartDate = startDate;
        values.trainingEndDate = endDate;
        if (isEditMode) {
          setTrainingPlanID(Guidelinescontroller.training_plan.id);
          putService(`training/update/${Guidelinescontroller.id}`, values)
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
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item
                      layout="vertical"
                      label="Сургалтын төлөвлөгөө:"
                      name="TrainingPlanName"
                    >
                      <AutocompleteSelect
                        valueField="id"
                        data={statePlan}
                        placeholder="Сургалтын төлөвлөгөө"
                        onChange={value => selectTrainingPlan(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item label="Сургалтын нэр:" name="name">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item label="Төсөв:" name="totalBudget">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item
                      label="Гүйцэтгэлийн төсөв:"
                      name="performanceBudget"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item label="Эхэлсэн огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        placeholder="Эхэлсэн огноо:"
                        className="FormItem"
                        onChange={onStartDateChange}
                        defaultValue={
                          Guidelinescontroller &&
                          moment(Guidelinescontroller.trainingStartDate)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item label="Дууссан огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        placeholder="Дууссан огноо:"
                        className="FormItem"
                        onChange={onEndDateChange}
                        defaultValue={
                          Guidelinescontroller &&
                          moment(Guidelinescontroller.trainingEndDate)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item
                      label="Оролцогчдын тоо:"
                      name="participantsNumber"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Сургалтын оролцогчид:">
                  <Button
                    type="text"
                    className="export"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={add}
                  >
                    Нэмэх
                  </Button>
                  <DataTable
                    value={list}
                    removableSort
                    paginator
                    rows={5}
                    className="p-datatable-responsive-demo"
                    selection={selectedRows}
                    // onRowClick={edit}
                    onSelectionChange={e => {
                      setSelectedRows(e.value);
                    }}
                    dataKey="id"
                  >
                    <Column field="index" header="№" />
                    <Column field="name" header="Нэр" filter />
                    <Column field="phone" header="Утас" filter />
                    <Column headerStyle={{ width: '7rem' }} body={action} />
                  </DataTable>
                  {isModalVisibleParticipants && (
                    <ParticipantsModal
                      ParticipantsModalController={editRow}
                      isModalVisible={isModalVisibleParticipants}
                      close={closeModal}
                      isEditMode={isEditModeParticipants}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Сургалтын удирдамж:">
                  <Button
                    type="text"
                    className="export"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={editUdirdamj}
                  >
                    Харах
                  </Button>
                  <Button
                    type="text"
                    className="export"
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={addUdirdamj}
                  >
                    Нэмэх
                  </Button>
                  <DataTable
                    value={listguidelines}
                    removableSort
                    paginator
                    rows={5}
                    className="p-datatable-responsive-demo"
                    selection={selectedRows}
                    // onRowClick={edit}
                    onSelectionChange={e => {
                      setSelectedRows(e.value);
                    }}
                    dataKey="id"
                  >
                    <Column field="index" header="№" />
                    <Column field="subject" header="Нэр" filter />
                    <Column field="phone" header="Утас" filter />
                    <Column headerStyle={{ width: '7rem' }} body={action} />
                  </DataTable>
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
                      {/* <Row style={{ maxWidth: '95%' }}>
                        <Col xs={24} md={24} lg={12}>
                          <Form.Item label="Улс:" name="CountryID">
                            <AutoCompleteSelect
                              valueField="id"
                              data={stateCountry}
                              onChange={value => selectCountry(value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={12}>
                          <Form.Item label="Аймаг, хот:" name="AimagID">
                            <AutoCompleteSelect
                              valueField="id"
                              data={stateAimag}
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
                            <AutoCompleteSelect
                              valueField="id"
                              data={stateBag}
                            />
                          </Form.Item>
                        </Col>
                      </Row> */}
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
                      {/* <Button htmlType="button" onClick={onReset}>
                        Reset
                      </Button> */}
                    </Col>
                  </Row>
                  {isModalVisibleGuidelines && (
                    <TrainingGuidelinesModal
                      TrainingGuidelinesModalController={editRow}
                      isModalVisible={isModalVisibleGuidelines}
                      close={closeModalUdirdamj}
                      isEditMode={isEditModeGuidelines}
                      trainingID={trainingID}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
