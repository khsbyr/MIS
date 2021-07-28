import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import Composition1Modal from './components/Composition1Modal';
import ContentWrapper from './components/composition.style';

const { Content } = Layout;

let editRow;
let isEditMode;
const Composition1 = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [listchild, setListchild] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingPlan/getParents/1', list)
      .then(result => {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      })
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingPlan/delete/${row.id}`)
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

  const rowExpansionTemplate = row => {
    if (!row.id) return;
    getService(`trainingPlan/getChildren/${row.id}`)
      .then(result => {
        const listChild = result.content || [];
        listChild.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setListchild(listchild);
        setSelectedRows([]);
      })
      .catch(error => {
        errorCatch(error);
      });
    return (
      <div className="orders-subtable">
        <DataTable
          value={listchild}
          removableSort
          paginator
          rows={10}
          className="p-datatable-responsive-demo"
          selectionMode="checkbox"
          selection={selectedRows}
          onRowClick={edit}
          onSelectionChange={e => {
            setSelectedRows(e.value);
          }}
        >
          <Column
            field="index"
            header="Id"
            sortable
            headerStyle={{ width: '5em', padding: '0px' }}
          />
          <Column
            field="name"
            header=""
            sortable
            filter
            style={{ width: '30%' }}
          />
          <Column field="code" header="" sortable filter />
          <Column field="name" header="" sortable filter />
          <Column field="gender" header="" sortable filter />
          <Column field="upIndicator" header="" sortable filter />
          <Column field=" " header="" sortable filter />
          <Column field="index" header="" sortable filter />
          <Column field="index" header="" sortable filter />
          <Column field="index" header="Id" sortable filter />
          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
      </div>
    );
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  // const indexBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">№</span>
  //     {row.index}
  //   </>
  // );

  // const nameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Шалгуур үзүүлэлтийн нэр</span>
  //     {row.name}
  //   </>
  // );

  // const indicatorProcessBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Хүрэх үр дүн</span>
  //     {row.indicatorProcess}
  //   </>
  // );

  // const upIndicatorBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Үр дүнгийн биелэлт</span>
  //     {row.upIndicator}
  //   </>
  // );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Шалгуур үзүүлэлтийн бүртгэл</p>
              </Col>
              <Col xs={24} md={24} lg={10}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={6}>
                    <DatePicker
                      bordered={false}
                      suffixIcon={<DownOutlined />}
                      placeholder="Select year"
                      picker="year"
                      className="DatePicker"
                      style={{
                        width: '120px',
                        color: 'black',
                        cursor: 'pointer',
                      }}
                    />
                  </Col>
                  {/* <Col xs={8} md={8} lg={6}>
                                        <Input
                                            placeholder="Хайлт хийх"
                                            allowClear
                                            prefix={<SearchOutlined />}
                                            bordered={false}
                                            onSearch={onSearch}
                                            style={{
                                                width: 150,
                                                borderBottom: "1px solid #103154",
                                            }}
                                        />
                                    </Col> */}
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={add}
                    >
                      Нэмэх
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            expandedRows={expandedRows}
            onRowToggle={e => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="code" header="№" style={{ width: '50px' }} />
            <Column
              field="name"
              header="Сургалтын агууллага"
              filter
              style={{ width: '30%' }}
            />
            <Column field="" header="Зорилтот үр дүн" />
            <Column field="" header="Шалгуур үзүүлэлт" />
            <Column field="" header="I улирал" />
            <Column field="" header="II улирал" />
            <Column field="" header="III улирал" />
            <Column field="" header="IV улирал" />
            <Column field="" header="Нийт" />
            <Column field="" header="Үр дүнгийн биелэлт" />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <Composition1Modal
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
export default Composition1;
