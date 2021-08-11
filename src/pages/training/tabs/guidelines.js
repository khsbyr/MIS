import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/guidelines.style';
import GuidelinesModal from './components/GuidelinesModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Guidelines = props => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [orgID, setOrgID] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`training/get/${props.id}`, list)
      .then(result => {
        const listResult = result.training_guidelines || [];
        setTrainingID(result.id);
        setOrgID(result.organization.id);

        // listResult.forEach((item, index) => {
        //   item.index = lazyParams.page * PAGESIZE + index + 1;
        // });
        setList([listResult]);

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

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingGuidelines/delete/${row.id}`)
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

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

  const subjectBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын сэдэв:</span>
      {row.subject}
    </>
  );

  const reasonTrainerBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалт зохион байгуулах үндэслэл:</span>
      {row.reason}
    </>
  );
  const aimtBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын зорилго:</span>
      {row.aim}
    </>
  );

  const operationTrainerBodyTemplate = row => (
    <>
      <span className="p-column-title">Хэрэгжүүлэх үйл ажиллагаа:</span>
      {row.operation}
    </>
  );

  const resultTrainerBodyTemplate = row => (
    <>
      <span className="p-column-title">Хүлээгдэж буй үр дүн:</span>
      {row.result}
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
            dataKey="id"
          >
            <Column
              header="Сургалтын сэдэв"
              body={subjectBodyTemplate}
              sortable
            />
            <Column
              header="Сургалт зохион байгуулах үндэслэл"
              body={reasonTrainerBodyTemplate}
            />
            <Column header="Сургалтын зорилго" body={aimtBodyTemplate} />
            <Column
              header="Хэрэгжүүлэх үйл ажиллагаа"
              body={operationTrainerBodyTemplate}
            />
            <Column
              header="Хүлээгдэж буй үр дүн"
              body={resultTrainerBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <GuidelinesModal
              Guidelinescontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
              orgID={orgID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
export default Guidelines;
