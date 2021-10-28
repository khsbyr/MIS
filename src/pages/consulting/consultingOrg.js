import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import OrganizationModal from '../training/tabs/components/OrganizationModal';
import { PAGESIZE } from '../../constants/Constant';

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
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`organization/delete/${row.id}`)
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
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Байгууллагын нэр</span>
      {row.name ? row.name : 'Тодорхойгүй'}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистрийн дугаар</span>
      {row.registerNumber ? row.registerNumber : 'Тодорхойгүй'}
    </>
  );

  const bankNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Банкны нэр</span>
      {row.bank ? row.bank.name : 'Тодорхойгүй'}
    </>
  );

  const accountNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Дансны нэр</span>
      {row.accountName ? row.accountName : 'Тодорхойгүй'}
    </>
  );

  const accountNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Дансны дугаар</span>
      {row.accountNumber ? row.accountNumber : 'Тодорхойгүй'}
    </>
  );

  const role = row => (
    <>
      <span className="p-column-title">Эрх</span>
      {row.role ? row.role.name : 'Тодорхойгүй'}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">Байгууллага </p>
            </Col>
            <Col xs={18} md={12} lg={10}>
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
            emptyMessage="Өгөгдөл олдсонгүй..."
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
            <Column header="№" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column
              filterPlaceholder="Хайх"
              field="name"
              header="Байгууллагын нэр"
              body={nameBodyTemplate}
              filter
              sortable
            />
            <Column
              filterPlaceholder="Хайх"
              field="registerNumber"
              filter
              sortable
              header="Регистрийн дугаар"
              body={registerNumberBodyTemplate}
            />
            <Column
              filterPlaceholder="Хайх"
              field="bank.name"
              filter
              sortable
              header="Банкны нэр"
              body={bankNameBodyTemplate}
            />
            <Column
              filterPlaceholder="Хайх"
              field="accountName"
              filter
              sortable
              header="Дансны нэр"
              body={accountNameBodyTemplate}
            />
            <Column
              filterPlaceholder="Хайх"
              field="accountNumber"
              filter
              sortable
              header="Дансны дугаар"
              body={accountNumberBodyTemplate}
            />
            <Column
              filterPlaceholder="Хайх"
              field="role.name"
              filter
              sortable
              header="Эрх"
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
