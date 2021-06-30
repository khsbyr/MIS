import { ExclamationCircleOutlined, FileOutlined, FileSyncOutlined, FolderAddFilled, PrinterOutlined, SettingFilled } from "@ant-design/icons";
import SaveIcon from "@material-ui/icons/Save";
import { Button, Col, DatePicker, Dropdown, Layout, Menu, message, Modal, Row } from "antd";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from '../../../service/service';
import { errorCatch } from "../../../tools/Tools";
import CriteriaModal from "../../criteria/components/CriteriaModal";
import ContentWrapper from "../../criteria/criteria.style";
import { ColumnGroup } from 'primereact/columngroup';


function handleMenuClick(e) { console.log("click", e.key[0]); }
function onChange(date, dateString) {
    console.log(date, dateString);
}
const { Content } = Layout;
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

var editRow
var isEditMode;
const TestAggregation = () => {
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

    const onInit = () => {
        setLoading(true);
        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }
        getService("casd/get", list)
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
        debugger
        putService("casd/delete/" + selectedRows[0].id)
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
    const [selectedProducts, setSelectedProducts] = useState(null);
    let headerGroup = <ColumnGroup>
    <Row>
        <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }} rowSpan={2}/>
        <Column header="№" rowSpan={2}/>
        <Column header="Оролцогчийн нэр" rowSpan={2} field="name"/> 
        <Column header="Сорил №1" colSpan={2} />
        <Column header="Сорил №2" colSpan={2} />
        <Column header="Өсөлт бууралт" rowSpan={2}/>
        <Column header="Тайлбар" rowSpan={2}/>

    </Row>
    <Row>
        <Column header="Авбал зохих" sortable field="indicatorProcess"/>
        <Column header="Авсан"  sortable/>
        <Column header="Авбал зохих" sortable/>
        <Column header="Авсан"  sortable/>
    </Row>

    </ColumnGroup>;
    return (
        <ContentWrapper>
            <div className="button-demo">
                <Layout className="btn-layout">
                    <Content>
                        <Row>
                            <Col>
                                <h2 className="title">Шалгуур үзүүлэлт</h2>
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
                <div className="datatable-responsive-demo">
                    <DataTable 
                        value={list} 
                        removableSort 
                        paginator 
                        rows={10}
                        headerColumnGroup={headerGroup} 
                        className="p-datatable-responsive-demo"
                        selectionMode="checkbox"
                        selection={selectedRows}
                        onRowClick={edit}
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                        <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column>
                        <Column field="index" sortable/>
                        <Column field="name" style={{ textAlign: "left"}} sortable filter filterPlaceholder="Хайх"/>
                        <Column field="indicatorProcess" sortable />
                        <Column field="upIndicator" sortable />
                        <Column field="name" />
                        <Column field="name" />
                        <Column field="name" />
                        <Column field="name" />
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

export default TestAggregation;
