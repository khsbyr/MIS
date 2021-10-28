import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/trainingProgram.style';
import TrainingTopicModal from './trainingTopicModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TrainingTopic = props => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const [totalRecords, setTotalRecords] = useState(0);
  const toast = useRef(null);
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
      getService(`trainingTopic/getByTrainingId/${props.id}`, obj)
        .then(data => {
          const dataList = data.content || [];
          setTrainingID(props.id);
          dataList.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(data.totalElements);
          setList(dataList);
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
    putService(`trainingTopic/delete/${row.id}`)
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

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const operationBodyTemplate = row => (
    <>
      <span className="p-column-title">Үйл ажиллагаа</span>
      {row.trainingProgram.operation}
    </>
  );

  const programDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Цаг</span>
      {row.time}
    </>
  );

  const trainingTopic = row => (
    <>
      <span className="p-column-title">Сургалтын сэдэв</span>
      {row.topic}
    </>
  );

  const respoUser = row => (
    <>
      <span className="p-column-title">Сургагч багш</span>
      {row.resPersonTrainingTopics.map(z => z.resPersonName).join(', ')}
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
        <Toast ref={toast} />

        <div className="datatable-responsive-demo">
          <DataTable
            ref={dt}
            lazy
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            value={list}
            emptyMessage="Өгөгдөл олдсонгүй..."
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
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />

            <Column
              field="trainingProgram.operation"
              header="Хөтөлбөрийн нэр"
              body={operationBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="time"
              header="Цаг"
              body={programDateBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="startsWith"
            />
            <Column
              field="topic"
              header="Сургалтын сэдэв"
              body={trainingTopic}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="startsWith"
            />
            <Column
              field="resPersonTrainingTopics"
              header="Сургагч багш"
              body={respoUser}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TrainingTopicModal
              Trainingprogramcontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
export default TrainingTopic;
