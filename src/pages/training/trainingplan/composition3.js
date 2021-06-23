import {
  ExclamationCircleOutlined, FileOutlined, FileSyncOutlined, FolderAddFilled, PrinterOutlined, SettingFilled
} from "@ant-design/icons";
import SaveIcon from "@material-ui/icons/Save";
import { Button, Col, Dropdown, Form, Layout, Menu, message, Modal, Row, DatePicker } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from "../../../service/service";
import { PAGESIZE } from "../../../tools/Constant";
import { errorCatch } from "../../../tools/Tools";
import Composition1Modal from "./components/Composition1Modal"
import ContentWrapper from "./components/composition.style";
const { Content } = Layout;
function handleMenuClick(e) { console.log("click", e.key[0]); }
const menu = (
  <Menu onClick={handleMenuClick}>
      <Menu.Item
          key="1"
          icon={<FileSyncOutlined style={{ fontSize: "14px", color: "#45629c" }} />}
      >

          Импорт
      </Menu.Item>
      <Menu.Item
          key="2"
          icon={<FileOutlined style={{ fontSize: "14px", color: "#45629c" }} />}
      >
          Экспорт
      </Menu.Item>

      <Menu.Item
          key="3"
          icon={<PrinterOutlined style={{ fontSize: "14px", color: "#45629c" }} />}
      >

          Хэвлэх
      </Menu.Item>

  </Menu>
);
var isEditMode;
var editRow
function Composition3() {
  let loadLazyTimeout = null;
  const dt = useRef(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [lazyParams, setLazyParams] = useState({
      first: 0,
      rows: 25,
      page: 0,
  });

  useEffect(() => {
      onInit();
  }, [lazyParams])

  const onInit = () => {
      setLoading(true);
      if (loadLazyTimeout) {
          clearTimeout(loadLazyTimeout);
      }
      getService("composition3/get")
          .then((result) => {
              let list = result.content || [];
              list.map(
                  (item, index) =>
                      (item.index = lazyParams.page * PAGESIZE + index + 1)
              );
              setLoading(false);
              setTotalRecords(result.totalElements);
              setList(list);
              setSelectedRows([]);
              setExpandedRows();
          })
          .catch((error) => {
              errorCatch(error);
              isShowLoading(false);
          });
  };

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  const onPage = (event) => {
      let _lazyParams = { ...lazyParams, ...event };
      setLazyParams(_lazyParams);
  };
  const onSort = (event) => {
      let _lazyParams = { ...lazyParams, ...event };
      setLazyParams(_lazyParams);
  };
  const onFilter = (event) => {
      let _lazyParams = { ...lazyParams, ...event };
      _lazyParams["first"] = 0;
      setLazyParams(_lazyParams);
  };
  const add = () => {
      setIsModalVisible(true);
      isEditMode = false;
  };
  const edit = (row) => {
      editRow = row.data
      isEditMode = true
      setIsModalVisible(true)
  }
  const closeModal = (isSuccess = false) => {
      setIsModalVisible(false);
      if (isSuccess) onInit();
  };
  const handleDeleted = () => {
      if (selectedRows.length === 0) {
          message.warning("Устгах өгөгдлөө сонгоно уу");
          return;
      }
      debugger
      putService("composition3/delete/" + selectedRows[0].id)
          .then((result) => {
              message.success("Амжилттай устлаа");
              onInit();
          })
          .catch((error) => {
              errorCatch(error);
          });
  };
  const pop = () => {
      if (selectedRows.length === 0) {
          message.warning("Устгах өгөгдлөө сонгоно уу");
          return;
      } else {
          confirm();
      }
  };
  // const rowExpansionTemplate = (data) => {
  //     return (
  //         <div className="orders-subtable">
  //             <span>{data.name}</span>
  //             <DataTable
  //                 selection={selectedRows}
  //                 onSelectionChange={(e) => {
  //                     setSelectedRows(e.value);
  //                 }}
  //                 value={data.composition1Indicator.filter((z) => z.status === true)}
  //                 onRowClick={edit}
  //             >
  //                 <Column
  //                     selectionMode="multiple"
  //                     headerStyle={{ width: "53px", padding: "0px" }}
  //                 ></Column>
  //                 <Column field="id" header="Id" style={{ width: "50px" }}></Column>
  //                 <Column field="name" header="Нэр" />
  //                 <Column field="path" header="Зам" />
  //                 <Column headerStyle={{ width: "4rem" }}></Column>
  //             </DataTable>
  //         </div>
  //     );
  // };
  const rowExpandCity = (e) => {

      if (e.data.userControllers)
          return
      getService("composition3/get").then((result) => {
          e.data.userControllers = result.content || []
          setList([...list])
      })
  }

  const expandedCity = (e) => {
      setExpandedRows(e.data)
  };

  return (
      <ContentWrapper>
      <div>
          <Layout className="btn-layout">
              <Content>
              <Row>
      <Col>
        <h2 className="title">Бүрэлдэхүүн 3</h2>
      </Col></Row>
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
                      <Col span={2}>
                           
                      </Col>
                      <Col span={18} style={{ textAlign: "right" }}>
                          <div style={{ marginRight: "5px" }}>
                              <Dropdown.Button
                                  overlay={menu}
                                  placement="bottomCenter"
                                  icon={
                                      <SettingFilled
                                          style={{ marginLeft: "8px", color: "#45629c" }}
                                      />
                                  }
                              ></Dropdown.Button>
                          </div>
                      </Col>
                  </Row>
              </Content>
          </Layout>
          <DataTable
              ref={dt}
              value={list}
              lazy
              paginator
              first={lazyParams.first}
              rows={25}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyParams.sortField}
              sortOrder={lazyParams.sortOrder}
              onFilter={onFilter}
              filters={lazyParams.filters}
              emptyMessage="Өгөгдөл олдсонгүй..."
              className="p-datatable-gridlines"
              selection={selectedRows}
              onSelectionChange={(e) => {
                  setSelectedRows(e.value);
              }}
              dataKey="id"
              onRowToggle={expandedCity}
              className="p-datatable-gridlines"
          >
              <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column>
              <Column field="code" header="№" style={{ width: "50px" }} />
              <Column field="name" header="Сургалтын агууллага"/>
              <Column field="" header="Зорилтот үр дүн"/>
              <Column field="" header="Шалгуур үзүүлэлт"/>
              <Column field="" header="I улирал"/>
              <Column field="" header="II улирал"/>
              <Column field="" header="III улирал"/>
              <Column field="" header="IV улирал"/>
              <Column field="" header="Нийт"/>
              <Column field="" header="Үр дүнгийн биелэлт"/>
          </DataTable>
          {isModalVisible && (
              <Composition1Modal
              Composition={editRow}
                  isModalVisible={isModalVisible}
                  close={closeModal}
                  isEditMode={isEditMode}
              />
          )}
      </div>
      </ContentWrapper>
  );
  function confirm() {
      Modal.confirm({
          title: "Та устгахдаа итгэлтэй байна уу ?",
          icon: <ExclamationCircleOutlined />,
          okButtonProps: {},
          okText: "Устгах",
          cancelText: "Буцах",
          onOk() {
              handleDeleted();
              onInit();
          },
          onCancel() { },
      });
  }
}
export default Composition3;