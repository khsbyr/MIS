/* eslint-disable no-use-before-define */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPlus, faHistory, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import AttendanceCheckModal from './components/attendanceCheckModal';

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
      getService(`trainingParticipants/getList/${props.id}`, obj)
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

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`participants/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirm(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeleted(row);
        onInit();
      },
      onCancel() {},
    });
  }

  const pop = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
    } else {
      confirm(row);
    }
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">??????</span>
      {row.participant?.user?.firstname}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????? ????????????</span>
      {row.participant?.user?.register}
    </>
  );

  const totalProgramNumber = row => (
    <>
      <span className="p-column-title">???????? ????????????????</span>
      {row.totalProgramNumber}
    </>
  );

  const participatedProgramNumber = row => (
    <>
      <span className="p-column-title">???????????????? ????????????????</span>
      {row.participatedProgramNumber}
    </>
  );

  const percent = row => (
    <>
      <span className="p-column-title">????????</span>
      {row.percent}%
    </>
  );

  const actions = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => pop(row)}
      />
    </>
  );

  const info = row => {
    getService(
      `participants/getByRegisterAndTrainingId?trainingId=${row.training.id}&register=${row.participant.user.register}`
    ).then(result => {
      if (result) {
        Modal.info({
          title: '???????????????? ????????????????',
          width: 1300,
          okText: '??????????',
          content: (
            <DataTable
              emptyMessage="?????????????? ??????????????????..."
              value={result}
              className="p-datatable-responsive-demo"
              dataKey="id"
              style={{ marginTop: '30px' }}
            >
              <Column field="user.firstname" header="??????" />
              <Column field="user.register" header="??????????????" />
              <Column field="trainingProgram.operation" header="????????????????" />
              <Column headerStyle={{ width: '4rem' }} body={actions} />
            </DataTable>
          ),
          onOk() {},
        });
      }
    });
  };

  const action = row => (
    <>
      <Tooltip title="???????????????? ??????????">
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faHistory} />}
          onClick={() => info(row)}
        />
      </Tooltip>
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row justify="end" gutter={[16, 16]}>
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
            emptyMessage="?????????????? ??????????????????..."
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
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="???"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="participant.user.firstname"
              header="??????"
              sortable
              filter
              filterPlaceholder="????????"
              body={FirstNameBodyTemplate}
              filterMatchMode="contains"
            />
            <Column
              field="participant.user.register"
              header="???????????????????? ????????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={registerNumberBodyTemplate}
              filterMatchMode="contains"
            />
            <Column
              field="totalProgramNumber"
              header="???????? ????????????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={totalProgramNumber}
              filterMatchMode="equals"
            />
            <Column
              field="participatedProgramNumber"
              header="???????????????? ????????????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={participatedProgramNumber}
              filterMatchMode="equals"
            />
            <Column
              field="percent"
              header="????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={percent}
              filterMatchMode="equals"
            />
            <Column headerStyle={{ width: '4rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <AttendanceCheckModal
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
