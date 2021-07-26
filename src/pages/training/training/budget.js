import {
  ExclamationCircleOutlined,
  FileOutlined,
  FileSyncOutlined,
  FolderAddFilled,
  PrinterOutlined,
  SettingFilled,
} from '@ant-design/icons';
import SaveIcon from '@material-ui/icons/Save';
import {
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { PAGESIZE } from '../../../constants/Constant';
import { errorCatch } from '../../../tools/Tools';
import RoadModal from './components/RoadModal';
import ContentWrapper from './components/attendance.style';
import StationaryModal from './components/StationaryModal';
import FuelModal from './components/FuelModal';

function handleMenuClick(e) {
  console.log('click', e.key[0]);
}
function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;
const { Option } = Select;
const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item
      key="1"
      icon={<FileSyncOutlined style={{ fontSize: '14px', color: '#45629c' }} />}
    >
      Импорт
    </Menu.Item>
    <Menu.Item
      key="2"
      icon={<FileOutlined style={{ fontSize: '14px', color: '#45629c' }} />}
    >
      Экспорт
    </Menu.Item>

    <Menu.Item
      key="3"
      icon={<PrinterOutlined style={{ fontSize: '14px', color: '#45629c' }} />}
    >
      Хэвлэх
    </Menu.Item>
  </Menu>
);

let editRow;
let isEditMode;
const Budget = () => {
  const toolsStore = useContext(ToolsContext);
  const [products, setProducts] = useState([]);
  const [multiSortMeta, setMultiSortMeta] = useState([
    { field: 'category', order: -1 },
  ]);
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleBichigHeregsel, setIsModalVisibleBichigHeregsel] =
    useState(false);
  const [isModalVisibleShathuuniiZardal, setIsModalVisibleShathuuniiZardal] =
    useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingProgram/get', list)
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
    editRow = row.data;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingProgram/delete/${selectedRows[0].id}`)
      .then(result => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
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

  const addBichigHeregsel = () => {
    setIsModalVisibleBichigHeregsel(true);
    isEditMode = false;
  };

  const popBichigHeregsel = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };
  const closeModalBichigHeregsel = (isSuccess = false) => {
    setIsModalVisibleBichigHeregsel(false);
    if (isSuccess) onInit();
  };

  const addShathuuniiZardal = () => {
    setIsModalVisibleShathuuniiZardal(true);
    isEditMode = false;
  };

  const popShathuuniiZardal = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };
  const closeModalShathuuniiZardal = (isSuccess = false) => {
    setIsModalVisibleShathuuniiZardal(false);
    if (isSuccess) onInit();
  };

  const [selectedProducts, setSelectedProducts] = useState(null);
  return (
    <ContentWrapper>
      <h2 className="title">Сургалтын төсөв</h2>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col span={2}>
                <Button
                  onClick={addBichigHeregsel}
                  type="link"
                  icon={<SaveIcon />}
                >
                  Нэмэх
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  onClick={popBichigHeregsel}
                  type="link"
                  icon={<FolderAddFilled />}
                >
                  Устгах
                </Button>
              </Col>
              <Col span={20} style={{ textAlign: 'right' }}>
                <div style={{ marginRight: '5px' }}>
                  <Dropdown.Button
                    overlay={menu}
                    placement="bottomCenter"
                    icon={
                      <SettingFilled
                        style={{ marginLeft: '8px', color: '#45629c' }}
                      />
                    }
                  />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <h3>1. Бичгийн хэрэгсэл</h3>
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selectionMode="checkbox"
            selection={selectedRows}
            onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3em', padding: '0px' }}
            />
            <Column field="" header="Зардлын нэр" />
            <Column field="" header="Нэгж үнэ /₮/" />
            <Column field="" header="Тоо ширхэг" />
            <Column field="" header="Хүний тоо" />
            <Column field="" header="Дүн /₮/" />
          </DataTable>
          {isModalVisibleBichigHeregsel && (
            <StationaryModal
              Criteriacontroller={editRow}
              isModalVisible={isModalVisibleBichigHeregsel}
              close={closeModalBichigHeregsel}
              isEditMode={isEditMode}
            />
          )}
        </div>

        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col span={2}>
                <Button onClick={add} type="link" icon={<SaveIcon />}>
                  Нэмэх
                </Button>
              </Col>
              <Col span={2}>
                <Button onClick={pop} type="link" icon={<FolderAddFilled />}>
                  Устгах
                </Button>
              </Col>
              <Col span={20} style={{ textAlign: 'right' }}>
                <div style={{ marginRight: '5px' }}>
                  <Dropdown.Button
                    overlay={menu}
                    placement="bottomCenter"
                    icon={
                      <SettingFilled
                        style={{ marginLeft: '8px', color: '#45629c' }}
                      />
                    }
                  />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <h3>2. Зам хоног, буудлын зардал</h3>
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selectionMode="checkbox"
            selection={selectedRows}
            onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3em', padding: '0px' }}
            />
            <Column field="" header="Зардлын нэр" />
            <Column field="" header="Зардлын төрөл" />
            <Column field="" header="МЗҮБ хүний тоо" />
            <Column field="" header="Хоногт /₮/" />
            <Column field="" header="Хоног" />
            <Column field="" header="Нийт /₮/" />
          </DataTable>
          {isModalVisible && (
            <RoadModal
              Criteriacontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
            />
          )}
        </div>

        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col span={2}>
                <Button
                  onClick={addShathuuniiZardal}
                  type="link"
                  icon={<SaveIcon />}
                >
                  Нэмэх
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  onClick={popShathuuniiZardal}
                  type="link"
                  icon={<FolderAddFilled />}
                >
                  Устгах
                </Button>
              </Col>
              <Col span={20} style={{ textAlign: 'right' }}>
                <div style={{ marginRight: '5px' }}>
                  <Dropdown.Button
                    overlay={menu}
                    placement="bottomCenter"
                    icon={
                      <SettingFilled
                        style={{ marginLeft: '8px', color: '#45629c' }}
                      />
                    }
                  />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>

        <div className="datatable-responsive-demo">
          <h3>3. Шатахууны зардал /маршрутаар/</h3>
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selectionMode="checkbox"
            selection={selectedRows}
            onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3em', padding: '0px' }}
            />
            <Column field="" header="Маршрут" />
            <Column field="" header="Замын урт /км/" />
            <Column field="" header="Бүсийн нэмэгдэл /%/" />
            <Column field="" header="Зарцуулах шатахуун /л/" />
            <Column field="" header="Шатахууны үнэ /₮/ A92" />
            <Column field="" header="Нийт /₮/" />
          </DataTable>
          {isModalVisibleShathuuniiZardal && (
            <FuelModal
              Criteriacontroller={editRow}
              isModalVisible={isModalVisibleShathuuniiZardal}
              close={closeModalShathuuniiZardal}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
export default Budget;
