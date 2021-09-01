import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import ContentWrapper from './components/attendance.style';
import FuelModal from './components/FuelModal';
import RoadModal from './components/RoadModal';
import StationaryModal from './components/StationaryModal';
import { PAGESIZE } from '../../../constants/Constant';

const { Content } = Layout;

let editRow;
let isEditMode;
let isEditModeFuel;
let isEditModeRoad;
let loadLazyTimeout = null;

const Budget = props => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [list3, setList3] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleFuel, setIsModalVisibleFuel] = useState(false);
  const [isModalVisibleRoad, setIsModalVisibleRoad] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const dt = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [budgetID, setBudgetID] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // const [setTrainingID] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`training/get/${props.id}`, obj)
        .then(data => {
          const dataList = data.trainingBudget || [];
          setBudgetID(data.trainingBudget.id);
          setTotalRecords(data.totalElements);
          setList([dataList]);
          setSelectedRows([]);
          toolsStore.setIsShowLoader(false);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          message.error(error.toString());
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
    const obj = convertLazyParamsToObj(lazyParams);
    getService(`stationeryExpenses/getListBy/${props.id}`, obj).then(data => {
      const dataList = data || [];
      dataList.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setTotalRecords(data.totalElements);
      setList1(dataList);
      setSelectedRows([]);
    });
    getService(`hotelTravelExpenses/getListBy/${props.id}`, obj).then(data => {
      const dataList = data || [];
      dataList.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setTotalRecords(data.totalElements);
      setList2(dataList);
      setSelectedRows([]);
    });
    getService(`fuelExpenses/getListBy/${props.id}`, obj).then(data => {
      const dataList = data || [];
      dataList.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setTotalRecords(data.totalElements);
      setList3(dataList);
      setSelectedRows([]);
    });
  };

  useEffect(() => {
    onInit();
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

  const onPage1 = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort1 = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter1 = event => {
    const params = { ...lazyParams, ...event };
    params.first = 0;
    setLazyParams(params);
  };

  const onPage2 = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort2 = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter2 = event => {
    const params = { ...lazyParams, ...event };
    params.first = 0;
    setLazyParams(params);
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

  function Formatcurrency(value) {
    return `${value}₮`;
    // console.log(value);
    // const values = value || 0;
    // return `${values.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮`;
  }

  const nf = new Intl.NumberFormat();
  nf.format(2500);

  function Formatpercent(value) {
    return `${value} %`;
  }

  function FormatKm(value) {
    return `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} км`;
  }
  // total
  const totalBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Нийт төсөв /₮/</span>
      {/* {Formatcurrency(row.totalBudget)} */}
      {Formatcurrency(nf.format(row.totalBudget))}
    </>
  );
  const performanceBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн төсөв /₮/</span>
      {/* {Formatcurrency(row.performanceBudget)} */}
      {Formatcurrency(nf.format(row.performanceBudget))}
    </>
  );
  // const stationeryTotalBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Бичгийн хэрэгсэл нийт /₮/</span>
  //     {Formatcurrency(row.stationeryTotal)}
  //   </>
  // );
  // const hotelTotalBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Зам хоног, буудлын зардал нийт /₮/</span>
  //     {Formatcurrency(row.hotelTotal)}
  //   </>
  // );
  // const fuelTotalBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Шатахууны зардал нийт /₮/</span>
  //     {Formatcurrency(row.fuelTotal)}
  //   </>
  // );

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
      {/* {Formatcurrency(nf.format(row.unitPrice))} */}
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
      {/* {row.total} */}
      {Formatcurrency(nf.format(row.total))}
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
      {/* {Formatcurrency(nf.format(row.costPerDay))} */}
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
      {/* {Formatcurrency(row.total)} */}
      {Formatcurrency(nf.format(row.total))}
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
      {FormatKm(row.roadLength)}
    </>
  );

  const regionalSupplementBodyTemplate = row => (
    <>
      <span className="p-column-title">Бүсийн нэмэгдэл /%/</span>
      {Formatpercent(row.regionalSupplement)}
    </>
  );

  const fuelConsumptionBodyTemplate = row => (
    <>
      <span className="p-column-title">Зарцуулах шатахуун /л/</span>
      {row.fuelConsumption} л
    </>
  );

  const fuelCostBodyTemplate = row => (
    <>
      <span className="p-column-title">Шатахууны үнэ /₮/ A92</span>
      {row.fuelCost}
      {/* {Formatcurrency(nf.format(row.fuelCost))} */}
    </>
  );

  const totalfuelBodyTemplate = row => (
    <>
      <span className="p-column-title">Нийт /₮/</span>
      {/* {Formatcurrency(row.total)} */}
      {Formatcurrency(nf.format(row.total))}
    </>
  );

  const StationaryTotal = () => {
    let total = 0;
    for (let i = 0; i < list1.length; i++) {
      total += list1[i].total;
    }
    return <div> {Formatcurrency(nf.format(total))}</div>;
  };
  const HotelTotal = () => {
    let total = 0;
    for (let i = 0; i < list2.length; i++) {
      total += list2[i].total;
    }
    return <div> {Formatcurrency(nf.format(total))}</div>;
  };
  const FuelTotal = () => {
    let total = 0;
    for (let i = 0; i < list3.length; i++) {
      total += list3[i].total;
    }
    return <div> {Formatcurrency(nf.format(total))}</div>;
  };

  // const Alltotal = (total, HotelTotal, FuelTotal, StationaryTotal) => {
  //   const total = 0;
  //   total === FuelTotal.value + HotelTotal + StationaryTotal;
  //   console.log(total);
  //   return <div>{Formatcurrency(total)}</div>;
  // };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column />
        <Column />
        <Column />
        <Column />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'right' }} />
        <Column
          footer={StationaryTotal}
          footerStyle={{ textAlign: 'center' }}
        />
        <Column />
      </Row>
    </ColumnGroup>
  );
  const footerGroup1 = (
    <ColumnGroup>
      <Row>
        <Column />
        <Column />
        <Column />
        <Column />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'right' }} />
        <Column footer={HotelTotal} footerStyle={{ textAlign: 'center' }} />
        <Column />
      </Row>
    </ColumnGroup>
  );
  const footerGroup2 = (
    <ColumnGroup>
      <Row>
        <Column />
        <Column />
        <Column />
        <Column />
        <Column />
        <Column footer="Нийт:" footerStyle={{ textAlign: 'right' }} />
        <Column footer={FuelTotal} footerStyle={{ textAlign: 'center' }} />
        <Column />
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
                    <Tooltip title={t('print')} arrowPointAtCenter>
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPrint} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title={t('export')} arrowPointAtCenter>
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
                    <Tooltip title={t('pdf')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFilePdf} />}
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            className="p-datatable-responsive-demo"
          >
            <Column
              header="Бичгийн хэрэгсэл нийт /₮/"
              body={StationaryTotal}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Зам хоног, буудлын зардал нийт /₮/"
              body={HotelTotal}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Шатахууны зардал нийт /₮/"
              body={FuelTotal}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Нийт төсөв /₮/"
              body={totalBudgetBodyTemplate}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column
              header="Төсвийн гүйцэтгэл /₮/"
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
        <br />
        {/* <Stationary /> */}
        <div className="datatable-responsive-demo">
          <Layout
            className="btn-layout"
            style={{ marginBottom: '-20px', padding: '0px' }}
          >
            <Content>
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <h3>1. Бичгийн хэрэгсэл</h3>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <Row justify="end" gutter={[16, 16]}>
                    <Col xs={8} md={8} lg={21} />
                    <Col xs={8} md={8} lg={3}>
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
          <DataTable
            ref={dt}
            lazy
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage1}
            onSort={onSort1}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter1}
            filters={lazyParams.filters}
            footerColumnGroup={footerGroup}
            tableStyle={{ minWidth: 1000 }}
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list1}
            removableSort
            paginator
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
          <Layout
            className="btn-layout"
            style={{ marginBottom: '-20px', padding: '0px' }}
          >
            <Content>
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <h3>2. Зам хоног, буудлын зардал</h3>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <Row justify="end" gutter={[16, 16]}>
                    <Col xs={8} md={8} lg={21} />
                    <Col xs={8} md={8} lg={3}>
                      <Tooltip title={t('add')} arrowPointAtCenter>
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
            footerColumnGroup={footerGroup1}
            value={list2}
            removableSort
            paginator
            ref={dt}
            lazy
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage2}
            onSort={onSort2}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter2}
            filters={lazyParams.filters}
            tableStyle={{ minWidth: 1000 }}
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
          <Layout
            className="btn-layout"
            style={{ marginBottom: '-20px', padding: '0px' }}
          >
            <Content>
              <Row>
                <Col xs={24} md={24} lg={12}>
                  <h3>3. Шатахууны зардал /маршрутаар/</h3>
                </Col>
                <Col xs={24} md={24} lg={12}>
                  <Row justify="end" gutter={[16, 16]}>
                    <Col xs={8} md={8} lg={21} />
                    <Col xs={8} md={8} lg={3}>
                      <Tooltip title={t('add')} arrowPointAtCenter>
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
            footerColumnGroup={footerGroup2}
            value={list3}
            removableSort
            paginator
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
            tableStyle={{ minWidth: 1000 }}
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
