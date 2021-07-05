import {
  ExclamationCircleOutlined,
  FileOutlined,
  FileSyncOutlined, PrinterOutlined,
  SettingFilled
} from "@ant-design/icons";
import Delete from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import {
  Button,
  Col,
  Dropdown, Layout,
  Menu,
  message,
  Modal,
  Row
} from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { isShowLoading } from "../../context/Tools";
import { getService, putService } from "../../service/service";
import { errorCatch } from "../../tools/Tools";
import "../criteria/criteria.style";
import ContentWrapper from "../criteria/criteria.style";
import UserModal from "../user/components/UserModal";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { Content } = Layout;
function handleMenuClick(e) {
  console.log("click", e.key[0]);
}
function onChange(date, dateString) {
  console.log(date, dateString);
}
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
var editRow;
const User = () => {
  const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'category', order: -1 }]);
  let loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
      page: 0,
  });
  const [loading, setLoading] = useState(false);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
      onInit();
  }, [lazyParams])

  const onInit = () => {
      setLoading(true);
      if (loadLazyTimeout) {
          clearTimeout(loadLazyTimeout);
      }
      getService("user/get", list)
          .then((result) => {
              let list = result.content || [];
              list.map(
                  (item, index) =>
                      (item.index = lazyParams.page * PAGESIZE + index + 1)
              );
              setList(list);
              setSelectedRows([]);

          })
          .catch((error)=> {
              errorCatch(error);
              isShowLoading(false);
          })
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

  const handleDeleted = () => {
      if (selectedRows.length === 0) {
          message.warning("Устгах өгөгдлөө сонгоно уу");
          return;
      }
      putService("user/delete/" + selectedRows[0].id)
          .then((result) => {
              message.success("Амжилттай устлаа");
              onInit();
          })
          .catch((error) => {
              errorCatch(error);
          });
  };
  const closeModal = (isSuccess = false) => {
      setIsModalVisible(false);
      if (isSuccess) onInit();
  };
  const pop = () => {
      if (selectedRows.length === 0) {
          message.warning("Устгах өгөгдлөө сонгоно уу");
          return;
      } else {
          confirm();
      }
  };
  const action = (rowData) => {
    return (
        <React.Fragment>
            <Button icon={<FontAwesomeIcon icon={faPen} />} onClick={() => edit(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => delete(rowData)} /> */}
        </React.Fragment>
    );
}

  return (
      <ContentWrapper>
          <div className="button-demo">
              <Layout className="btn-layout">
                  <Content>
                      <Row>
                          <Col span={18}>
                              <h2 className="title">Хэрэглэгчийн жагсаалт</h2>
                          </Col>
                          <Col span={2}>
                              <Button onClick={add} type="link" icon={<SaveIcon />}>
                                  Нэмэх
                              </Button>
                          </Col>
                          <Col span={2}>
                              <Button onClick={pop} type="link" icon={<Delete />}>
                                  Устгах
                              </Button>
                          </Col>
                          <Col span={2} style={{ textAlign: "right" }}>
                              <div>
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
              <div className="datatable-responsive-demo">
                  <DataTable 
                      value={list} 
                      removableSort 
                      paginator 
                      rows={10}
                      className="p-datatable-responsive-demo"
                    //   selectionMode="checkbox"
                    //   selection={selectedRows}
                    //   onRowClick={edit}
                      onSelectionChange={(e) => {
                          setSelectedRows(e.value);
                      }}
                      dataKey="id">
                      {/* <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column> */}
                      <Column field="index" header="№" sortable />
                      <Column field="firstname" header="Нэр" sortable filter filterPlaceholder="Хайх" />
                      <Column field="lastname" header="Овог" style={{ textAlign: "left" }} sortable filter filterPlaceholder="Хайх" />
                      <Column field="register" header="Регистрийн дугаар" sortable filter filterPlaceholder="Хайх" />
                      <Column field="email" header="Й-мэйл" sortable />
                      <Column field="" header="Статус" sortable />
                      <Column headerStyle={{ width: '7rem' }} body={action}></Column>
                  </DataTable>
                  {isModalVisible && (
                      <UserModal
                      Usercontroller={editRow}
                          isModalVisible={isModalVisible}
                          close={closeModal}
                          isEditMode={isEditMode}
                      />
                  )}
              </div>
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

export default User;
