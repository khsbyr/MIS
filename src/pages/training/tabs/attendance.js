import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import AttendanceModal from './components/attendanceModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Attendance = props => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const toolsStore = useContext(ToolsContext);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [orgID] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`training/get/${props.id}`, list)
      .then(result => {
        const listResult = result.participants || [];
        setTrainingID(result.id);
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

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.user.firstname}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Овог</span>
      {row.user.lastname}
    </>
  );

  const jobDescBodyTemplate = row => (
    <>
      <span className="p-column-title">Ажил эрхлэлт</span>
      {row.jobDescription}
    </>
  );

  const contactBodyTemplate = row => (
    <>
      <span className="p-column-title">Холбогдох утас</span>
      {row.user.phoneNumber}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистрийн дугаар</span>
      {row.user.register}
    </>
  );

  const genderBodyTemplate = row => (
    <>
      <span className="p-column-title">Хүйс</span>
      {row.gender.gender}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Ирцийн бүртгэл</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={7} />
                  <Col xs={8} md={8} lg={5}>
                    <DatePicker
                      bordered={false}
                      suffixIcon={<DownOutlined />}
                      placeholder="Select year"
                      picker="year"
                      className="DatePicker"
                      style={{
                        width: '120px',
                        color: 'black',
                        cursor: 'pointer',
                      }}
                    />
                  </Col>
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
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" header="№" body={indexBodyTemplate} />
            <Column
              field="name"
              header="Овог"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={nameBodyTemplate}
            />
            <Column
              field="name"
              header="Нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={FirstNameBodyTemplate}
            />
            <Column
              field="jobDescription"
              header="Ажил эрхлэлт"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={jobDescBodyTemplate}
            />
            <Column
              field=""
              header="Холбогдох утас"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={contactBodyTemplate}
            />
            <Column
              field=""
              header="Регистрийн дугаар"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={registerNumberBodyTemplate}
            />
            <Column
              field=""
              header="Хүйс"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={genderBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <AttendanceModal
              Attendancecontroller={editRow}
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

export default Attendance;
