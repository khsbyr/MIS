import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../../constants/Constant';
import { useToolsStore } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import CvModal from './components/CvModal';
import ContentWrapper from './components/trainingProgram.style';
import { useTrainingStore } from '../../../context/TrainingContext';

const { Content } = Layout;

let editRow;
let isEditMode;
let trainerID;
let loadLazyTimeout = null;

const CV = () => {
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
  const { TrainingList } = useTrainingStore();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`trainingTeam/getList/${TrainingList.id}`, obj)
        .then(data => {
          const dataList = data.content || [];
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
    editRow = null;
    setIsModalVisible(true);
    isEditMode = false;
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingTeam/delete/${row.id}`)
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
        // onInit();
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

  const edit = row => {
    trainerID = row.user.trainers.id;
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

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.user.firstname}
    </>
  );

  const LastNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Овог</span>
      {row.user.lastname}
    </>
  );

  const phoneBodyTemplate = row => (
    <>
      <span className="p-column-title">Утас</span>
      {row.user.phoneNumber}
    </>
  );

  const registerBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургагч багшийн регистер</span>
      {row.user.register}
    </>
  );

  const mission = row => (
    <>
      <span className="p-column-title">Гүйцэтгэх үүрэг</span>
      {row.mission}
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
        <div className="datatable-responsive-demo">
          <DataTable
            ref={dt}
            lazy
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            removableSort
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
            className="p-datatable-responsive-demo"
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              header="Овог"
              field="user.lastname"
              body={LastNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Нэр"
              field="user.firstname"
              body={FirstNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />

            <Column
              header="Утас"
              field="user.phoneNumber"
              body={phoneBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="user.register"
              header="Сургагч багшийн регистер"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="mission"
              header="Гүйцэтгэх үүрэг"
              body={mission}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CvModal
              Trainerscontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              orgId={TrainingList?.organization?.id}
              trainerID={trainerID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default CV;
