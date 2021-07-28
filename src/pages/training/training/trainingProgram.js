import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/trainingProgram.style';
import TrainingProgramModal from './components/trainingProgramModal';
import OrgaStyle from './components/orga.style';
import AutoCompleteSelect from '../../../components/Autocomplete';

// function onChange(date, dateString) {
//   console.log(date, dateString);
// }
const { Content } = Layout;

let editRow;
let isEditMode;
const TrainingProgram = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateTraining, setStateTraining] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingProgram/get', list)
      .then(result => {
        const listResult = result || [];
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
    getService('training/get').then(result => {
      if (result) {
        setStateTraining(result.content || []);
      }
    });
  }, [lazyParams]);

  const getTrainingProgram = trainingId => {
    getService(`trainingProgram/get/${trainingId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
        setTrainingID(trainingId);
      }
    });
  };

  const selectTraining = value => {
    getTrainingProgram(value);
  };

  const add = () => {
    editRow = null;
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

    putService(`trainingProgram/delete/${row.id}`)
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

  const activityBodyTemplate = row => (
    <>
      <span className="p-column-title">Үйл ажиллагаа</span>
      {row.operation}
    </>
  );

  const timeBodyTemplate = row => (
    <>
      <span className="p-column-title">Хэрэгжих хугацаа</span>
      {row.duration}
    </>
  );

  const ownerBodyTemplate = row => (
    <>
      <span className="p-column-title">Хариуцах эзэн</span>
      {row.responsiblePersonName}
    </>
  );

  const materialsBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын материал</span>
      {row.trainingMaterial}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сургалтын хөтөлбөр</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={10} />
                  <Col xs={8} md={8} lg={5}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Сургалт сонгох"
                        data={stateTraining}
                        onChange={value => selectTraining(value)}
                      />
                    </OrgaStyle>
                  </Col>

                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
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
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" header="№" body={indexBodyTemplate} />
            <Column
              field="operation"
              header="Үйл ажиллагаа"
              filter
              body={activityBodyTemplate}
            />
            <Column
              field="duration"
              header="Хэрэгжих хугацаа"
              filter
              body={timeBodyTemplate}
            />
            <Column
              field="responsiblePersonName"
              header="Хариуцах эзэн"
              filter
              body={ownerBodyTemplate}
            />
            <Column
              field="trainingMaterial"
              header="Сургалтын материал"
              filter
              body={materialsBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TrainingProgramModal
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

export default TrainingProgram;
