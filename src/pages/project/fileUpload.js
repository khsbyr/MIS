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
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../training/tabs/components/organization.style';
import FileUploadModal from './components/ModalComponent/fileUploadModal';
import { useProjectStore } from '../../context/ProjectContext';

const { Content } = Layout;

let editRow;
let isEditMode;
const fileUpload = () => {
  const loadLazyTimeout = null;
  const { ProjectList } = useProjectStore();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const PAGESIZE = 20;
  const [summaryID, setSummaryID] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService(
      `summaryBallotForm/getBudgetCostEstimatesBySbfId/${ProjectList.summaryBallotForm.id}`
    )
      .then(result => {
        const listResult = result;
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSummaryID(ProjectList.summaryBallotForm.id);
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

  const edit = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`budgetCostEstimates/delete/${row.id}`)
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

  const pop = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  function openTab(row) {
    window.open(`${row.file.path}`);
  }

  function openTab1(row) {
    window.open(`${row.data.file.path}`);
  }

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
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faFilePdf} />}
        onClick={() => openTab(row)}
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

  const fileName = row => (
    <>
      <span className="p-column-title">Файлын нэр</span>
      {row.file.fileName}
    </>
  );

  const description = row => (
    <>
      <span className="p-column-title">Тайлбар</span>
      {row.description}
    </>
  );

  const date = row => (
    <>
      <span className="p-column-title">Огноо</span>
      <>{moment(row && row.createdDate).format('YYYY-M-D')}</>
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            rows={10}
            className="p-datatable-responsive-demo"
            dataKey="id"
            onRowClick={openTab1}
          >
            <Column header="№" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column header="Файлын нэр" body={fileName} />
            <Column header="Тайлбар" body={description} />
            <Column header="Огноо" body={date} />
            <Column headerStyle={{ width: '8rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <FileUploadModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              summaryID={summaryID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default fileUpload;
