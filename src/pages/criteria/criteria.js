import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
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
  Select,
  Tooltip,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import {
  convertLazyParamsToObj,
  errorCatch,
  formatIndicator,
} from '../../tools/Tools';
import CriteriaModal from './components/CriteriaModal';
import ContentWrapper from './criteria.style';

const { Content } = Layout;
const { Option, OptGroup } = Select;

let editRow;
let isEditMode;

const Criteria = () => {
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
        : '/criteria/get?stringDate=';
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
    history.push(`/criteriaDetail/${row.data.id}`);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`/criteria/delete/${row.id}`)
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

  const selectComposition = value => {
    onInit(value);
  };

  const action = row => (
    <>
      {toolsStore.user.roleId === 1 ? (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faPen} />}
          onClick={event => edit(event, row)}
        />
      ) : (
        ''
      )}
      {toolsStore.user.roleId === 1 ? (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faTrash} />}
          onClick={event => pop(event, row)}
        />
      ) : (
        ''
      )}
    </>
  );

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">???</span>
      {row.code}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">?????????????? ?????????????????????? ??????</span>
      {toolsStore.isLangChange ? row.englishName : row.name}
    </>
  );

  const indicatorProcessBodyTemplate = row => (
    <>
      <span className="p-column-title">?????????? ???? ??????</span>
      {row.resultTobeAchieved + formatIndicator(row.indicator)}
    </>
  );

  const upIndicatorBodyTemplate = row => (
    <>
      <span className="p-column-title">???? ?????????????? ??????????????</span>
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

  function exportTab() {
    window.open(`/exportIndicators`);
  }

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={10}>
              <p className="title">{t('Indicator')}</p>
            </Col>
            <Col xs={24} md={18} lg={14}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={12} lg={12}>
                  {/* <AutoCompleteSelect
                    valueField="id"
                    data={criteriaReferenceList}
                    placeholder={t('Select Indicator')}
                    onChange={value => selectComposition(value)}
                  /> */}
                  <Select
                    placeholder="?????????????????????? ????????????"
                    style={{ width: '100%' }}
                    onChange={value => selectComposition(value)}
                    size="small"
                    allowClear
                  >
                    <OptGroup label="?????????????? ???????????????????????????????????????????????????? ?????????????? ??????????????????????">
                      <Option value={1}>?????????? ?????????? ?????????????? ??????????????????</Option>

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
                </Col>

                {toolsStore.user.role.id === 1 ? (
                  <Col xs={8} md={3} lg={2}>
                    <Tooltip title={t('export')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFileExcel} />}
                        onClick={() => exportTab()}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                ) : (
                  ''
                )}

                {toolsStore.user?.roleId === 1 ? (
                  <Col xs={8} md={3} lg={2}>
                    <Tooltip title={t('add')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={add}
                      />
                    </Tooltip>
                  </Col>
                ) : (
                  ''
                )}
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
              field="code"
              header="???"
              headerStyle={{ width: '4rem' }}
              body={indexBodyTemplate}
              sortable
            />
            <Column
              field="name"
              header={t('Indicator name')}
              body={nameBodyTemplate}
              filter
              sortable
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="resultTobeAchieved"
              header={t('Achieved result')}
              body={indicatorProcessBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="equals"
            />
            <Column
              field="processResult"
              header={t('Execution of results')}
              body={upIndicatorBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="equals"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CriteriaModal
              Criteriacontroller={editRow}
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

export default Criteria;
