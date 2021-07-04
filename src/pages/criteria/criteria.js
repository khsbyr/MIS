import {
    ExclamationCircleOutlined, FileOutlined, FileSyncOutlined, DownOutlined, PrinterOutlined, CopyOutlined, SearchOutlined
} from "@ant-design/icons";
import SaveIcon from "@material-ui/icons/Save";
import { Button, Col, Dropdown, Form, Layout, Menu, message, Modal, Row, DatePicker, Input } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Loader from "../../loader/Loader";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { isShowLoading } from "../../context/Tools";
import { getService, putService } from "../../service/service";
import { PAGESIZE } from "../../tools/Constant";
import { errorCatch, convertLazyParamsToObj } from "../../tools/Tools";
import CriteriaModal from "../criteria/components/CriteriaModal";
import "./criteria.style"
import ContentWrapper from "./criteria.style";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
function handleMenuClick(e) { console.log("click", e.key[0]); }
function onChange(date, dateString) {
    console.log(date, dateString);
}
const { Content } = Layout;
const onSearch = value => console.log(value);

const menu = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item
            key="1"
            icon={ <FontAwesomeIcon icon={faPrint} />}
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

var editRow
var isEditMode;
const Criteria = () => {
    const [products, setProducts] = useState([]);
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

    // const actionBodyTemplate = (row) => {
    //     return (
    //         <React.Fragment>
    //             <Button type="text" icon={ <FontAwesomeIcon icon={faPen}/>} onClick={edit} />
    //             <Button type="text" icon={ <FontAwesomeIcon icon={faTrash}/>} onClick={pop} />
    //         </React.Fragment>
    //     );
    // }

    const onInit = () => {
        setLoading(true);
        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }
        getService("criteria/get", list)
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

    // const action = () => {
    //     return (   
    //         <React.Fragment>
    //             <Button type="text" icon={ <FontAwesomeIcon icon={faPen}/>} onClick={edit} />
    //             <Button type="text" icon={ <FontAwesomeIcon icon={faTrash}/>} onClick={pop} />
    //         </React.Fragment>
    //     );
    // }

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
        debugger
        putService("criteria/delete/" + selectedRows[0].id)
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
    return (
        <ContentWrapper>
            <div className="button-demo">
            <Layout className="btn-layout">
                    <Content>
                        <Row>
                            <Col xs={24} md={24} lg={14}>
                                <p className="title">Сургалтын хөтөлбөр</p>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <Row gutter={[0, 15]}>
                                    <Col xs={8} md={8} lg={5}>
                                        <DatePicker
                                            onChange={onChange}
                                            bordered={false}
                                            suffixIcon={<DownOutlined />}
                                            placeholder="Select year"
                                            picker="year"
                                            className="DatePicker"
                                            style={{
                                                width: "120px",
                                                color: "black",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </Col>
                                    {/* <Col xs={8} md={8} lg={6}>
                                        <Input
                                            placeholder="Хайлт хийх"
                                            allowClear
                                            prefix={<SearchOutlined />}
                                            bordered={false}
                                            onSearch={onSearch}
                                            style={{
                                                width: 150,
                                                borderBottom: "1px solid #103154",
                                            }}
                                        />
                                    </Col> */}
                                    <Col xs={8} md={8} lg={5}>
                                        <Button type="text" icon={ <FontAwesomeIcon icon={faPrint}/>} >Хэвлэх </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={5}>
                                        <Button type="text" className="export" icon={ <FontAwesomeIcon icon={faFileExcel}/>} >
                                            Экспорт
                                        </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={5}>
                                        <Button type="text" className="export" icon={ <FontAwesomeIcon icon={faPlus}/>} onClick={add}>
                                            Нэмэх
                                        </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={4}>
                                        <Button type="text" className="export" icon={ <FontAwesomeIcon icon={faTrash}/>} onClick={pop}>
                                            Устгах
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
                        selectionMode="checkbox"
                        selection={selectedRows}
                        onRowClick={edit}
                        // editMode="row"
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                        <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column>
                        <Column field="index" header="№" sortable bodyStyle={{ textAlign: 'center' }}/>
                        <Column field="code" header="Код" sortable bodyStyle={{ textAlign: 'center' }}/>
                        <Column field="name" header="Шалгуур үзүүлэлтийн нэр"  style={{ textAlign: "left" }} sortable filter filterPlaceholder="Хайх" />
                        <Column field="indicatorProcess" header="Хүрэх үр дүн" sortable  bodyStyle={{ textAlign: 'center' }} filter filterPlaceholder="Хайх" />
                        <Column field="upIndicator" header="Үр дүнгийн биелэлт" sortable  bodyStyle={{ textAlign: 'center' }}/>
                        <Column field="" header="Шалгуур үзүүлэлтийн төрөл" sortable bodyStyle={{ textAlign: 'center' }}/>
                        {/* <Column headerStyle={{ width: '7rem' }} body={action}></Column> */}
                    </DataTable>
                    {isModalVisible && (
                        <CriteriaModal
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

export default Criteria;
