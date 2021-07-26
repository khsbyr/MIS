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
  Form,
  Layout,
  Menu,
  message,
  Modal,
  Row,
  DatePicker,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Toast } from 'primereact/toast';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { PAGESIZE } from '../../../constants/Constant';
import { errorCatch } from '../../../tools/Tools';
import Composition1Modal from './components/Composition1Modal';
import ContentWrapper from './components/composition.style';

function handleMenuClick(e) {
  console.log('click', e.key[0]);
}
function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

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
const Composition2 = () => {
  const [products, setProducts] = useState([]);
  const toast = useRef(null);
  const isMounted = useRef(false);

  const [multiSortMeta, setMultiSortMeta] = useState([
    { field: 'category', order: -1 },
  ]);
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [listchild, setListchild] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingPlan/getParents/2', list).then(result => {
      const listResult = result.content || [];
      listResult.forEach((item, index) => {
        item.index = lazyParams.page * PAGESIZE + index + 1;
      });
      setList(listResult);
      setSelectedRows([]);
    });
    getService('trainingPlan/getChildren/1', listchild)
      .then(result => {
        const listChild = result.content || [];
        listChild.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setListchild(listChild);
        setSelectedRows([]);
      })
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
    putService(`organization/delete/${selectedRows[0].id}`)
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

  const rowExpansionTemplate = data => (
    <div className="orders-subtable">
      <DataTable
        value={listchild}
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
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em', padding: '0px' }}
        />

        <Column field="index" header="Id" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="upIndicator" header="Үр дүн" sortable />
        <Column field="amount" header="Amount" sortable />
        <Column field="status" header="Status" sortable />
        <Column field="index" header="Id" sortable />
        <Column field="index" header="Id" sortable />
        <Column field="index" header="Id" sortable />
        <Column field="index" header="Id" sortable />

        <Column field="index" header="Id" sortable />
      </DataTable>
    </div>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col>
                <h2 className="title">Бүрэлдэхүүн 2</h2>
              </Col>
            </Row>
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
              <Col span={18} style={{ textAlign: 'right' }}>
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
            expandedRows={expandedRows}
            onRowToggle={e => setExpandedRows(e.data)}
            // onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3em', padding: '0px' }}
            />
            <Column expander style={{ width: '3em' }} />
            <Column field="code" header="№" style={{ width: '50px' }} />
            <Column field="name" header="Сургалтын агууллага" filter />
            <Column field="" header="Зорилтот үр дүн" />
            <Column field="" header="Шалгуур үзүүлэлт" />
            <Column field="" header="I улирал" />
            <Column field="" header="II улирал" />
            <Column field="" header="III улирал" />
            <Column field="" header="IV улирал" />
            <Column field="" header="Нийт" />
            <Column field="" header="Үр дүнгийн биелэлт" />
          </DataTable>
          {isModalVisible && (
            <Composition1Modal
              Criteriacontroller={editRow}
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

export default Composition2;
