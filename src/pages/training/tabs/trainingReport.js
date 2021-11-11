<<<<<<< HEAD
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFilePdf,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import TrainingReportModal from './components/trainingReportModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TrainingReport = props => {
  const { t } = useTranslation();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [orgID] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`training/get/${props.id}`, obj)
        .then(data => {
          if (data.trainingReport !== null) {
            const dataList = data;
            setTotalRecords(data.totalElements);
            setList([dataList]);
            toolsStore.setIsShowLoader(false);
          }
        })
        .finally(() => {
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
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
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingReport/delete/${row.trainingReport.id}`)
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

  function openTab(row) {
    window.open(`${row.trainingReport.file.path}`);
  }

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
      {row.trainingReport.file ? (
        <Tooltip title="Файл харах">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faFilePdf} />}
            onClick={() => openTab(row)}
          />
        </Tooltip>
      ) : (
        ''
      )}
    </>
  );
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const trainingnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.name}
    </>
  );

  const teacherBodyTemplate = row => (
    <>
      <span className="p-column-title">Үүссэн огноо</span>
      {moment(row.trainingReport && row.trainingReport.createdDate)
        .zone(0)
        .format('YYYY-M-D')}
    </>
  );

  const updatedDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Зассан огноо</span>
      {row.trainingReport.updatedDate
        ? moment(row.trainingReport.updatedDate).zone(0).format('YYYY-M-D')
        : 'Тодорхойгүй'}
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
            ref={dt}
            value={list}
            removableSort
            paginator
            emptyMessage="Өгөгдөл олдсонгүй..."
            className="p-datatable-responsive-demo"
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            lazy
            selection={selectedRows}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="trainerFor"
              header="Сургалтын нэр"
              body={trainingnameBodyTemplate}
            />
            <Column
              header="Сургалт явуулсан байгууллага, хүний нэр"
              body={respoUserBodyTemplate}
            />
            <Column header="Үүссэн огноо" body={teacherBodyTemplate} />
            <Column header="Зассан огноо" body={updatedDateBodyTemplate} />
            <Column headerStyle={{ width: '8rem' }} body={action} />
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
=======
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFilePdf,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import TrainingReportModal from './components/trainingReportModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TrainingReport = props => {
  const { t } = useTranslation();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [orgID] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`training/get/${props.id}`, obj)
        .then(data => {
          if (data.trainingReport !== null) {
            const dataList = data;
            setTotalRecords(data.totalElements);
            setList([dataList]);
            toolsStore.setIsShowLoader(false);
          }
        })
        .finally(() => {
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
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
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingReport/delete/${row.trainingReport.id}`)
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

  function openTab(row) {
    window.open(`${row.trainingReport.file.path}`);
  }

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
      {row.trainingReport.file ? (
        <Tooltip title="Файл харах">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faFilePdf} />}
            onClick={() => openTab(row)}
          />
        </Tooltip>
      ) : (
        ''
      )}
    </>
  );
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const trainingnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.name}
    </>
  );

  const teacherBodyTemplate = row => (
    <>
      <span className="p-column-title">Үүссэн огноо</span>
      {moment(row.trainingReport && row.trainingReport.createdDate)
        .zone(0)
        .format('YYYY-M-D')}
    </>
  );

  const updatedDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Зассан огноо</span>
      {row.trainingReport.updatedDate
        ? moment(row.trainingReport.updatedDate).zone(0).format('YYYY-M-D')
        : 'Тодорхойгүй'}
    </>
  );

  const respoUserBodyTemplate = row => (
    <>
      <span className="p-column-title">
        Сургалт явуулсан байгууллага, хүний нэр
      </span>
      {row.organization.name}
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
            ref={dt}
            value={list}
            removableSort
            paginator
            emptyMessage="Өгөгдөл олдсонгүй..."
            className="p-datatable-responsive-demo"
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            lazy
            selection={selectedRows}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="trainerFor"
              header="Сургалтын нэр"
              body={trainingnameBodyTemplate}
            />
            <Column
              header="Сургалт явуулсан байгууллага"
              body={respoUserBodyTemplate}
            />
            <Column header="Үүссэн огноо" body={teacherBodyTemplate} />
            <Column header="Зассан огноо" body={updatedDateBodyTemplate} />
            <Column headerStyle={{ width: '8rem' }} body={action} />
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
>>>>>>> feature/Project
