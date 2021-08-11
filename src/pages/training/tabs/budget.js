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
import { ColumnGroup } from 'primereact/columngroup';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import FuelModal from './components/FuelModal';
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
const Budget = props => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [list3, setList3] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleFuel, setIsModalVisibleFuel] = useState(false);
  const [isModalVisibleRoad, setIsModalVisibleRoad] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [budgetID, setBudgetID] = useState([]);
  const [setStateCostType] = useState([]);

  // const [setTrainingID] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`training/get/${props.id}`, list)
      .then(result => {
        const listResult = result.trainingBudget || [];
        setBudgetID(result.trainingBudget.id);
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
    getService('costType/get').then(result => {
      if (result) {
        setStateCostType(result || []);
      }
    });
    getService(`stationeryExpenses/getListBy/${props.id}`, list1).then(
      result => {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList1(listResult);
        setSelectedRows([]);
      }
    );
    getService(`hotelTravelExpenses/getListBy/${props.id}`, list2).then(
      result => {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList2(listResult);
        setSelectedRows([]);
      }
    );
    getService(`fuelExpenses/getListBy/${props.id}`, list3).then(result => {
      const listResult = result || [];
      listResult.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setList3(listResult);
      setSelectedRows([]);
    });
  }, [lazyParams]);

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
  const popFuel = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmFuel(row);
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

  const popRoad = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmRoad(row);
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
  // total
  const totalBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Нийт төсөв /₮/</span>
      {row.totalBudget}
    </>
  );
  const performanceBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн төсөв /₮/</span>
      {row.performanceBudget}
    </>
  );
  const stationeryTotalBodyTemplate = row => (
    <>
      <span className="p-column-title">Бичгийн хэрэгсэл нийт /₮/</span>
      {row.stationeryTotal}
    </>
  );
  const hotelTotalBodyTemplate = row => (
    <>
      <span className="p-column-title">Зам хоног, буудлын зардал нийт /₮/</span>
      {row.hotelTotal}
    </>
  );
  const fuelTotalBodyTemplate = row => (
    <>
      <span className="p-column-title">Шатахууны зардал нийт /₮/</span>
      {row.fuelTotal}
    </>
  );

  // stationeryExpenses
  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const costNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Зардлын нэр</span>
      {row.costName}
    </>
  );

  const unitPriceNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэгж үнэ /₮/</span>
      {row.unitPrice}
    </>
  );

  const quantityNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Тоо ширхэг</span>
      {row.quantity}
    </>
  );

  const numberOfPeopleNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Хүний тоо</span>
      {row.numberOfPeople}
    </>
  );

  const totalNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Дүн /₮/</span>
      {row.total}
    </>
  );

  // hotelTravelExpenses
  const numberOfPeopleBodyTemplate = row => (
    <>
      <span className="p-column-title">МЗҮБ хүний тоо</span>
      {row.numberOfPeople}
    </>
  );

  const costPerDayBodyTemplate = row => (
    <>
      <span className="p-column-title">Хоногт /₮/</span>
      {row.costPerDay}
    </>
  );

  const costTypeBodyTemplate = row => (
    <>
      <span className="p-column-title">Төлбөрийн төрөл</span>
      {row.costType && row.costType.name}
    </>
  );

  const daysBodyTemplate = row => (
    <>
      <span className="p-column-title">Хоног</span>
      {row.days}
    </>
  );

  const totalBodyTemplate = row => (
    <>
      <span className="p-column-title">Нийт /₮/</span>
      {row.total}
    </>
  );
  // fuelExpenses
  const routeBodyTemplate = row => (
    <>
      <span className="p-column-title">Маршрут</span>
      {row.route}
    </>
  );

  const roadLengthBodyTemplate = row => (
    <>
      <span className="p-column-title">Замын урт /км/</span>
      {row.roadLength}
    </>
  );

  const regionalSupplementBodyTemplate = row => (
    <>
      <span className="p-column-title">Бүсийн нэмэгдэл /%/</span>
      {row.regionalSupplement}
    </>
  );

  const fuelConsumptionBodyTemplate = row => (
    <>
      <span className="p-column-title">Зарцуулах шатахуун /л/</span>
      {row.fuelConsumption}
    </>
  );

  const fuelCostBodyTemplate = row => (
    <>
      <span className="p-column-title">Шатахууны үнэ /₮/ A92</span>
      {row.fuelCost}
    </>
  );

  const totalfuelBodyTemplate = row => (
    <>
      <span className="p-column-title">Нийт /₮/</span>
      {row.total}
    </>
  );
  // const lastYearTotal = () => {
  //   let total = 0;
  //   for (const sale of sales) {
  //     total += sale.lastYearProfit;
  //   }

  //   return formatCurrency(total);
  // };

  // const thisYearTotal = () => {
  //   let total = 0;
  //   for (const sale of sales) {
  //     total += sale.thisYearProfit;
  //   }

  //   return formatCurrency(total);
  // };
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column />
        <Column />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'left' }} />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'left' }} />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'left' }} />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'left' }} />
      </Row>
    </ColumnGroup>
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
                  {/* <Col>
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
                  </Col> */}
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
            <Column
              header="Бичгийн хэрэгсэл нийт /₮/"
              body={stationeryTotalBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Зам хоног, буудлын зардал нийт /₮/"
              body={hotelTotalBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Шатахууны зардал нийт /₮/"
              body={fuelTotalBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Нийт төсөв /₮/"
              body={totalBudgetBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Гүйцэтгэлийн төсөв /₮/"
              body={performanceBudgetBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            {/* <Column
              header="Үйлдэл"
              headerStyle={{ width: '7rem' }}
              body={action}
            /> */}
          </DataTable>
        </div>
        {/* <Stationary /> */}
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
          <DataTable
            footerColumnGroup={footerGroup}
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
              body={costNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="unitPrice"
              header="Нэгж үнэ /₮/"
              body={unitPriceNameBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="quantity"
              header="Тоо ширхэг"
              body={quantityNameBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="numberOfPeople"
              header="Хүний тоо"
              body={numberOfPeopleNameBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="total"
              header="Дүн /₮/"
              body={totalNameBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <StationaryModal
              Stationarycontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              budgetID={budgetID}
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
                      <Tooltip title="Нэмэх" arrowPointAtCenter>
                        <Button
                          type="text"
                          className="export"
                          icon={<FontAwesomeIcon icon={faPlus} />}
                          onClick={addRoad}
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
            <Column
              field="index"
              header="№"
              style={{ width: 40 }}
              body={indexBodyTemplate}
            />

            <Column
              field="numberOfPeople"
              header="МЗҮБ хүний тоо"
              body={numberOfPeopleBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="costPerDay"
              header="Хоногт /₮/"
              bodyStyle={{ textAlign: 'center' }}
              body={costPerDayBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Төлбөрийн төрөл"
              body={costTypeBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="days"
              header="Хоног"
              bodyStyle={{ textAlign: 'center' }}
              body={daysBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="total"
              header="Нийт /₮/"
              bodyStyle={{ textAlign: 'center' }}
              body={totalBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={actionRoad} />
          </DataTable>
          {isModalVisibleRoad && (
            <RoadModal
              Roadcontroller={editRow}
              isModalVisible={isModalVisibleRoad}
              close={closeModalRoad}
              isEditMode={isEditModeRoad}
              budgetID={budgetID}
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
                      <Tooltip title="Нэмэх" arrowPointAtCenter>
                        <Button
                          type="text"
                          className="export"
                          icon={<FontAwesomeIcon icon={faPlus} />}
                          onClick={addFuel}
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
            <Column
              field="route"
              header="Маршрут"
              body={routeBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="roadLength"
              bodyStyle={{ textAlign: 'center' }}
              header="Замын урт /км/"
              body={roadLengthBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="regionalSupplement"
              bodyStyle={{ textAlign: 'center' }}
              header="Бүсийн нэмэгдэл /%/"
              body={regionalSupplementBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="fuelConsumption"
              header="Зарцуулах шатахуун /л/"
              bodyStyle={{ textAlign: 'center' }}
              body={fuelConsumptionBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="fuelCost"
              bodyStyle={{ textAlign: 'center' }}
              header="Шатахууны үнэ /₮/ A92"
              body={fuelCostBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="total"
              header="Нийт /₮/"
              bodyStyle={{ textAlign: 'center' }}
              body={totalfuelBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={actionFuel} />
          </DataTable>
          {isModalVisibleFuel && (
            <FuelModal
              Fuelcontroller={editRow}
              isModalVisible={isModalVisibleFuel}
              close={closeModalFuel}
              isEditMode={isEditModeFuel}
              budgetID={budgetID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Budget;
