import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Input, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../training/tabs/components/plan.styled';
import PlanModal from '../training/tabs/components/PlanModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Feedback = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [orgID, setOrgID] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const onInit = () => {
    // toolsStore.setIsShowLoader(true);
    // if (loadLazyTimeout) {
    //   clearTimeout(loadLazyTimeout);
    // }
    // getService(`training/get`, list)
    //   .then(result => {
    //     const listResult = result.trainingTeams || [];
    //     setOrgID(result.organization.id);
    //     setTrainingID(result.id);
    //     listResult.forEach((item, index) => {
    //       item.index = lazyParams.page * PAGESIZE + index + 1;
    //     });
    //     setList(listResult);
    //     setSelectedRows([]);
    //   })
    //   .finally(toolsStore.setIsShowLoader(false))
    //   .catch(error => {
    //     errorCatch(error);
    //     toolsStore.setIsShowLoader(false);
    //   });
  };

  useEffect(() => {}, [lazyParams]);

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingTeam/delete/${row.id}`)
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

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

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const indexBodyTemplate = row => (
    <>
      {/* <span className="p-column-title">№</span> */}
      {row.index}
    </>
  );

  const missionBodyTemplate = row => (
    <>
      {/* <span className="p-column-title">Сургалтанд гүйцэтгэх үүрэг</span> */}
      {row.mission}
    </>
  );

  const nameTrainerBodyTemplate = row => (
    <>
      {/* <span className="p-column-title">Багшийн нэрс</span> */}
      {row.user && row.user.fullName}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Санал гомдол</p>
              </Col>
              <Col xs={24} md={24} lg={10}>
                <Row justify="end" gutter={[16, 16]}>
                  <Col>
                    <Tooltip title="Хэвлэх" arrowPointAtCenter>
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPrint} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title="Экспорт" arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFileExcel} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title="Нэмэх" arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={add}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <DataTable
            editMode="cell"
            className="editable-cells-table"
            value={list}
            removableSort
            paginator
            rows={10}
            selection={selectedRows}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" header="№" style={{ width: 40 }} />
            <Column header="Огноо" field="mission" />
            <Column header="Санал, гомдлын төрөл" />
            <Column header="Санал, гомдол гаргагч" />
            <Column header="Хүлээн авагч" />
            <Column header="Хэлбэр (албан бичиг, мэдээлэл холбооны технологиор дамжуулан)" />
            <Column header="Шийдвэрлэсэн эсэх" />
            <Column header="Сэтгэл ханамж" />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <PlanModal
              Plancontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
              orgID={orgID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
export default Feedback;
