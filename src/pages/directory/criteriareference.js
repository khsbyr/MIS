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
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolsContext } from '../../context/Tools';
import { deleteService, getService } from '../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import CriteriaReferenceModal from './components/CriteriaReferenceModal';
import { PAGESIZE } from '../../constants/Constant';
// import OrgaStyle from '../training/tabs/components/orga.style';
// import AutoCompleteSelect from '../../components/Autocomplete';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const CriteriaReference = () => {
  const { t } = useTranslation();

  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const dt = useRef(null);
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
      getService('criteriaReference/get', obj)
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    deleteService(`criteriaReference/delete/${row.id}`)
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

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Бүрэлдэхүүний нэр</span>
      {row.name}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">{t('Types of indicators')}</p>
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
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              header="№"
              field="index"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="name"
              body={nameBodyTemplate}
              header="Бүрэлдэхүүний нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '6rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CriteriaReferenceModal
              Criteriareferencecontroller={editRow}
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

export default CriteriaReference;
