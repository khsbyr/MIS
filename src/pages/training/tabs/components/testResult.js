import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPrint,
  faTrash,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  Layout,
  message,
  Modal,
  Row,
  Tooltip,
  Breadcrumb,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToolsContext } from '../../../../context/Tools';
import { getService, putService } from '../../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../../tools/Tools';
import ContentWrapper from './testResult.style';
import TestResultModal from './testResultModal';
import { PAGESIZE } from '../../../../constants/Constant';
import { useTrainingStore } from '../../../../context/TrainingContext';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TestResult = () => {
  const { TrainingList } = useTrainingStore();
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trainingID, setTrainingID] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const history = useHistory();
  const { id } = useParams();
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const dt = useRef(null);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`testPoint/getByTestId/${id}`, obj)
        .then(data => {
          const dataList = data.content || [];
          dataList.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTrainingID(data.id);
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

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.participant.user.firstname}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистрийн дугаар</span>
      {row.participant.user.register}
    </>
  );
  const shouldTakenBodyTemplate = row => (
    <>
      <span className="p-column-title">Авбал зохих</span>
      {row.test.shouldBeTaken}
    </>
  );

  const takenBodyTemplate = row => (
    <>
      <span className="p-column-title">Авсан</span>
      {row.taken}
    </>
  );

  const handleClick = () => history.push(`/TrainingList/${TrainingList.id}`);

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item onClick={handleClick} style={{ cursor: 'pointer' }}>
            Сорилын нэгтгэл
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Сорил : {list[0] && list[0].test.testName}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              {/* <p className="title">
                Сорил : {list[0] && list[0].test.testName}
              </p> */}
            </Col>
            <Col xs={24} md={24} lg={10}>
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
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <DataTable
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            tableStyle={{ minWidth: 1000 }}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column header="№" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column
              field="name"
              header="Нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
              body={FirstNameBodyTemplate}
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
              header="Авбал зохих"
              body={shouldTakenBodyTemplate}
              sortable
            />
            <Column header="Авсан" body={takenBodyTemplate} sortable />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TestResultModal
              TestResultController={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TestResult;
