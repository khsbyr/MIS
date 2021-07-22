import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, message, Modal, Row } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
import ContentWrapper from "../../criteria/criteria.style";
import PlanModal from "../training/components/PlanModal";
import OrgaStyle   from "./components/orga.style";
import AutoCompleteSelect from "../../../components/Autocomplete";

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

var editRow;
var isEditMode;
const Plan = () => {
  let loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateOrga, setStateOrga] = useState([]);
  const [stateGuide, setStateGuide] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [orgID, setOrgID] = useState([]);


  useEffect(() => {
    onInit();
    getService("organization/get").then((result) => {
      if (result) {
        setStateOrga(result.content || []);
      }
    });
    getService("training/get").then((result) => {
      if (result) {
        setStateGuide(result.content || []);
      }
    });
  }, [lazyParams]);

  const selectOrgs = (value) => {
    getGuidelines(value);
  };

  const selectGuide = (value) => {
    getParti(value);
  };

  const getGuidelines = (orgId) => {
      getService(`training/getList/${orgId}`, {}).then((result) => {
        if (result) {
          setStateGuide(result || []);
          setOrgID(orgId);
        }
      });
  };

  const getParti = (trainingID) => {
    getService(`trainingTeam/getList/${trainingID}`, {}).then((result) => {
      if (result) {
        let list = result || [];
        list.map(
          (item, index) =>
            (item.index = lazyParams.page * PAGESIZE + index + 1)
        );
        setTrainingID(trainingID);
        setList(list);
        setSelectedRows([]);
      }
    });
  };

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
      getService("trainingTeam/get", list)
        .then((result) => {
          let list = result || [];
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
  };

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
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
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    }
    putService("trainingTeam/delete/" + row.id)
      .then((result) => {
        message.success("Амжилттай устлаа");
        onInit();
      })
      .catch((error) => {
        errorCatch(error);
      });
  };
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };
  const pop = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    } else {
      confirm(row);
    }
  };

  const indexBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">№</span>
        {row.index}
      </React.Fragment>
    );
  };

  const missionBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Сургалтанд гүйцэтгэх үүрэг</span>
        {row.mission}
      </React.Fragment>
    );
  };

  const nameUserBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Ажилчдын нэрс</span>
        {row.user && row.user.firstname}
      </React.Fragment>
    );
  };

  const nameTrainerBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Багшийн нэрс</span>
        {row.trainers && row.trainers.firstName}
      </React.Fragment>
    );
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={6}>
                <p className="title">Сургалтын баг</p>
              </Col>
              <Col xs={24} md={24} lg={18}>
                <Row gutter={[0, 15]}>
                <Col xs={8} md={8} lg={6}>
                  <OrgaStyle>
                      <AutoCompleteSelect                  
                          valueField="id"
                          placeholder="Байгууллага сонгох"
                          data={stateOrga}
                          onChange={(value) => selectOrgs(value)}
                      />
                      </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
                    
                  <OrgaStyle>                
                      <AutoCompleteSelect                  
                          valueField="id"
                          placeholder="Сургалт сонгох"
                          data={stateGuide}
                          onChange={(value) => selectGuide(value)}
                      />  
                      </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <DatePicker
                      onChange={onChange}
                      bordered={false}
                      suffixIcon={<DownOutlined />}
                      placeholder="Select year"
                      picker="year"
                      className="DatePicker"
                      style={{
                        width: "120px",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{" "}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={add}
                    >
                      Нэмэх
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={(e) => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              sortable
            />
            <Column
              header="Сургалтанд гүйцэтгэх үүрэг"
              body={missionBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Ажилчдын нэрс"
              body={nameUserBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Багшийн нэрс"
              body={nameTrainerBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: "7rem" }} body={action}></Column>
          </DataTable>
          {isModalVisible && (
            <PlanModal
              Plancontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
              orgID = {orgID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
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
      onCancel() { },
    });
  }
};
export default Plan;
