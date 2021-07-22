import { ExclamationCircleOutlined } from "@ant-design/icons";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { traverseTwoPhase } from "react-dom/test-utils";
import AutocompleteSelect from "../../../../components/Autocomplete";
import { isShowLoading } from "../../../../context/Tools";
import {
  getService,
  postService,
  putService,
} from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./guidelines.style";
import ParticipantsModal from "./ParticipantsModal";
import TrainingGuidelinesModal from "./TrainingGuidelinesModal";

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};
const validateMessages = {
  required: "${label} хоосон байна!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
var editRow;
var isEditModeParticipants;
var isEditModeGuidelines;

export default function GuidelinesModal(props) {
  const { Guidelinescontroller, isModalVisible, isEditMode, orgID, planID } = props;
  const [isModalVisibleParticipants, setIsModalVisibleParticipants] =
    useState(false);
  const [isModalVisibleGuidelines, setIsModalVisibleGuidelines] =
    useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const [stateOrga, setStateOrga] = useState([]);
  const [statePlan, setStatePlan] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [stateplanID, setStateplanID] = useState([]);
  const PAGESIZE = 20;
  const [TrainingPlanID, setTrainingPlanID] = useState([]);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  let loadLazyTimeout = null;

  useEffect(() => {
    onInit();
    getService("organization/get").then((result) => {
      if (result) {
        setStateOrga(result.content || []);
      }
    });
    getService("trainingPlan/get").then((result) => {
      if (result) {
        setStatePlan(result.content || []);
        console.log(result.content)
        // training_plan.id = 
        // stateplanID(planID)
      }
    });
    if(Guidelinescontroller!==null){
    getService("training/get/" + Guidelinescontroller.id).then((result) => {
      if(result){
        setTrainingID(Guidelinescontroller.id)
      }
    });

    if (isEditMode) {
      form.setFieldsValue({
        ...Guidelinescontroller,
        TrainingPlanName: Guidelinescontroller.training_plan.name,
        OrganizationName: Guidelinescontroller.organization.name,
      });
    }}
  }, []);

  const selectTrainingPlan = (TrainingPlanID) => {
    console.log(TrainingPlanID)
    setTrainingPlanID(TrainingPlanID);
  }

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if(Guidelinescontroller!==null){
    getService("participants/getList/" + Guidelinescontroller.id, list)
      .then((result) => {
        let list = result.content || [];
        list.map(
          (item, index) => (item.index = lazyParams.page * PAGESIZE + index + 1)
        );
        setList(list);
        setSelectedRows([]);
      })
      .catch((error) => {
        errorCatch(error);
        isShowLoading(false);
      });
    // getService("trainingGuidelines/get", list1)
    //   .then((result) => {
    //     let list1 = result.content || [];
    //     list1.map(
    //       (item, index) => (item.index = lazyParams.page * PAGESIZE + index + 1)
    //     );
    //     setList1(list1);
    //     setSelectedRows([]);
    //   })
    //   .catch((error) => {
    //     errorCatch(error);
    //     isShowLoading(false);
    //   });
    }
  };

  const action = (row) => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const edit = (row) => {
    editRow = row;
    isEditModeParticipants = true;
    setIsModalVisibleParticipants(true);
  };

  const editUdirdamj = (row) => {
    editRow = row;
    isEditModeGuidelines = true;
    setIsModalVisibleGuidelines(true);
  };

  const pop = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    } else {
      confirm(row);
    }
  };

  // const actionUdirdamj = (row) => {
  //   return (
  //     <React.Fragment>
  //       <Button
  //         type="text"
  //         icon={<FontAwesomeIcon icon={faPen} />}
  //         onClick={() => editUdirdamj(row)}
  //       />
  //       <Button
  //         type="text"
  //         icon={<FontAwesomeIcon icon={faTrash} />}
  //         onClick={() => pop(row)}
  //       />
  //     </React.Fragment>
  //   );
  // };

  // const addUdirdamj = () => {
  //   setIsModalVisibleGuidelines(true);
  //   // isEditModeParticipants = false;
  //   isEditModeGuidelines = false;

  // };

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

  const handleDeleted = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    }

    putService("participants/delete/" + row.id)
      .then((result) => {
        message.success("Амжилттай устлаа");
        onInit();
      })
      .catch((error) => {
        errorCatch(error);
      });
  };
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.organization = {id: orgID}
        values.training_plan = {id: TrainingPlanID }
        if (isEditMode) {
          putService("training/update/" + Guidelinescontroller.id, values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
          postService("training/post", values)
          debugger
          console.log(values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
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
            labelAlign={"left"}
            {...layout}
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                  {/* <Col xs={24} md={24} lg={6}>
                    <Form.Item
                      layout="vertical"
                      label="Байгууллага сонгох:"
                      name="OrganizationName"
                    >
                      <AutocompleteSelect
                        valueField="id"
                        data={stateOrga}
                        placeholder="Байгууллага сонгох"
                      />
                    </Form.Item>
                  </Col> */}
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
                        onChange={(value) => selectTrainingPlan(value)}
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
                    onSelectionChange={(e) => {
                    setSelectedRows(e.value);
                    }}
                    dataKey="id"
                  >
                    <Column field="index" header="№" />
                    <Column field="name" header="Нэр" filter />
                    <Column field="phone" header="Утас" filter />
                    <Column headerStyle={{ width: "7rem" }} body={action} />
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
  function confirm(row) {
    Modal.confirm({
      title: "Та устгахдаа итгэлтэй байна уу ?",
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: "Устгах",
      cancelText: "Буцах",
      onOk() {
        handleDeleted(row);
        onInit();
      },
      onCancel() {},
    });
  }
}
