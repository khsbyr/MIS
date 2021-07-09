import { DownOutlined, ExclamationCircleOutlined, FileOutlined, PrinterOutlined } from "@ant-design/icons";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, Menu, message, Modal, Row } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
import OrganizationModal from "./components/OrganizationModal";
import ContentWrapper from "../../criteria/criteria.style";

function onChange(date, dateString) {
    console.log(date, dateString);
}
const { Content } = Layout;

var editRow
var isEditMode;
const Organization = () => {

    let loadLazyTimeout = null;
    const [list, setList] = useState([]);
    const [listBank, setListBank] = useState([]);
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
        getService("organization/get", list)
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
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => edit(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => pop(row)} />
            </React.Fragment>
        );
    }

    const edit = (row) => {
        console.log(row)
        editRow = row
        isEditMode = true
        setIsModalVisible(true)

    }

    const handleDeleted = (row) => {
        if (row.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        }
        debugger
        putService("organization/delete/" + row.id)
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
    const pop = (row) => {
        if (row.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm(row);
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

    const nameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Байгууллагын нэр</span>
                {row.name}
            </React.Fragment>
        );
    }

    const registerNumberBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Регистрийн дугаар</span>
                {row.registerNumber}
            </React.Fragment>
        );
    }

    const bankNameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Банкны нэр</span>
                {row.bank.name}
            </React.Fragment>
        );
    }

    const accountNameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Дансны нэр</span>
                {row.accountName}
            </React.Fragment>
        );
    }

    const accountNumberBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Дансны дугаар</span>
                {row.accountNumber}
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
                                <p className="title">Зөвлөх байгууллага</p>
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
                        selection={selectedRows}
                        // onRowClick={edit}
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                            <Column  header="№"  body={indexBodyTemplate}/>
                            <Column  header="Байгууллагын нэр"  body={nameBodyTemplate} filter sortable />
                            <Column  header="Регистрийн дугаар"  body={registerNumberBodyTemplate}/>
                            <Column  header="Банкны нэр" body={bankNameBodyTemplate}/>
                            <Column  header="Дансны нэр" body={accountNameBodyTemplate} />
                            <Column  header="Дансны дугаар" body={accountNumberBodyTemplate}/>
                            <Column  headerStyle={{ width: '7rem' }} body={action}></Column>
                    </DataTable>
                    {isModalVisible && (
                        <OrganizationModal
                            Orgcontroller={editRow}
                            isModalVisible={isModalVisible}
                            close={closeModal}
                            isEditMode={isEditMode}
                        />
                    )}
                </div>
            </div>
        </ContentWrapper>
    );
    function confirm(row) {
        Modal.confirm({
            title: "Та устгахдаа итгэлтэй байна уу ?",
            icon: <ExclamationCircleOutlined />,
            okButtonProps: {},
            okText: "Устгах",
            cancelText: "Буцах",
            onOk() {
                handleDeleted(row);
                onInit();
            },
            onCancel() { },
        });
    }
}

export default Organization;




