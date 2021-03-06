/* eslint-disable no-nested-ternary */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileDownload,
  faPen,
  faPlus,
  faTrash,
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
  Select,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AutoCompleteSelect from '../../components/Autocomplete';
import { PAGESIZE, PlanType } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { deleteService, getService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import PlanModal from './components/planModal';
import ContentWrapper from './plan.style';

const { Content } = Layout;
const { Option } = Select;

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
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  // const { Option, OptGroup } = Select;
  const [visible, setVisible] = useState(false);
  const [ExportDateValue, setExportDateValue] = useState();
  const [ExportTypeId, setExportTypeId] = useState();

  let loadLazyTimeout = null;

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url = value
        ? `plan/get?search=subCriteriaReference.id:${value}`
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    deleteService(`/plan/delete/${row.id}`)
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

  const pop = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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

  // const selectComposition = value => {
  //   onInit(value);
  // };

  const selectType = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url =
        value === 1
          ? `plan/getByTypeId/1`
          : value === 0
          ? `plan/get?search=typeId:0`
          : `plan/get`;
      getService(url, obj)
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
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">?????? ??????????????????</span>
      <Tooltip title={row.name} placement="topLeft">
        {row.name}
      </Tooltip>
    </>
  );

  const CriteriaNameBody = row => (
    <>
      <span className="p-column-title">?????? ?????????????????????? ??????????</span>
      {row.criteriaReference.name}
    </>
  );

  const indicatorProcessBodyTemplate = row => (
    <>
      <span className="p-column-title">?????? ?????????????????????? ??????????</span>
      {row?.subCriteriaReference?.name}
    </>
  );

  const startDateBodyTemplate = row => (
    <>
      <span className="p-column-title"> ??????????</span>
      {row.typeId === 0
        ? moment(row && row.startDate).format('YYYY')
        : moment(row && row.startDate).format('YYYY-MM')}
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

  function exportTab() {
    window.open(
      `/exportPlan?year=${ExportDateValue}&typeId=${
        ExportTypeId === 0 ? 0 : ExportTypeId === 1 ? 1 : 2
      }`
    );
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    exportTab();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const exportDate = (e, value) => {
    setExportDateValue(value);
  };

  const exportType = value => {
    setExportTypeId(value);
  };

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
                {toolsStore?.user?.roleId === 1 ||
                toolsStore?.user?.roleId === 4 ? (
                  <Col xs={12} md={12} lg={6}>
                    <AutoCompleteSelect
                      valueField="id"
                      data={PlanType}
                      placeholder="?????????? ????????????"
                      onChange={value => selectType(value)}
                    />
                  </Col>
                ) : (
                  ''
                )}
                {/* <Col xs={12} md={12} lg={11}>
                  <Select
                    placeholder="?????????????? ?????????????????????? ?????????????????????? ????????????"
                    style={{ width: '100%' }}
                    onChange={value => selectComposition(value)}
                    size="small"
                    allowClear
                  >
                    <OptGroup label="?????????????? ???????????????????????????????????????????????????????????? ??????????????????????">
                      <Option value={1}>?????????? ?????????? ?????????????? ??????????????????</Option>s
                      <Option value={2}>
                        ?????????? ?????????????? ?????????????????? ?????????? ?????????????? ??????????????????
                        ??????????????????????
                      </Option>
                    </OptGroup>
                    <OptGroup label="???????? ?????????????? ?????????????? ??????????????????????">
                      <Option value={3}>?????????? ?????????? ?????????????? ??????????????????</Option>
                      <Option value={4}>
                        ?????????? ?????????????? ?????????????????? ?????????? ?????????????? ??????????????????
                        ??????????????????????
                      </Option>
                      <Option value={5}>?????????????? ???????????????????????? ??????????????</Option>
                      <Option value={6}>
                        ?????????????????? ???????????? ?????????????? ?????????? ???????? ??????????????????
                        ?????????????????????? ??????????
                      </Option>
                    </OptGroup>
                  </Select>
                </Col> */}

                <Modal
                  title="???? ????????????"
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  okText="????????"
                  cancelText="??????????"
                >
                  <Row gutter={12}>
                    <Col span={12}>
                      <DatePicker
                        placeholder="???? ????????????"
                        picker="year"
                        onChange={exportDate}
                        style={{ width: '100%' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Select
                        placeholder="??????????"
                        onChange={exportType}
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value={0}>?????????? ???????????????????????? ????????</Option>
                        <Option value={1}>?????????? ?????????? ?????? ????????????????</Option>
                      </Select>
                    </Col>
                  </Row>
                </Modal>

                {toolsStore.user.role.id === 1 ? (
                  <Col xs={8} md={3} lg={2}>
                    <Tooltip title={t('export')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFileDownload} />}
                        onClick={() => showModal()}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                ) : (
                  ''
                )}

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
              header="???"
              headerStyle={{ width: '4rem' }}
              body={indexBodyTemplate}
            />
            <Column
              field="name"
              header="?????? ??????????????????"
              body={nameBodyTemplate}
              filter
              sortable
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="criteriaReference.name"
              header="?????????????????????? ??????????"
              body={CriteriaNameBody}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="subCriteriaReference.name"
              header="?????? ?????????????????????? ??????????"
              body={indicatorProcessBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="startDateFormat"
              header="??????????"
              body={startDateBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="startsWith"
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
