import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import AutocompleteSelect from '../../../../components/Autocomplete';
import { ToolsContext } from '../../../../context/Tools';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import ContentWrapper from './guidelines.style';
import ParticipantsModal from './ParticipantsModal';
import TrainingGuidelinesModal from './TrainingGuidelinesModal';
import validateMessages from '../../../../tools/validateMessage';

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
  const { Guidelinescontroller, isModalVisible, isEditMode } = props;
  const toolsStore = useContext(ToolsContext);
  const [isModalVisibleParticipants, setIsModalVisibleParticipants] =
    useState(false);
  const [isModalVisibleGuidelines, setIsModalVisibleGuidelines] =
    useState(false);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [stateParticipants, setStateParticipants] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const [form] = Form.useForm();
  const [stateOrga, setStateOrga] = useState([]);
  const [statePlan, setStatePlan] = useState([]);

  const PAGESIZE = 20;
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const loadLazyTimeout = null;

  function DateOnChange(date, dateString) {
    console.log(date, dateString);
  }

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`participants/getList/${Guidelinescontroller.id}`, list)
      .then(result => {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      })
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
    getService('trainingGuidelines/get/', list1)
      .then(result => {
        const listResult1 = result.content || [];
        listResult1.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList1(listResult1);
        setSelectedRows([]);
      })
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
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

    getService(
      `soum/getList/${Guidelinescontroller.training_guidelines.address.aimag.id}`
    ).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
    getService(
      `bag/getList/${Guidelinescontroller.training_guidelines.address.soum.id}`
    ).then(result => {
      if (result) {
        setStateBag(result || []);
      }
    });

    if (isEditMode) {
      form.setFieldsValue({
        ...Guidelinescontroller,
        CountryID: Guidelinescontroller.training_guidelines.address.country.id,
        AimagID: Guidelinescontroller.training_guidelines.address.aimag.id,
        SoumID: Guidelinescontroller.training_guidelines.address.soum.id,
        BagID: Guidelinescontroller.training_guidelines.address.bag.id,
        AddressDetail:
          Guidelinescontroller.training_guidelines.address.addressDetail,
        trainingStartDate:
          Guidelinescontroller.training_guidelines.trainingStartDate,
        Subject: Guidelinescontroller.training_guidelines.subject,
        Reason: Guidelinescontroller.training_guidelines.reason,
        Aim: Guidelinescontroller.training_guidelines.aim,
        Operation: Guidelinescontroller.training_guidelines.operation,
        Result: Guidelinescontroller.training_guidelines.result,
      });
    }
  }, []);

  const edit = row => {
    editRow = row;
    isEditModeParticipants = true;
    // isEditModeGuidelines = true;
    setIsModalVisibleParticipants(true);
    // setIsModalVisibleGuidelines(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`participants/delete/${row.id}`)
      .then(result => {
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
    // isEditModeParticipants = true;
    isEditModeGuidelines = true;
    // setIsModalVisibleParticipants(true);
    setIsModalVisibleGuidelines(true);
  };

  const actionUdirdamj = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editUdirdamj(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => pop(row)}
      />
    </>
  );

  const addUdirdamj = () => {
    setIsModalVisibleGuidelines(true);
    // setIsModalVisibleParticipants(true);
    isEditModeParticipants = false;
    // isEditModeGuidelines = false;
  };

  const add = () => {
    // setIsModalVisibleGuidelines(true);
    setIsModalVisibleParticipants(true);
    // isEditModeParticipants = false;
    isEditModeGuidelines = false;
  };

  const closeModal = (isSuccess = false) => {
    setIsModalVisibleParticipants(false);
    // setIsModalVisibleGuidelines(false);

    if (isSuccess) onInit();
  };

  const closeModalUdirdamj = (isSuccess = false) => {
    // setIsModalVisibleParticipants(false);
    setIsModalVisibleGuidelines(false);

    if (isSuccess) onInit();
  };

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

  const getPlans = planId => {
    getService(`trainingPlan/get/${planId}`, {}).then(result => {
      console.log(result);
    });
  };

  const selectPlan = value => {
    getPlans(value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`training/update/${Guidelinescontroller.id}`, values)
            .then(result => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('training/post', values)
            .then(result => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
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
                    <Form.Item layout="vertical" label="Байгууллага сонгох:">
                      <AutocompleteSelect
                        valueField="id"
                        data={stateOrga}
                        placeholder="Байгууллага сонгох"
                        // onChange={(value) => selectOrgs(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item layout="vertical" label="Сургалтын төлөвлөгөө:">
                      <AutocompleteSelect
                        valueField="id"
                        data={statePlan}
                        placeholder="Сургалтын төлөвлөгөө"
                        // onChange={(value) => selectOrgs(value)}
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
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item
                      label="Гүйцэтгэлийн төсөв:"
                      name="performanceBudget"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item label="Эхэлсэн огноо:" name="trainingStartDate">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={6}>
                    <Form.Item label="Дууссан огноо:" name="trainingEndDate">
                      <Input />
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
                    onClick={addUdirdamj}
                  >
                    Нэмэх
                  </Button>
                  <DataTable
                    value={list1}
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
                    <Column field="subject" header="Сургалтын сэдэв" filter />
                    <Column
                      field="reason"
                      header="Сургалт зохион байгуулах үндэслэл"
                    />
                    <Column field="aim" header="Сургалтын зорилго" />
                    <Column
                      field="operation"
                      header="Хэрэгжүүлэх үйл ажиллагаа"
                    />
                    <Column field="result" header="Хүлэгдэж буй үр дүн 1" />
                    <Column
                      headerStyle={{ width: '7rem' }}
                      body={actionUdirdamj}
                    />
                  </DataTable>
                  {isModalVisibleGuidelines && (
                    <TrainingGuidelinesModal
                      TrainingGuidelinesModalController={editRow}
                      isModalVisible={isModalVisibleGuidelines}
                      close={closeModalUdirdamj}
                      isEditMode={isEditModeGuidelines}
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
