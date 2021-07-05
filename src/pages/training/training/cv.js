import { DownOutlined, ExclamationCircleOutlined, FileOutlined, PrinterOutlined } from "@ant-design/icons";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import SaveIcon from "@material-ui/icons/Save";
import { Button, Col, Dropdown, Form, Layout, Menu, message, Modal, Row, DatePicker } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from "../../../service/service";
import { PAGESIZE } from "../../../tools/Constant";
import { errorCatch } from "../../../tools/Tools";
import CvModal from "../training/components/CvModal";
import ContentWrapper from "../../criteria/criteria.style";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function onChange(date, dateString) {
    console.log(date, dateString);
}
const { Content } = Layout;

var editRow
var isEditMode;
const CV = () => {

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
        getService("trainers/get", list)
            .then((result) => {
                let list = result.content || [];
                list.map(
                    (item, index) =>
                        (item.index = lazyParams.page * PAGESIZE + index + 1)
                );
                setList(list);
                setSelectedRows([]);

            })
            .catch((error) => {
                errorCatch(error);
                isShowLoading(false);
            })
    };

    const add = () => {
        setIsModalVisible(true);
        isEditMode = false;
    };

    const action = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={edit} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={pop} />
            </React.Fragment>
        );
    }

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
        putService("trainers/delete/" + selectedRows[0].id)
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

    const indexBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">№</span>
                {row.index}
            </React.Fragment>
        );
    }

    const trainingnameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Хичээлийн сэдэв</span>
                {row.trainerFor}
            </React.Fragment>
        );
    }

    const teacherBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Сургагч багшийн нэр</span>
                {row.registerNumber}
            </React.Fragment>
        );
    }

    return (
        <ContentWrapper>
            <div className="button-demo">
                <Layout className="btn-layout">
                    <Content>
                        <Row>
                            <Col xs={24} md={24} lg={14}>
                                <p className="title">Сургалтын төлөвлөгөө</p>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <Row gutter={[0, 15]}>
                                    <Col xs={8} md={8} lg={6}>
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
                                    <Col xs={8} md={8} lg={6}>
                                        <Button type="text" icon={<FontAwesomeIcon icon={faPrint} />} >Хэвлэх </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={6}>
                                        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faFileExcel} />} >
                                            Экспорт
                                        </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={6}>
                                        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={add}>
                                            Нэмэх
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
                        // selectionMode="checkbox"
                        selection={selectedRows}
                        // onRowClick={edit}
                        // editMode="row"
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column> */}
                        <Column field="index" header="№" body={indexBodyTemplate} sortable />
                        <Column field="trainerFor" header="Сургагч багш" body={trainingnameBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column field="registerNumber" header="Сургагч багшийн регистер" body={teacherBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column headerStyle={{ width: '7rem' }} body={action}></Column>
                    </DataTable>
                    {isModalVisible && (
                        <CvModal
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

export default CV;



