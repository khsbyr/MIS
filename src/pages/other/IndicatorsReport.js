/* eslint-disable no-nested-ternary */
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
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../constants/Constant';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import IndicatorsReportModal from './components/indicatorsReportModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const IndicatorsReport = props => {
  const criteriaID = Number(props.id);

  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const dt = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useToolsStore();
  const [totalRecords, setTotalRecords] = useState(0);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`criteriaResults/get?search=criteria.id:${props.id}`, obj)
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
    putService(`criteriaResults/delete/${row.id}`)
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const pop = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
    } else {
      confirm(row);
    }
  };

  function openTab(row) {
    window.open(`${row.file.path}`);
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
      />{' '}
      {row.file ? (
        <Tooltip title="???????? ??????????">
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

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );
  const criteriaBodyTemplate = row => (
    <>
      <span className="p-column-title">?????????????? ?????????????????????? ??????</span>
      {row.criteria.name}
    </>
  );
  const addressBodyTemplate = row => (
    <>
      <span className="p-column-title">????????</span>
      {row.address?.childrenAddress.map(z => (
        <p>
          {z.aimag.name}, {z.soum.name}
        </p>
      ))}
    </>
  );
  const dateBodyTemplate = row => (
    <>
      <span className="p-column-title">??????????</span>
      {moment(row.date && row.date).format('YYYY-MM-DD')}
    </>
  );
  const processResultBodyTemplate = row => (
    <>
      <span className="p-column-title">???? ??????</span>
      {row.number ? row.number : row.isYes === true ? '????????' : '????????'}
    </>
  );
  const explanationBodyTemplate = row => (
    <>
      <span className="p-column-title">??????????????</span>
      {row.explanation}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        {' '}
        <Content>
          <Row>
            <Col xs={24} md={24} lg={14}>
              <p className="title">?????????????? ?????????????????????? ???? ??????</p>
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
        <div className="datatable-responsive-demo">
          <DataTable
            editMode="cell"
            className="p-datatable-responsive-demo"
            value={list}
            removableSort
            emptyMessage="?????????????? ??????????????????..."
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            paginator
            ref={dt}
            lazy
            selection={selectedRows}
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
              header="?????????????? ?????????????????????? ??????"
              field="criteria.name"
              body={criteriaBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              header="????????"
              field="address.soum.name"
              body={addressBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="??????????"
              field="dateFormat"
              body={dateBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="???? ??????"
              field="number"
              body={processResultBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="??????????????"
              field="explanation"
              body={explanationBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
            />
            <Column headerStyle={{ width: '9rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <IndicatorsReportModal
              IndicatorsReportcontroller={editRow}
              isModalVisible={isModalVisible}
              isEditMode={isEditMode}
              close={closeModal}
              criteriaID={criteriaID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
export default IndicatorsReport;
