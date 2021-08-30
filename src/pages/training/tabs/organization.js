import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolsContext } from '../../../context/Tools';
import { useTrainingStore } from '../../../context/TrainingContext';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/organization.style';
import OrganizationModal from './components/OrganizationModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const Organization = props => {
  const { t } = useTranslation();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const dt = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { TrainingList, setTrainingList } = useTrainingStore();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`training/get/${props.id}`, obj)
        .then(data => {
          const dataList = data.organization;
          // dataList.forEach((item, index) => {
          //   item.index = lazyParams.page * PAGESIZE + index + 1;
          // });
          setTrainingList(data);
          setTotalRecords(data.totalElements);
          setList([dataList]);
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
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => pop(row)}
      />
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Байгууллагын нэр</span>
      {row.name}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистрийн дугаар</span>
      {row.registerNumber}
    </>
  );

  const bankNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Банкны нэр</span>
      {row.bank.name}
    </>
  );

  const accountNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Дансны нэр</span>
      {row.accountName}
    </>
  );

  const accountNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">Дансны дугаар</span>
      {row.accountNumber}
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
                  {/* <Col>
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
                  </Col> */}
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
            value={list}
            ref={dt}
            lazy
            removableSort
            paginator
            emptyMessage="Өгөгдөл олдсонгүй..."
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            tableStyle={{ minWidth: 1000 }}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            {/* <Column header="№" body={indexBodyTemplate} /> */}
            <Column
              header="Байгууллагын нэр"
              body={nameBodyTemplate}
              sortable
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Регистрийн дугаар"
              body={registerNumberBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Банкны нэр"
              body={bankNameBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Дансны нэр"
              body={accountNameBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Дансны дугаар"
              body={accountNumberBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
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

export default Organization;
