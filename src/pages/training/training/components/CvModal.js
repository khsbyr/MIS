import React, { useEffect, useState } from "react";
import { Modal, Form, Input , Table, Button, DatePicker, message, Dropdown, Menu} from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined , UserOutlined } from "@ant-design/icons";
import { faCalendarAlt, faEnvelope, faHome, faPhone, faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Select, Option,Upload } from "antd";
import AutocompleteSelect from "../../../components/Autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import SaveIcon from "@material-ui/icons/Save";
import { isShowLoading } from "../../../../context/Tools";

import {
    ExclamationCircleOutlined, FileOutlined, FileSyncOutlined, FolderAddFilled, PrinterOutlined, SettingFilled
} from "@ant-design/icons";
import EducationModal from "./EducationModal";
import WorkExperienceModal from "./WorkExperienceModal";
function handleMenuClick(e) { console.log("click", e.key[0]); }
function onChange(date, dateString) {
    console.log(date, dateString);
}

const { Dragger } = Upload;
const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};
const validateMessages = {
    required: "${label} хоосон байна!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};

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

var editRow;
var editBolovsrolRow;
var isEditMode;
export default function CvModal(props) {
    const { Usercontroller, isModalVisible } = props;
    const [isModalVisiblee, setIsModalVisiblee] = useState(false);
    const [isModalVisibleee, setIsModalVisibleee] = useState(false);

    const [stateController, setStateController] = useState([]);
    const [form] = Form.useForm();
    const { Option } = Select;
    const [selectedRows, setSelectedRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [multiSortMeta, setMultiSortMeta] = useState([{ field: 'category', order: -1 }]);
    let loadLazyTimeout = null;
    const [list, setList] = useState([]);
    const [lazyParams, setLazyParams] = useState({
        page: 0,
    });
    const [loading, setLoading] = useState(false);
    const PAGESIZE = 20;
    const { RangePicker } = DatePicker;
    // useEffect(() => {
    //     getService("criteria/get", {
    //         search: "status:true",
    //     }).then((result) => {
    //         if (result) {
    //             setStateController(result.content || []);
    //         }
    //     });

    //     if (isEditMode) {
    //         getService("criteria/get" + Usercontroller.id).then((result) => {
    //             Usercontroller.userServiceId = result.userService.id
    //             form.setFieldsValue({ ...Usercontroller });
    //         })

    //     }
    // }, []);

    useEffect(() => {
        onInit();
    }, [lazyParams])

    const onInit = () => {
        setLoading(true);
        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }
        getService("criteriaa/get", list)
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

    const edit = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisiblee(true)
    }

    
    const add = () => {
        setIsModalVisiblee(true);
        isEditMode = false;
    };

    const pop = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };

    

    const closeModal = (isSuccess = false) => {
        setIsModalVisiblee(false);
        if (isSuccess) onInit();
    };

    const handleDeleted = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        }
        debugger
        putService("criteriaa/delete/" + selectedRows[0].id)
            .then((result) => {
                message.success("Амжилттай устлаа");
                onInit();
            })
            .catch((error) => {
                errorCatch(error);
            });
    };

    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.userService = { id: values.userServiceId }
                if (isEditMode) {
                    putService(
                        "criteriaa/put" + Usercontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("criteriaa/post", values)
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        });
                }
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };
    return (
        <div>
            <Modal
                title="Сургагч багшийн CV бүртгэх"
                okText="Хадгалах"
                cancelText="Буцах"
                width={1200}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            >
          <h2 className="title">1. Хувь хүний мэдээлэл</h2>
            <Row gutter={[30,30]}>
                
                <Col xs={24} md={24} lg={4}>
                    <Dragger {...props} style={{}}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-hint">
                        Зураг оруулах
                        </p>
                    </Dragger>            
                </Col>
                <Col xs={24} md={24} lg={2}>
                </Col>
                <Col xs={24} md={24} lg={9}>
                    <Form>
                        <Form.Item>                   
                            <Input className="FormItem" placeholder="Овог, нэр:" prefix={<FontAwesomeIcon icon={faUser}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Төрсөн огноо:" prefix={<FontAwesomeIcon icon={faCalendarAlt}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem"placeholder="Регистрийн дугаар:" prefix={<FontAwesomeIcon icon={faUserEdit}/>}/>
                        </Form.Item>
                    </Form>
                </Col>

                <Col xs={24} md={24} lg={9}>
                <Form>
                    <Form.Item>
                            <Input className="FormItem"placeholder="Хаяг:" prefix={<FontAwesomeIcon icon={faHome}/>}/>
                    </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Утас, факс:" prefix={<FontAwesomeIcon icon={faPhone}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="И-мэйл хаяг:" prefix={<FontAwesomeIcon icon={faEnvelope}/>}/>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <h2 className="title">2. Ажлын зорилго</h2>
            <Row>
                <Col xs={24} md={24} lg={22}>
                    <Form layout="vertical">
                        <Form.Item> 
                            <Input.TextArea 
                                placeholder="(Горилж буй ажлын зорилгоо товч бичнэ үү)"
                                style={{
                                    width: "100%",
                                    height: "110px",                                  
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <h2 className="title">3. Боловсрол</h2>
            
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
            <Row >
                <Col xs={24} md={24} lg={22}>
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
                            <Column field="name" header="Зэрэг, цол" />
                            <Column field="" header="Их дээд сургуулийн нэр" />
                            <Column field="" header="Огноо" />
                        </DataTable>
                        {isModalVisiblee && (
                        <EducationModal
                            Criteriacontroller={editRow}
                            isModalVisible={isModalVisible}
                            close={closeModal}
                            isEditMode={isEditMode}
                        />
                    )}
                </Col>
            </Row>

            <h2 className="title">4. Ажлын туршлага</h2>
            
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
            <Row >
                <Col xs={24} md={24} lg={22}>
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
                            <Column field="name" header="Албан тушаал" />
                            <Column field="" header="Байгууллагын нэр" />
                            <Column field="" header="Огноо" />
                        </DataTable>
                        {isModalVisiblee && (
                        <WorkExperienceModal
                            Criteriacontroller={editRow}
                            isModalVisible={isModalVisiblee}
                            close={closeModal}
                            isEditMode={isEditMode}
                        />
                    )}
                </Col>
            </Row>

        
            <h2 className="title">10. Ур чадвар</h2>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Input.TextArea 
                        placeholder="(Өөрийн давуу тал, ур чадвараа нэрлэнэ үү)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} lg={22}>
                    <Form.Item style={{marginTop: "20px"}}>
                        <Button type="primary" htmlType="submit" className="button">
                        Хадгалах
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            </Modal>
        </div >
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
