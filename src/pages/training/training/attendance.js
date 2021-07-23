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
import React, { useEffect, useState, useContext } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import AttendanceModal from './components/attendanceModal';

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

let editRow;
let isEditMode;
const Attendance = () => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [loading, setLoading] = useState(false);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('participants/get', list)
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

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Суралцагчийн нэр</span>
      {row.name}
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
      <span className="p-column-title">Холбогдох утас, мэйл, хаяг</span>
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистрийн дугаар</span>
      {row.asd}
    </>
  );

  const trainingNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.training.training_plan.name}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Ирцийн бүртгэл</p>
              </Col>
              <Col xs={24} md={24} lg={10}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={6}>
                    <DatePicker
                      onChange={onChange}
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
                  {/* <Col xs={8} md={8} lg={6}>
                                        <Input
                                            placeholder="Хайлт хийх"
                                            allowClear
                                            prefix={<SearchOutlined />}
                                            bordered={false}
                                            onSearch={onSearch}
                                            style={{
                                                width: 150,
                                                borderBottom: "1px solid #103154",
                                            }}
                                        />
                                    </Col> */}
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
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
              header="Суралцагчийн нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={nameBodyTemplate}
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
              header="Холбогдох утас, мэйл, хаяг"
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
              field="training.training_plan.name"
              header="Сургалтын нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={trainingNameBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <AttendanceModal
              Attendancecontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Attendance;
