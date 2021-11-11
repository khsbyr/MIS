import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import TestModal from './components/testModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TestAggregation = props => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trainingID, setTrainingID] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const history = useHistory();
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
      getService(`test/getList/${props.id}`, obj)
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
        .finally(toolsStore.setIsShowLoader(false))
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

  const edit = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`test/delete/${row.id}`)
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

  const pop = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
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
        onClick={event => edit(event, row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={event => pop(event, row)}
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
      <span className="p-column-title">Сорилын нэр</span>
      {row.testName}
    </>
  );

  const ShouldTakenBodyTemplate = row => (
    <>
      <span className="p-column-title">Авбал зохих</span>
      {row.shouldBeTaken}
    </>
  );

  const DateBodyTemplate = row => (
    <>
      <span className="p-column-title">Огноо</span>
      {moment(row.createdDate).format('YYYY-M-D')}
    </>
  );

  const showParticipants = row =>
    history.push(`/participantsList/${row.data.id}`);

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
          <div className="datatable-selection-demo">
            <DataTable
              ref={dt}
              selectionMode="single"
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
              value={list}
              onRowClick={showParticipants}
              removableSort
              paginator
              emptyMessage="Өгөгдөл олдсонгүй..."
              className="p-datatable-responsive-demo"
              selection={selectedRows}
              // onRowClick={edit}
              onSelectionChange={e => {
                setSelectedRows(e.value);
              }}
              dataKey="id"
            >
              <Column
                header="№"
                body={indexBodyTemplate}
                style={{ width: 40 }}
              />
              <Column
                header="Сорилын нэр"
                body={nameBodyTemplate}
                sortable
                filter
                filterPlaceholder="Хайх"
              />
              <Column
                header="Авбал зохих"
                body={ShouldTakenBodyTemplate}
                sortable
                filter
                filterPlaceholder="Хайх"
              />
              <Column
                header="Огноо"
                body={DateBodyTemplate}
                sortable
                filter
                filterPlaceholder="Хайх"
              />
              <Column headerStyle={{ width: '7rem' }} body={action} />
            </DataTable>
            {isModalVisible && (
              <TestModal
                TestController={editRow}
                isModalVisible={isModalVisible}
                close={closeModal}
                isEditMode={isEditMode}
                trainingID={trainingID}
              />
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TestAggregation;
