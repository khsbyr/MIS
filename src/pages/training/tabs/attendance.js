import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import AttendanceModal from './components/attendanceModal';
import { PAGESIZE } from '../../../constants/Constant';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const Attendance = props => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toolsStore = useContext(ToolsContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [orgID] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const dt = useRef(null);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`participants/getList/${props.id}`, obj)
        .then(data => {
          const dataList = data.content || [];
          setTrainingID(props.id);
          dataList.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(data.totalElements);
          setList(dataList);
          toolsStore.setIsShowLoader(false);
        })
        .catch(error => {
          message.error(error.toString());
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const onPage = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter = event => {
    const params = { ...lazyParams, ...event };
    params.first = 0;
    setLazyParams(params);
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

  const LastNameBodyTemplate = row => (
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
              <Col xs={24} md={24} lg={24}>
                <Row justify="end" gutter={[16, 16]}>
                  <Col>
                    <Tooltip title={t('print')} arrowPointAtCenter>
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPrint} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title={t('export')} arrowPointAtCenter>
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
                    <Tooltip title={t('pdf')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFilePdf} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title={t('add')} arrowPointAtCenter>
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            ref={dt}
            lazy
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            tableStyle={{ minWidth: 1000 }}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="lastname"
              header="Овог"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={LastNameBodyTemplate}
              bodyStyle={{ textAlign: 'left' }}
            />
            <Column
              field="firstname"
              header="Нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={FirstNameBodyTemplate}
              bodyStyle={{ textAlign: 'left' }}
            />
            <Column
              field="jobDescription"
              header="Ажил эрхлэлт"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={jobDescBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              field=""
              header="Холбогдох утас"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={contactBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              field=""
              header="Регистрийн дугаар"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={registerNumberBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              field=""
              header="Хүйс"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={genderBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
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
