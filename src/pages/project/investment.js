import React, { useEffect, useState, useContext } from 'react';
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
import { ToolsContext } from '../../context/Tools';
import ContentWrapper from '../criteria/criteria.style';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ProjectSummaryModal from './components/ProjectSummaryModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Investment = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('organization/get', list)
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

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = row => {
    editRow = row.data;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`organization/delete/${selectedRows[0].id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirm() {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeleted();
        onInit();
      },
      onCancel() {},
    });
  }

  const pop = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };

  const action = () => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={edit}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={pop}
      />
    </>
  );

  useEffect(() => {
    onInit();
  }, [lazyParams]);

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

  const trainingnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Хичээлийн сэдэв</span>
      {row.name}
    </>
  );

  const teacherBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургагч багшийн нэр</span>
      {row.indicatorProcess}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Төслийн хураангуй</p>
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
            // selectionMode="checkbox"
            selection={selectedRows}
            // onRowClick={edit}
            // editMode="row"
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            {/* <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column> */}
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              sortable
            />
            <Column
              field="name"
              header="Хичээлийн сэдэв"
              body={trainingnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="indicatorProcess"
              header="Сургагч багшийн нэр"
              body={teacherBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ProjectSummaryModal
              Guidelinescontroller={editRow}
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
export default Investment;
