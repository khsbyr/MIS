import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  DatePicker,
  Layout,
  message,
  Modal,
  Row,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../tools/Tools';
import ContentWrapper from './training.style';
import TrainingModal from './TrainingModal';
import OrgaStyle from './tabs/components/orga.style';
import AutoCompleteSelect from '../../components/Autocomplete';
import { PAGESIZE } from '../../constants/Constant';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TrainingList = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const toolsStore = useToolsStore();
  const [orgID] = useState([]);
  const [trainingID, setTrainingID] = useState();
  const history = useHistory();
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService('training/get', obj)
        .then(data => {
          const dataList = data.content || [];
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

  const getTraining = orgId => {
    getService(`training/getList/${orgId}`, {}).then(result => {
      if (result) {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      }
    });
  };

  const selectOrgs = value => {
    getTraining(value);
  };

  const add = () => {
    editRow = null;
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = (event, row) => {
    setTrainingID(row.id);
    event.preventDefault();
    event.stopPropagation();
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

    putService(`training/delete/${row.id}`)
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

  function Formatcurrency(value) {
    const values = value || 0;
    return `${values.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮`;
  }

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const NameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.name}
    </>
  );

  const totalBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөв</span>
      {Formatcurrency(row.trainingBudget.totalBudget)}
    </>
  );

  const performanceBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн төсөв</span>
      {Formatcurrency(row.trainingBudget.performanceBudget)}
    </>
  );

  const startDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Эхэлсэн огноо</span>
      {moment(row.trainingStartDate && row.trainingStartDate).format(
        'YYYY-MM-DD'
      )}
    </>
  );

  const endDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Дууссан огноо</span>
      {moment(row.trainingEndDate && row.trainingEndDate).format('YYYY-MM-DD')}
    </>
  );

  const participantBodyTemplate = row => (
    <>
      <span className="p-column-title">Оролцогчдын тоо</span>
      {row.totalParticipants}
    </>
  );

  const ShowTrainingInfo = row => history.push(`/trainingList/${row.data.id}`);

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={10}>
              <p className="title">Сургалтын жагсаалт</p>
            </Col>
            <Col xs={24} md={18} lg={14}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={12} lg={8}>
                  {toolsStore.user.roleId === 1 ? (
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        initialValue="All"
                        placeholder="Байгууллага сонгох"
                        data={toolsStore.orgList}
                        onChange={value => selectOrgs(value)}
                      />
                    </OrgaStyle>
                  ) : (
                    ''
                  )}
                </Col>
                <Col xs={12} md={5} lg={5}>
                  <DatePicker
                    bordered={false}
                    suffixIcon={<DownOutlined />}
                    placeholder="Жил сонгох"
                    picker="year"
                    className="DatePicker"
                    style={{
                      width: '120px',
                      color: 'black',
                      cursor: 'pointer',
                    }}
                  />
                </Col>
                <Col xs={8} md={2} lg={2}>
                  <Tooltip title={t('print')} arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={8} md={2} lg={2}>
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
                <Col xs={8} md={2} lg={2}>
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
                <Col xs={8} md={2} lg={2}>
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
        <div className="datatable-responsive-demo">
          <div className="datatable-selection-demo">
            <DataTable
              ref={dt}
              selectionMode="single"
              emptyMessage="Өгөгдөл олдсонгүй..."
              value={list}
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
              lazy
              paginator
              className="p-datatable-responsive-demo"
              selection={selectedRows}
              onRowClick={ShowTrainingInfo}
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
                field="name"
                header="Сургалтын сэдэв"
                filter
                body={NameBodyTemplate}
                sortable
                filterPlaceholder="Хайх"
                filterMatchMode="contains"
              />
              <Column
                field="trainingBudget.totalBudget"
                header="Төсөв /₮/"
                headerStyle={{ width: '10rem' }}
                filter
                filterPlaceholder="Хайх"
                sortable
                body={totalBudgetBodyTemplate}
                bodyStyle={{ textAlign: 'center' }}
                filterMatchMode="equals"
              />
              <Column
                field="trainingBudget.performanceBudget"
                header="Төсвийн гүйцэтгэл /₮/"
                filterPlaceholder="Хайх"
                headerStyle={{ width: '12rem' }}
                filter
                sortable
                body={performanceBudgetBodyTemplate}
                bodyStyle={{ textAlign: 'center' }}
                filterMatchMode="equals"
              />
              <Column
                field="trainingStartDate"
                header="Эхэлсэн огноо"
                sortable
                headerStyle={{ width: '10rem' }}
                body={startDateBodyTemplate}
                bodyStyle={{ textAlign: 'center' }}
              />
              <Column
                field="trainingEndDate"
                header="Дууссан огноо"
                sortable
                headerStyle={{ width: '10rem' }}
                body={endDateBodyTemplate}
                bodyStyle={{ textAlign: 'center' }}
              />
              <Column
                field="totalParticipants"
                header="Оролцогчдын тоо"
                filterPlaceholder="Хайх"
                headerStyle={{ width: '10rem' }}
                filter
                sortable
                body={participantBodyTemplate}
                bodyStyle={{ textAlign: 'center' }}
                filterMatchMode="equals"
              />
              <Column headerStyle={{ width: '6rem' }} body={action} />
            </DataTable>
            {isModalVisible && (
              <TrainingModal
                Trainingcontroller={editRow}
                isModalVisible={isModalVisible}
                close={closeModal}
                isEditMode={isEditMode}
                orgId={orgID}
                trainingID={trainingID}
              />
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TrainingList;
