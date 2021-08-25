import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPrint,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToolsContext } from '../../context/Tools';
import { getService, deleteService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import FeedbackModal from './components/FeedbackModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Feedback = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
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
    getService('feedback/get', list)
      .then(result => {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
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

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    deleteService(`feedback/delete/${row.id}`)
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

  const feedbackDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Огноо</span>
      {moment(row.feedbackDate && row.feedbackDate).format('YYYY-MM-DD')}
    </>
  );

  const feedbackTypeBodyTemplate = row => (
    <>
      <span className="p-column-title">Санал, гомдлын төрөл</span>
      {row.feedbackType.name}
    </>
  );
  const complainantBodyTemplate = row => (
    <>
      <span className="p-column-title">Санал, гомдол гаргагч</span>
      {row.complainant}
    </>
  );
  const userBodyTemplate = row => (
    <>
      <span className="p-column-title">Хүлээн авагч</span>
      {row.user && row.user.firstname}
    </>
  );
  const measuresBodyTemplate = row => (
    <>
      <span className="p-column-title">Хэлбэр</span>
      {row.measures}
    </>
  );
  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">Санал гомдол</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col>
                  <Tooltip title="Хэвлэх" arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="Экспорт" arrowPointAtCenter>
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
                  <Tooltip title="Нэмэх" arrowPointAtCenter>
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
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="feedbackDate"
              body={feedbackDateBodyTemplate}
              header="Огноо"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Санал, гомдлын төрөл"
              field="feedbackType.name"
              sortable
              filter
              body={feedbackTypeBodyTemplate}
            />
            <Column
              header="Санал, гомдол гаргагч"
              field="complainant"
              body={complainantBodyTemplate}
            />
            <Column
              header="Хүлээн авагч"
              field="user.firstname"
              body={userBodyTemplate}
            />
            <Column
              header="Хэлбэр"
              field="measures"
              body={measuresBodyTemplate}
            />
            <Column headerStyle={{ width: '6rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <FeedbackModal
              Feedbackcontroller={editRow}
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

export default Feedback;