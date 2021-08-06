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
import React, { useContext, useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import FuelModal from './components/FuelModal';
import OrgaStyle from './components/orga.style';
import RoadModal from './components/RoadModal';
import StationaryModal from './components/StationaryModal';

// function onChange(date, dateString) {
//   console.log(date, dateString);
// }
const { Content } = Layout;

let editRow;
let isEditMode;
let isEditModeFuel;
let isEditModeRoad;
const Budget = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [list3, setList3] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleFuel, setIsModalVisibleFuel] = useState(false);
  const [isModalVisibleRoad, setIsModalVisibleRoad] = useState(false);
  const [budgetID, setBudgetID] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateTraining, setStateTraining] = useState([]);
  // const [setTrainingID] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingBudget/get', list)
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
    getService('training/get').then(result => {
      if (result) {
        setStateTraining(result.content || []);
      }
    });
    getService('stationeryExpenses/get', list1).then(result => {
      if (result) {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList1(listResult);
        setSelectedRows([]);
      }
    });
    getService('hotelTravelExpenses/get', list2).then(result => {
      const listResult = result.content || [];
      listResult.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setList2(listResult);
      setSelectedRows([]);
    });
    getService('fuelExpenses/get', list3).then(result => {
      const listResult = result.content || [];
      listResult.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setList3(listResult);
      setSelectedRows([]);
    });
  }, [lazyParams]);

  const getTrainingProgram = trainingId => {
    getService(`trainingBudget/getByTraining/${trainingId}`, {}).then(
      result => {
        if (result) {
          const listResult = result.content || [];
          const Id = result.id || [];
          setBudgetID(result.id);
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setList(listResult);
          setSelectedRows([]);
        }
      }
    );
  };
  getService(`stationeryExpenses/getListBy/${budgetID}`).then(result => {
    const listResult = result || [];
    listResult.forEach((item, index) => {
      item.index = lazyParams.page * PAGESIZE + index + 1;
    });
    setList1(listResult);
    setSelectedRows([]);
  });
  const getTrainingProgram2 = trainingId => {
    getService(`hotelTravelExpenses/getListBy/${trainingId}`, list2).then(
      result => {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList2(listResult);
        setSelectedRows([]);
      }
    );
  };
  const getTrainingProgram3 = trainingId => {
    getService(`fuelExpenses/getListBy/${trainingId}`, list3).then(result => {
      const listResult = result || [];
      listResult.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setList3(listResult);
      setSelectedRows([]);
    });
  };

  const selectTraining = value => {
    getTrainingProgram(value);
    getTrainingProgram2(value);
    getTrainingProgram3(value);
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

    putService(`stationeryExpenses/delete/${row.id}`)
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

  const editFuel = row => {
    editRow = row;
    isEditModeFuel = true;
    setIsModalVisibleFuel(true);
  };

  const addFuel = () => {
    setIsModalVisibleFuel(true);
    isEditModeFuel = false;
  };

  const handleDeletedFuel = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`fuelExpenses/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmFuel(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedFuel(row);
        onInit();
      },
      onCancel() {},
    });
  }
  const popFuel = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmFuel();
    }
  };

  const actionFuel = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editFuel(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popFuel(row)}
      />
    </>
  );
  const editRoad = row => {
    editRow = row;
    isEditModeRoad = true;
    setIsModalVisibleRoad(true);
  };

  const addRoad = () => {
    setIsModalVisibleRoad(true);
    isEditModeRoad = false;
  };

  const handleDeletedRoad = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`hotelTravelExpenses/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmRoad(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedRoad(row);
        onInit();
      },
      onCancel() {},
    });
  }

  const popRoad = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmRoad();
    }
  };

  const actionRoad = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editRoad(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popRoad(row)}
      />
    </>
  );

  const closeModalFuel = (isSuccess = false) => {
    setIsModalVisibleFuel(false);
    if (isSuccess) onInit();
  };

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const closeModalRoad = (isSuccess = false) => {
    setIsModalVisibleRoad(false);
    if (isSuccess) onInit();
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  // const costNameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Зардлын нэр</span>
  //     {row.stationeryExpenses.costName}
  //   </>
  // );

  // const unitPriceNameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Нэгж үнэ /₮/</span>
  //     {row.stationeryExpenses.unitPrice}
  //   </>
  // );

  // const quantityNameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Тоо ширхэг</span>
  //     {row.stationeryExpenses.quantity}
  //   </>
  // );

  // const numberOfPeopleNameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Хүний тоо</span>
  //     {row.stationeryExpenses.numberOfPeople}
  //   </>
  // );

  // const totalNameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Дүн /₮/</span>
  //     {row.stationeryExpenses.total}
  //   </>
  // );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row justify="end" gutter={[16, 16]}>
                  <Col>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      {' '}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={add}
                    >
                      {' '}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <Layout className="btn-layout">
            <Content>
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <h3>1. Бичгийн хэрэгсэл</h3>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <Row gutter={[0, 15]}>
                    <Col xs={8} md={8} lg={10} />
                    <Col xs={8} md={8} lg={11} />
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
          <DataTable
            value={list1}
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
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />

            <Column
              field="costName"
              header="Зардлын нэр"
              // body={costNameBodyTemplate}
            />
            <Column
              field="unitPrice"
              header="Нэгж үнэ /₮/"
              // body={unitPriceNameBodyTemplate}
            />
            <Column
              field="quantity"
              header="Тоо ширхэг"
              // body={quantityNameBodyTemplate}
            />
            <Column
              field="numberOfPeople"
              header="Хүний тоо"
              // body={numberOfPeopleNameBodyTemplate}
            />
            <Column
              field="total"
              header="Дүн /₮/"
              // body={totalNameBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <StationaryModal
              Stationarycontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
            />
          )}
        </div>
        <div className="datatable-responsive-demo">
          <Layout className="btn-layout">
            <Content>
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <h3>2. Зам хоног, буудлын зардал</h3>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <Row gutter={[0, 15]}>
                    <Col xs={8} md={8} lg={10} />
                    <Col xs={8} md={8} lg={11} />
                    <Col xs={8} md={8} lg={3}>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={addRoad}
                      >
                        Нэмэх
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Content>
          </Layout>
          <DataTable
            value={list2}
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
            <Column field="index" header="№" style={{ width: 40 }} />

            <Column field="numberOfPeople" header="МЗҮБ хүний тоо" />
            <Column field="costPerDay" header="Хоногт /₮/" />
            <Column field="costType.name" header="Төлбөрийн төрөл" />
            <Column field="days" header="Хоног" />
            <Column field="total" header="Нийт /₮/" />
            <Column headerStyle={{ width: '7rem' }} body={actionRoad} />
          </DataTable>
          {isModalVisibleRoad && (
            <RoadModal
              Roadcontroller={editRow}
              isModalVisible={isModalVisibleRoad}
              close={closeModalRoad}
              isEditMode={isEditModeRoad}
            />
          )}
        </div>
        <div className="datatable-responsive-demo">
          <Layout className="btn-layout">
            <Content>
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <h3>3. Шатахууны зардал /маршрутаар/</h3>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <Row gutter={[0, 15]}>
                    <Col xs={8} md={8} lg={10} />
                    <Col xs={8} md={8} lg={11} />
                    <Col xs={8} md={8} lg={3}>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={addFuel}
                      >
                        Нэмэх
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Content>
          </Layout>
          <DataTable
            value={list3}
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
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column field="route" header="Маршрут" />
            <Column field="roadLength" header="Замын урт /км/" />
            <Column field="regionalSupplement" header="Бүсийн нэмэгдэл /%/" />
            <Column field="fuelConsumption" header="Зарцуулах шатахуун /л/" />
            <Column field="fuelCost" header="Шатахууны үнэ /₮/ A92" />
            <Column field="total" header="Нийт /₮/" />
            <Column headerStyle={{ width: '7rem' }} body={actionFuel} />
          </DataTable>
          {isModalVisibleFuel && (
            <FuelModal
              Fuelcontroller={editRow}
              isModalVisible={isModalVisibleFuel}
              close={closeModalFuel}
              isEditMode={isEditModeFuel}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Budget;
