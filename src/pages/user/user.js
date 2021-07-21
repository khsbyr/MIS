import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Layout,
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

var editRow
var isEditMode;
const User = () => {

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
                console.log(list);
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
        editRow = row
        isEditMode = true
        setIsModalVisible(true)
        
    }

    const handleDeleted = (row) => {
        console.log(row)
        if (row.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        }
        putService("user/delete/" + row.id)
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

    const firstnameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Нэр</span>
                {row.firstname}
            </React.Fragment>
        );
    }

    const lastnameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Овог</span>
                {row.lastname}
            </React.Fragment>
        );
    }

    const registerBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Регистрийн дугаар</span>
                {row.register}
            </React.Fragment>
        );
    }
    const emailBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Й-мэйл</span>
                {row.email}
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
                                <p className="title">Хэрэглэгчийн жагсаалт</p>
                            </Col>
                            <Col xs={16} md={16} lg={10}>
                                <Row justify="end" gutter={[16, 16]}>
                                    <Col xs={8} md={4} lg={4}>
                                        <Button type="text" icon={<FontAwesomeIcon icon={faPrint} />} >Хэвлэх </Button>
                                    </Col>
                                    <Col xs={8} md={4} lg={4}>
                                        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faFileExcel} />} >
                                            Экспорт
                                        </Button>
                                    </Col>
                                    <Col xs={8} md={4} lg={8}>
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
                        editMode="row"
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                        <Column field="index" header="№" body={indexBodyTemplate} sortable/>
                        <Column field="firstname" header="Нэр" body={firstnameBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column field="lastname" header="Овог" body={lastnameBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column field="register" header="Регистрийн дугаар" body={registerBodyTemplate} sortable/>
                        <Column field="email" header="Й-мэйл" body={emailBodyTemplate} sortable/>
                        <Column field='role.name' header="Эрх" sortable />
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

export default User;
