import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../constants/Constant';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import OrganizationModal from '../training/tabs/components/OrganizationModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const ConsultingOrg = () => {
  const { t } = useTranslation();
  const dt = useRef(null);
  const toolsStore = useToolsStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [list, setList] = useState([]);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService('organization/get', obj)
        .then(data => {
          const dataList = data.content || [];
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`organization/delete/${row.id}`)
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

  const action = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => edit(row)}
      />
      {toolsStore.user.roleId === 9 ||
      toolsStore.user.roleId === 10 ||
      toolsStore.user.roleId === 11 ||
      toolsStore.user.roleId === 12 ||
      toolsStore.user.roleId === 13 ||
      toolsStore.user.roleId === 14 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faTrash} />}
          onClick={() => pop(row)}
        />
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

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????????? ??????</span>
      {row.name ? row.name : '??????????????????????'}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????? ????????????</span>
      {row.registerNumber ? row.registerNumber : '??????????????????????'}
    </>
  );

  const bankNameBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????? ??????</span>
      {row.bank ? row.bank.name : '??????????????????????'}
    </>
  );

  const accountNameBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????? ??????</span>
      {row.accountName ? row.accountName : '??????????????????????'}
    </>
  );

  const accountNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????? ????????????</span>
      {row.accountNumber ? row.accountNumber : '??????????????????????'}
    </>
  );

  const role = row => (
    <>
      <span className="p-column-title">??????</span>
      {row.role ? row.role.name : '??????????????????????'}
    </>
  );

  function exportTab() {
    window.open(`/exportOrganization`);
  }

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">??????????????????????</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                {toolsStore.user.role.id === 1 ? (
                  <Col>
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

                {toolsStore.user?.role?.roleLevel.id === 3 ? (
                  ''
                ) : (
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
                )}
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            ref={dt}
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
            lazy
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column header="???" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column
              filterPlaceholder="????????"
              field="name"
              header="???????????????????????? ??????"
              body={nameBodyTemplate}
              filter
              sortable
            />
            <Column
              filterPlaceholder="????????"
              field="registerNumber"
              filter
              sortable
              header="???????????????????? ????????????"
              body={registerNumberBodyTemplate}
            />
            <Column
              filterPlaceholder="????????"
              field="bank.name"
              filter
              sortable
              header="???????????? ??????"
              body={bankNameBodyTemplate}
            />
            <Column
              filterPlaceholder="????????"
              field="accountName"
              filter
              sortable
              header="???????????? ??????"
              body={accountNameBodyTemplate}
            />
            <Column
              filterPlaceholder="????????"
              field="accountNumber"
              filter
              sortable
              header="???????????? ????????????"
              body={accountNumberBodyTemplate}
            />
            <Column
              filterPlaceholder="????????"
              field="role.name"
              filter
              sortable
              header="??????"
              body={role}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <OrganizationModal
              Orgcontroller={editRow}
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

export default ConsultingOrg;
