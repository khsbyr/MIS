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
import {
  Button,
  Col,
  Layout,
  message,
  Modal,
  Row,
  Tooltip,
  Select,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AutoCompleteSelect from '../../components/Autocomplete';
import RenderDateFilter from '../../components/renderDateFilter';
import { PAGESIZE, PlanType } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { deleteService, getService } from '../../service/service';
import {
  convertLazyParamsToObj,
  errorCatch,
  filterDate,
} from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import PlanModal from './components/planModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let listCriteria;
const Plan = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const history = useHistory();
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const { Option, OptGroup } = Select;

  let loadLazyTimeout = null;

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url = value
        ? `plan/get?search=criteriaReference.id:${value}`
        : `plan/get`;
      getService(`${url}`, obj)
        .then(result => {
          const listResult = result.content || [];
          setList(listResult);
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });

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
    deleteService(`/plan/delete/${row.id}`)
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
  }, [lazyParams]);

  const selectComposition = value => {
    onInit(value);
  };

  const selectType = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`plan/get?search=typeId:${value}`, obj)
        .then(result => {
          const listResult = result.content || [];
          setList(listResult);
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });

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
      <span className="p-column-title">Үйл ажиллагаа</span>
      {row.name}
    </>
  );

  const indicatorProcessBodyTemplate = row => (
    <>
      <span className="p-column-title">Бүрэлдэхүүн хэсэг</span>
      {row.criteriaReference.name}
    </>
  );

  const startDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Эхлэх огноо</span>
      {moment(row && row.startDate).format('YYYY-M-D')}
    </>
  );

  const endDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Дуусах огноо</span>
      {moment(row && row.endDate).format('YYYY-M-D')}
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

  // const monthNavigatorTemplate = e => (
  //   <Dropdown
  //     value={e.value}
  //     options={e.options}
  //     onChange={event => e.onChange(event.originalEvent, event.value)}
  //     style={{ lineHeight: 1 }}
  //   />
  // );

  // const yearNavigatorTemplate = e => (
  //   <Dropdown
  //     value={e.value}
  //     options={e.options}
  //     onChange={event => e.onChange(event.originalEvent, event.value)}
  //     className="p-ml-2"
  //     style={{ lineHeight: 1, marginLeft: '10px' }}
  //   />
  // );

  // const formatDate = date => {
  //   let month = date.getMonth() + 1;
  //   let day = date.getDate();

  //   if (month < 10) {
  //     month = `0${month}`;
  //   }

  //   if (day < 10) {
  //     day = `0${day}`;
  //   }

  //   return `${date.getFullYear()}-${month}-${day}`;
  // };

  // const onDateFilterChange = event => {
  //   if (event.value !== null) {
  //     dt.current.filter(formatDate(event.value), 'startDate', 'equals');
  //   } else {
  //     dt.current.filter(null, 'startDate', 'equals');
  //   }

  //   setDateFilter(event.value);
  // };

  // addLocale('mn', {
  //   firstDayOfWeek: 1,
  //   dayNames: ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'],
  //   dayNamesShort: ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'],
  //   dayNamesMin: ['Ня', 'Да', 'Мя', 'Лха', 'Пү', 'Ба', 'Бя'],
  //   monthNames: [
  //     '1-р сар',
  //     '2-р сар',
  //     '3-р сар',
  //     '4-р сар',
  //     '5-р сар',
  //     '6-р сар',
  //     '7-р сар',
  //     '8-р сар',
  //     '9-р сар',
  //     '10-р сар',
  //     '11-р сар',
  //     '12-р сар',
  //   ],
  //   monthNamesShort: [
  //     '1-р сар',
  //     '2-р сар',
  //     '3-р сар',
  //     '4-р сар',
  //     '5-р сар',
  //     '6-р сар',
  //     '7-р сар',
  //     '8-р сар',
  //     '9-р сар',
  //     '10-р сар',
  //     '11-р сар',
  //     '12-р сар',
  //   ],
  //   today: 'Өнөөдөр',
  //   clear: 'Устгах',
  // });

  // const renderDateFilter = () => (
  //   <Calendar
  //     value={dateFilter}
  //     onChange={onDateFilterChange}
  //     placeholder="Хайх"
  //     dateFormat="yy-mm-dd"
  //     className="p-column-filter"
  //     monthNavigator
  //     yearNavigator
  //     yearRange="2010:2030"
  //     yearNavigatorTemplate={yearNavigatorTemplate}
  //     monthNavigatorTemplate={monthNavigatorTemplate}
  //     locale="mn"
  //   />
  // );

  // const dateFilterElement = renderDateFilter();

  // const filterDate = (value, filter) => {
  //   if (
  //     filter === undefined ||
  //     filter === null ||
  //     (typeof filter === 'string' && filter.trim() === '')
  //   ) {
  //     return true;
  //   }

  //   if (value === undefined || value === null) {
  //     return false;
  //   }

  //   return value === formatDate(filter);
  // };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={6}>
              <p className="title">{t('plan')}</p>
            </Col>
            <Col xs={24} md={18} lg={18}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={12} lg={5}>
                  <AutoCompleteSelect
                    valueField="id"
                    data={PlanType}
                    placeholder="Төрөл сонгох"
                    onChange={value => selectType(value)}
                  />
                </Col>
                <Col xs={12} md={12} lg={11}>
                  <Select
                    placeholder="Шалгуур үзүүлэлтийн бүрэлдэхүүн сонгох"
                    style={{ width: '100%' }}
                    onChange={value => selectComposition(value)}
                    size="small"
                  >
                    <OptGroup label="ТӨСЛИЙН ХӨГЖЛИЙН ЗОРИЛГЫН ТҮВШНИЙ  ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                      <Option value={1}>Малын эрүүл мэндийн үйлчилгээ</Option>
                      <Option value={2}>
                        Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг
                        нэмэгдүүлэх
                      </Option>
                    </OptGroup>
                    <OptGroup label="ДУНД ТҮВШНИЙ ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                      <Option value={3}>Малын эрүүл мэндийн үйлчилгээ</Option>
                      <Option value={4}>
                        Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг
                        нэмэгдүүлэх
                      </Option>
                      <Option value={5}>Төслийн хэрэгжилтийг дэмжлэг</Option>
                      <Option value={6}>
                        Болзошгүй онцгой байдлын хариу арга хэмжээний
                        бүрэлдэхүүн хэсэг
                      </Option>
                    </OptGroup>
                  </Select>
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
              header="Үйл ажиллагаа"
              body={nameBodyTemplate}
              filter
              sortable
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="criteriaReference.name"
              header="Бүрэлдэхүүн хэсэг"
              body={indicatorProcessBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="startDate"
              header="Эхлэх огноо"
              body={startDateBodyTemplate}
              sortable
              filter
              filterMatchMode="custom"
              filterFunction={filterDate}
              filterElement={<RenderDateFilter field="startDate" />}
            />
            <Column
              field="endDate"
              header="Дуусах огноо"
              body={endDateBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <PlanModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              listCriteria={listCriteria}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Plan;
