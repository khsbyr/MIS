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
import UserModal from './components/UserModal';
import ContentWrapper from './user.style';

const { Content } = Layout;

let isEditMode;
let loadLazyTimeout = null;
let editRow;

const User = () => {
  const { t } = useTranslation();
  const toolsStore = useToolsStore();
  const [totalRecords, setTotalRecords] = useState(0);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      getService('user/get', obj)
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

  const edit = (event, row) => {
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
    const params = { ...lazyParams, ...event, page: 0 };
    setLazyParams(params);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`user/delete/${row.id}`)
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
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );

  const firstnameBodyTemplate = row => (
    <>
      <span className="p-column-title">??????</span>
      {row?.firstname ? row?.firstname : '??????????????????????'}
    </>
  );

  const lastnameBodyTemplate = row => (
    <>
      <span className="p-column-title">????????</span>
      {row?.lastname ? row?.lastname : '??????????????????????'}
    </>
  );

  const registerBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????? ????????????</span>
      {row?.register ? row?.register : '??????????????????????'}
    </>
  );
  const emailBodyTemplate = row => (
    <>
      <span className="p-column-title">??-????????</span>
      <Tooltip placement="topLeft" title={row.email}>
        {row?.email ? row?.email : '??????????????????????'}
      </Tooltip>
    </>
  );

  const roleBodyTemplate = row => (
    <>
      <span className="p-column-title">??-????????</span>
      {row.role ? row.role.name : '??????????????????????'}
    </>
  );

  function exportTab() {
    window.open(`/exportUser`);
  }

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">???????????????????????? ????????????????</p>
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
            ref={dt}
            value={list}
            lazy
            paginator
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            emptyMessage="?????????????? ??????????????????..."
            className="p-datatable-responsive-demo"
          >
            <Column
              field="index"
              header="???"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="firstname"
              header="??????"
              body={firstnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="lastname"
              header="????????"
              body={lastnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="register"
              header="???????????????????? ????????????"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="email"
              header="??-????????"
              body={emailBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="role.name"
              header="??????"
              body={roleBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <UserModal
              Usercontroller={editRow}
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

export default User;
