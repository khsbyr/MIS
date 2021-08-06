import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import TrainingReportModal from './components/trainingReportModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const TrainingReport = props => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  // const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [orgID, setOrgID] = useState([]);
  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`training/get/${props.id}`, list)
      .then(result => {
        const listResult = result || [];
        // listResult.forEach((item, index) => {
        //   item.index = lazyParams.page * PAGESIZE + index + 1;
        // });
        setList([listResult]);
        setOrgID(result.organization.id);
        setSelectedRows([]);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingReport/delete/${row.id}`)
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
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const trainingnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.name}
    </>
  );

  const teacherBodyTemplate = row => (
    <>
      <span className="p-column-title">Огноо</span>
      {row.createdDate}
    </>
  );

  const respoUserBodyTemplate = row => (
    <>
      <span className="p-column-title">
        Сургалт явуулсан байгууллага, хүний нэр
      </span>
      {row.organization.responsibleUser.firstname}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сургалтын тайлан</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={12} />
                  <Col xs={8} md={8} lg={4}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
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
            // selectionMode="checkbox"
            selection={selectedRows}
            // onRowClick={edit}
            // editMode="row"
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            {/* <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column> */}
            {/* <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              sortable
            /> */}
            <Column
              field="trainerFor"
              header="Сургалтын нэр"
              body={trainingnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="registerNumber"
              header="Огноо"
              body={teacherBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field=""
              header="Сургалт явуулсан байгууллага, хүний нэр"
              body={respoUserBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TrainingReportModal
              TrainingReportController={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              orgID={orgID}
              trainingIDD={props.id}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TrainingReport;
