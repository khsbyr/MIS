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
function handleMenuClick(e) { console.log("click", e.key[0]); }
function onChange(date, dateString) {
    console.log(date, dateString);
}
const { Content } = Layout;
const { Option } = Select;
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
const Attendance = () => {
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
        getService("trainingProgram/get", list)
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
        putService("trainingProgram/delete/" + selectedRows[0].id)
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

    return (
        <ContentWrapper>
            <h2 className="title">Ирцийн бүртгэл</h2>
            <Row >
                <Col xs={24} md={24} lg={8}>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Сургалтын нэр" />
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <DatePicker
                                bordered={false}
                                placeholder="Огноо"
                                suffixIcon={<DownOutlined />}
                                className="DatePicker"
                                style={{
                                    width: "60%",
                                    color: "black",
                                    cursor: "pointer",
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={24} md={24} lg={8}>
                    <Form>
                        <Form.Item>
                            <Select
                                placeholder="Аймаг:"
                                allowClear
                            >
                                <Option value="Ulaanbaatar">Улаанбаатар</Option>
                                <Option value="Arkhangai">Архангай</Option>
                                <Option value="other">other</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select
                                placeholder="Сум:"
                                allowClear
                            >
                                <Option value="Darkhan">Дархан</Option>
                                <Option value="Erdenet">Эрдэнэт</Option>
                                <Option value="other">other</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={24} md={24} lg={4}>
                    <Form>
                        <Form.Item>
                            <InputNumber
                                placeholder="Эр"
                            />
                        </Form.Item>
                        <Form.Item>
                            <InputNumber
                                placeholder="Эм"
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={24} md={24} lg={4}>
                    <Form>
                        <Form.Item>
                            <InputNumber
                                placeholder="Нийт"
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <div className="button-demo">
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
                        className="p-datatable-responsive-demo"
                        selectionMode="checkbox"
                        selection={selectedRows}
                        onRowClick={edit}
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                        <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column>
                        <Column field="index" header="№" style={{ width: "50px" }} />
                        <Column field="" header="Суралцагчийн нэр" />
                        <Column expander style={{ width: '3em' }} />
                        <Column field="" header="Ажил эрхлэлт" />
                        <Column field="" header="Холбогдох утас, мэйл, хаяг" />
                        <Column field="" header="Регистрийн дугаар" />

                    </DataTable>
                    {isModalVisible && (
                        <AttendanceModal
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
export default Attendance;





