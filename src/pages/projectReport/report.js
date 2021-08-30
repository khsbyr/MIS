import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faFilePdf,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AutoCompleteSelect from '../../components/Autocomplete';
import { PAGESIZE } from '../../constants/Constant';
import { useCriteriaStore } from '../../context/CriteriaContext';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import {
  convertLazyParamsToObj,
  errorCatch,
  formatIndicator,
} from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import PlanModal from './components/planModal';

const { Content } = Layout;

let editRow;
let isEditMode;

const Report = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { criteriaReferenceList, setCriteriaReferenceList } =
    useCriteriaStore();
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const history = useHistory();
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);

  let loadLazyTimeout = null;

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url = value
        ? `/criteria/getListByCriteriaReferenceId/${value}`
        : '/criteria/get';
      getService(`${url}`, obj)
        .then(result => {
          if (value) {
            const listResult = result || [];
            setList(listResult);
            listResult.forEach((item, index) => {
              item.index = lazyParams.page * PAGESIZE + index + 1;
            });
          } else {
            const listResult = result.content || [];
            setList(listResult);
            listResult.forEach((item, index) => {
              item.index = lazyParams.page * PAGESIZE + index + 1;
            });
          }
          setTotalRecords(result.totalElements);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };
  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const more = row => {
    history.push(`/planDetail/${row.data.id}`);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`/criteria/delete/${row.id}`)
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

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  useEffect(() => {
    onInit();
    getService('/criteriaReference/get').then(result => {
      if (result) {
        setCriteriaReferenceList(result.content || []);
      }
    });
  }, [lazyParams]);

  const selectComposition = value => {
    onInit(value);
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

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Шалгуур үзүүлэлтийн нэр</span>
      {row.name}
    </>
  );

  const indicatorProcessBodyTemplate = row => (
    <>
      <span className="p-column-title">Хүрэх үр дүн</span>
      {row.resultTobeAchieved + formatIndicator(row.indicator)}
    </>
  );

  const upIndicatorBodyTemplate = row => (
    <>
      <span className="p-column-title">Үр дүнгийн биелэлт</span>
      {row.processResult + formatIndicator(row.indicator)}
    </>
  );

  const onPage = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter = event => {
    const params = { ...lazyParams, ...event, page: 0 };
    setLazyParams(params);
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={10}>
              <p className="title">{t('report')}</p>
            </Col>
            <Col xs={24} md={18} lg={14}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={12} lg={16}>
                  <AutoCompleteSelect
                    valueField="id"
                    data={criteriaReferenceList}
                    placeholder={t('Select Indicator')}
                    onChange={value => selectComposition(value)}
                  />
                </Col>
                <Col xs={8} md={3} lg={2}>
                  <Tooltip title={t('print')} arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={8} md={3} lg={2}>
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
                <Col xs={8} md={3} lg={2}>
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
                <Col xs={8} md={3} lg={2}>
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
          <DataTable
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            onRowClick={more}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
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
          >
            <Column
              field="index"
              header="№"
              headerStyle={{ width: '4rem' }}
              body={indexBodyTemplate}
            />
            <Column
              field="name"
              headerStyle={{ width: '30rem' }}
              header="Төлөвлөгөөний нэр"
              body={nameBodyTemplate}
              filter
              sortable
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="resultTobeAchieved"
              header="Бүрэлдэхүүн хэсэг"
              body={indicatorProcessBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="equals"
            />
            <Column
              field="processResult"
              header="Эхлэх огноо"
              body={upIndicatorBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="equals"
            />
            <Column
              field="processResult"
              header="Дуусах огноо"
              body={upIndicatorBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="equals"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <PlanModal
              EditRow={editRow}
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

export default Report;
