import {
    ExclamationCircleOutlined, FileOutlined, FileSyncOutlined, FolderAddFilled, PrinterOutlined, SettingFilled, DownOutlined
  } from "@ant-design/icons";
  import SaveIcon from "@material-ui/icons/Save";
  import { Button, Col, Dropdown, Form, Layout, Menu, message, Modal, Row, DatePicker, Select, Input, InputNumber } from "antd";
  import { Column } from "primereact/column";
  import { DataTable } from "primereact/datatable";
  import React, { useEffect, useRef, useState } from "react";
  import { isShowLoading } from "../../../context/Tools";
  import { getService, putService } from "../../../service/service";
  import { PAGESIZE } from "../../../tools/Constant";
  import { errorCatch } from "../../../tools/Tools";
  import AttendanceModal from "../training/components/attendanceModal";
  import ContentWrapper from "../training/components/attendance.style";
  const { Content } = Layout;
  function handleMenuClick(e) { console.log("click", e.key[0]); }
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
  var editRow
  function Budget() {
    let loadLazyTimeout = null;
    const dt = useRef(null);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [form] = Form.useForm();
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);
    const { Option } = Select;
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
        getService("guidelines/get")
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
        putService("guidelines/delete/" + selectedRows[0].id)
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
    //                 value={data.criteriaIndicator.filter((z) => z.status === true)}
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
        getService("guidelines/get").then((result) => {
            e.data.userControllers = result.content || []
            setList([...list])
        })
    }
  
    const expandedCity = (e) => {
        setExpandedRows(e.data)
    };
  
    return (
        <ContentWrapper>
          <h2 className="title">Сургалтын төсөв</h2>
  
        <div>
            <Layout className="btn-layout">
                <Content>
                <Row>
        <Col>
          
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
                            <DatePicker onChange={onChange} picker="year" />
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
                    <h3>1. Бичгийн хэрэгсэл</h3>
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
                <Column field="" header="Зардлын нэр"/>
                <Column field="" header="Нэгж үнэ /₮/"/>
                <Column field="" header="Тоо ширхэг"/>
                <Column field="" header="Хүний тоо"/>
                <Column field="" header="Дүн /₮/"/>
            </DataTable>
            {isModalVisible && (
                <AttendanceModal
                    Usercontroller={editRow}
                    isModalVisible={isModalVisible}
                    close={closeModal}
                    isEditMode={isEditMode}
                />
            )}
                        <h3>2. Зам хоног, буудлын зардал</h3>
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
                <Column field="" header="Зардлын нэр"/>
                <Column field="" header="Зардлын төрөл"/>
                <Column field="" header="МЗҮБ хүний тоо"/>
                <Column field="" header="Хоногт /₮/"/>
                <Column field="" header="Хоног"/>
                <Column field="" header="Нийт /₮/"/>

            </DataTable>
            <h3>3. Шатахууны зардал /маршрутаар/</h3>
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
                <Column field="" header="Маршрут"/>
                <Column field="" header="Замын урт /км/"/>
                <Column field="" header="Бүсийн нэмэгдэл /%/"/>
                <Column field="" header="Зарцуулах шатахуун /л/"/>
                <Column field="" header="Шатахууны үнэ /₮/ A92"/>
                <Column field="" header="Нийт /₮/"/>

            </DataTable>
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
  export default Budget;
  
  
  
  
  