import { ExclamationCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { faCalendarAlt, faEnvelope, faHome, faPen, faPhone, faPlus, faTrash, faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Upload } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { isShowLoading } from "../../../../context/Tools";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import CertificateModal from "./CertificateModal";
import ConsSerExperienceModal from "./ConsSerExperienceModa";
import ContentWrapper from "./cv.styled";
import EducationModal from "./EducationModal";
import ExperienceModal from "./ExperienceModal";
import MembershipModal from "./MembershipModal";
import PublishedWorkModal from "./PublishedWorkModal";
import TeacherExperienceModal from "./TeacherExperienceModal";
import AutoCompleteSelect from "../../../../components/Autocomplete";

const { Dragger } = Upload;
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
const layout = {
    labelCol: {
        span: 20,
    },
    wrapperCol: {
        span: 24,
    },
};

var editRow;
export default function CvModal(props) {
    const { Trainerscontroller, isModalVisible, isEditMode } = props;
    const [isModalVisibleEducation, setIsModalVisibleEducation] = useState(false);
    const [isModalVisibleExperience, setIsModalVisibleExperience] = useState(false);
    const [isModalVisibleConsSerExperience, setIsModalVisibleConsSerExperience] = useState(false);
    const [isModalVisibleTeacherExperience, setIsModalVisibleTeacherExperience] = useState(false);
    const [isModalVisiblePublishedWork, setIsModalVisiblePublishedWork] = useState(false);
    const [isModalVisibleCertificate, setIsModalVisibleCertificate] = useState(false);
    const [isModalVisibleMembership, setIsModalVisibleMembership] = useState(false);
    const [form] = Form.useForm();
    const [stateAimag, setStateAimag] = useState([]);
    const [stateSum, setStateSum] = useState([]);
    const [stateCountry, setStateCountry] = useState([]);
    const [stateBag, setStateBag] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    let loadLazyTimeout = null;
    const [list, setList] = useState([]);
    const [listEducation, setListEducation] = useState([]);
    const [lazyParams, setLazyParams] = useState({
        page: 0,
    });
    const [loading, setLoading] = useState(false);
    const PAGESIZE = 20;
    const { RangePicker } = DatePicker;
    useEffect(() => {
        onInit();
        onInitEducation();
        getService("country/get").then((result) => {
            if (result) {
                setStateCountry(result || []);
            }
        });
        getService("aimag/get").then((result) => {
            if (result) {
                setStateAimag(result || []);
            }
        });
        //console.log('asd', Trainerscontroller);
        if(Trainerscontroller!==undefined) {
            getService(`soum/getList/${Trainerscontroller.address.aimag.id}`).then((result) => {
                if (result) {
                    setStateSum(result || []);
                }
            });
            getService(`bag/getList/${Trainerscontroller.address.soum.id}`).then((result) => {
                if (result) {
                    setStateBag(result || []);
                }
            });
        }

        if (isEditMode) {
            form.setFieldsValue({
                ...Trainerscontroller,
                CountryID: Trainerscontroller.address ? Trainerscontroller.address.country.id : '',
                AimagID: Trainerscontroller.address ? Trainerscontroller.address.aimag.id : '',
                SoumID: Trainerscontroller.address ? Trainerscontroller.address.soum.id : '',
                BagID: Trainerscontroller.address ? Trainerscontroller.address.bag.id : '',
            });
        }
    }, [lazyParams])

    const selectCountry = (value) => {
        getAimag(value);
    };

    const getAimag = (countryId) => {
        getService(`aimag/getList/${countryId}`, {}).then((result) => {
            if (result) {
                setStateAimag(result || []);
            }
        });
    };
    const selectAimag = (value) => {
        getSum(value);
    };
    const getSum = (aimagId) => {
        getService(`soum/getList/${aimagId}`, {}).then((result) => {
            if (result) {
                setStateSum(result || []);
            }
        });
    };
    const selectSum = (value) => {
        getBag(value);
    };
    const getBag = (sumID) => {
        getService(`bag/getList/${sumID}`, {}).then((result) => {
            if (result) {
                setStateBag(result || []);
            }
        });
    };

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

    const onInitEducation = () => {
        setLoading(true);
        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }
        getService("education/get", listEducation)
            .then((result) => {
                let listEducation = result.content || [];
                listEducation.map(
                    (item, index) =>
                        (item.index = lazyParams.page * PAGESIZE + index + 1)
                );
                setListEducation(listEducation);
                setSelectedRows([]);

            })
            .catch((error) => {
                errorCatch(error);
                isShowLoading(false);
            })
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
        editRow = row.data
        isEditMode = true
        setIsModalVisibleEducation(true)
    }


    const add = () => {
        setIsModalVisibleEducation(true);
        isEditMode = false;
    };

    const closeModal = (isSuccess = false) => {
        setIsModalVisibleEducation(false);
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

    const actionExperience = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => editExperience(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => popExperience(row)} />
            </React.Fragment>
        );
    }

    const editExperience = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisibleExperience(true)
    }

    const addExperience = () => {
        setIsModalVisibleExperience(true);
        isEditMode = false;
    };

    const closeModalExperience = (isSuccess = false) => {
        setIsModalVisibleExperience(false);
        if (isSuccess) onInit();
    };

    const popExperience = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };

    const actionConsSerExperience = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => editConsSerExperience(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => popConsSerExperience(row)} />
            </React.Fragment>
        );
    }

    const editConsSerExperience = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisibleConsSerExperience(true)
    }

    const addConsSerExperience = () => {
        setIsModalVisibleConsSerExperience(true);
        isEditMode = false;
    };

    const closeModalConsSerExperience = (isSuccess = false) => {
        setIsModalVisibleConsSerExperience(false);
        if (isSuccess) onInit();
    };

    const popConsSerExperience = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };

    const actionTeacherExperience = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => editTeacherExperience(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => popTeacherExperience(row)} />
            </React.Fragment>
        );
    }

    const editTeacherExperience = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisibleTeacherExperience(true)
    }

    const addTeacherExperience = () => {
        setIsModalVisibleTeacherExperience(true);
        isEditMode = false;
    };

    const closeModalTeacherExperience = (isSuccess = false) => {
        setIsModalVisibleTeacherExperience(false);
        if (isSuccess) onInit();
    };

    const popTeacherExperience = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };

    const actionPublishedWork = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => editPublishedWork(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => popPublishedWork(row)} />
            </React.Fragment>
        );
    }

    const editPublishedWork = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisiblePublishedWork(true)
    }

    const addPublishedWork = () => {
        setIsModalVisiblePublishedWork(true);
        isEditMode = false;
    };

    const closeModalPublishedWork = (isSuccess = false) => {
        setIsModalVisiblePublishedWork(false);
        if (isSuccess) onInit();
    };

    const popPublishedWork = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };

    const actionCertificate = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => editCertificate(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => popCertificate(row)} />
            </React.Fragment>
        );
    }

    const editCertificate = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisibleCertificate(true)
    }

    const addCertificate = () => {
        setIsModalVisibleCertificate(true);
        isEditMode = false;
    };

    const closeModalCertificate = (isSuccess = false) => {
        setIsModalVisibleCertificate(false);
        if (isSuccess) onInit();
    };

    const popCertificate = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };

    const actionMembership = (row) => {
        return (
            <React.Fragment>
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => editMembership(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => popMembership(row)} />
            </React.Fragment>
        );
    }

    const editMembership = (row) => {
        editRow = row.data
        isEditMode = true
        setIsModalVisibleMembership(true)
    }

    const addMembership = () => {
        setIsModalVisibleMembership(true);
        isEditMode = false;
    };

    const closeModalMembership = (isSuccess = false) => {
        setIsModalVisibleMembership(false);
        if (isSuccess) onInit();
    };

    const popMembership = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm();
        }
    };



    const handleDeleted = () => {
        if (selectedRows.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        }
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
                values.address = {
                    country: {
                        id: values.CountryID,
                    },
                    aimag: {
                        id: values.AimagID,
                    },
                    soum: {
                        id: values.SoumID,
                    },
                    bag: {
                        id: values.BagID,
                    }
                };
                if (isEditMode) {
                    putService(
                        "trainers/update/" + Trainerscontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("trainers/post", values)
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
                <ContentWrapper>
                    <Form
                        form={form}
                        labelAlign={"left"}
                        {...layout}
                        layout="vertical"
                        name="nest-messages"
                        validateMessages={validateMessages}
                    >
                        <h2 className="title">1. Хувь хүний мэдээлэл</h2>
                        <Row gutter={[30, 30]}>

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
                                <Form.Item name="lastName">
                                    <Input className="FormItem" placeholder="Овог:" prefix={<FontAwesomeIcon icon={faUser} />} />
                                </Form.Item>

                                <Form.Item name="firstName">
                                    <Input className="FormItem" placeholder="Нэр:" prefix={<FontAwesomeIcon icon={faUser} />} />
                                </Form.Item>

                                <Form.Item name="birthDate">
                                    <Input className="FormItem" placeholder="Төрсөн огноо:" prefix={<FontAwesomeIcon icon={faCalendarAlt} />} />
                                </Form.Item>

                                <Form.Item name="registerNumber">
                                    <Input className="FormItem" placeholder="Регистрийн дугаар:" prefix={<FontAwesomeIcon icon={faUserEdit} />} />
                                </Form.Item>
                                <Form.Item name="phoneNumber">
                                    <Input className="FormItem" placeholder="Утас, факс:" prefix={<FontAwesomeIcon icon={faPhone} />} />
                                </Form.Item>

                            </Col>

                            <Col xs={24} md={24} lg={9}>

                                <Form.Item name="email">
                                    <Input className="FormItem" placeholder="И-мэйл хаяг:" prefix={<FontAwesomeIcon icon={faEnvelope} />} />
                                </Form.Item>
                                <Form.Item name="CountryID">
                                    <AutoCompleteSelect
                                        className="FormItem"
                                        placeholder="Улс сонгох"
                                        valueField="id"
                                        data={stateCountry}
                                        onChange={(value) => selectCountry(value)}
                                    />
                                </Form.Item>
                                <Form.Item name="AimagID">
                                    <AutoCompleteSelect
                                        className="FormItem"
                                        placeholder="Аймаг, хот сонгох"
                                        valueField="id"
                                        data={stateAimag}
                                        onChange={(value) => selectAimag(value)}
                                    />
                                </Form.Item>
                                <Form.Item name="SoumID">
                                    <AutoCompleteSelect
                                        className="FormItem"
                                        placeholder="Сум, дүүрэг сонгох"
                                        valueField="id"
                                        data={stateSum}
                                        onChange={(value) => selectSum(value)}
                                    />
                                </Form.Item>
                                <Form.Item name="BagID">
                                    <AutoCompleteSelect
                                        className="FormItem"
                                        placeholder="Баг, хороо сонгох"
                                        valueField="id"
                                        data={stateBag}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <h2 className="title">2. Ажлын зорилго</h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                <Form.Item name="purpose">
                                    <Input.TextArea
                                        placeholder="(Горилж буй ажлын зорилгоо товч бичнэ үү)"
                                        style={{
                                            width: "100%",
                                            height: "110px",
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <h2 className="title">
                            3. Боловсрол {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={add} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                <DataTable
                                    value={listEducation}
                                    removableSort
                                    paginator
                                    rows={10}
                                    className="p-datatable-responsive-demo"
                                    selection={selectedRows}
                                    // onRowClick={edit}
                                    onSelectionChange={(e) => {
                                        setSelectedRows(e.value);
                                    }}
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="degree" header="Зэрэг, цол" />
                                    <Column field="universityName" header="Их дээд сургуулийн нэр" />
                                    <Column field="graduatedDate" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={action}></Column>
                                </DataTable>
                                {isModalVisibleEducation && (
                                    <EducationModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisibleEducation}
                                        close={closeModal}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        <h2 className="title">
                            4. Ажлын туршлага {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={addExperience} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="name" header="Албан тушаал" />
                                    <Column field="" header="Байгууллагын нэр" />
                                    <Column field="" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={actionExperience}></Column>
                                </DataTable>
                                {isModalVisibleExperience && (
                                    <ExperienceModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisibleExperience}
                                        close={closeModalExperience}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        <h2 className="title">
                            5. Зөвлөх үйлчилгээний ажлын туршлага {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={addConsSerExperience} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="name" header="Албан тушаал" />
                                    <Column field="" header="Байгууллагын нэр" />
                                    <Column field="" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={actionConsSerExperience}></Column>
                                </DataTable>
                                {isModalVisibleConsSerExperience && (
                                    <ConsSerExperienceModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisibleConsSerExperience}
                                        close={closeModalConsSerExperience}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        <h2 className="title">
                            6. Багшийн ажлын туршлага {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={addTeacherExperience} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="name" header="Албан тушаал" />
                                    <Column field="" header="Байгууллагын нэр" />
                                    <Column field="" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={actionTeacherExperience}></Column>
                                </DataTable>
                                {isModalVisibleTeacherExperience && (
                                    <TeacherExperienceModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisibleTeacherExperience}
                                        close={closeModalTeacherExperience}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        <h2 className="title">
                            7. Хэвлүүлсэн бүтээл (Эрдэм шинжилгээ, судалгааны бүтээл, ном гарын авлага, хэлэлцүүлсэн илтгэлүүд ) {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={addPublishedWork} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="" header="Бүтээлийн нэр" />
                                    <Column field="" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={actionPublishedWork}></Column>
                                </DataTable>
                                {isModalVisiblePublishedWork && (
                                    <PublishedWorkModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisiblePublishedWork}
                                        close={closeModalPublishedWork}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>


                        <h2 className="title">
                            8. Өөрийн нэр дээр бүртгэлтэй оюуны өмч, гэрчилгээ, лиценз, тусгай зөвшөөрөл   {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={addCertificate} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="name" header="Албан тушаал" />
                                    <Column field="" header="Байгууллагын нэр" />
                                    <Column field="" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={actionCertificate}></Column>
                                </DataTable>
                                {isModalVisibleCertificate && (
                                    <CertificateModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisibleCertificate}
                                        close={closeModalCertificate}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        <h2 className="title">
                            9. Гишүүнчлэл (Олон нийтийн болон төрийн бус байгууллагын гишүүн эсэх)   {" "}
                            <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={addMembership} style={{ float: "right" }}>
                                Нэмэх
                            </Button>
                        </h2>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
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
                                    dataKey="id"
                                >
                                    <Column field="index" header="№" style={{ width: "50px" }} />
                                    <Column field="name" header="Албан тушаал" />
                                    <Column field="" header="Байгууллагын нэр" />
                                    <Column field="" header="Огноо" />
                                    <Column headerStyle={{ width: '7rem' }} body={actionMembership}></Column>
                                </DataTable>
                                {isModalVisibleMembership && (
                                    <MembershipModal
                                        Criteriacontroller={editRow}
                                        isModalVisible={isModalVisibleMembership}
                                        close={closeModalMembership}
                                        isEditMode={isEditMode}
                                    />
                                )}
                            </Col>
                        </Row>

                        <h2 className="title">10. Ур чадвар</h2>
                        <Row >
                            <Col xs={24} md={24} lg={24}>
                                <Form.Item name="skill">
                                    <Input.TextArea
                                        placeholder="(Өөрийн давуу тал, ур чадвараа нэрлэнэ үү)"
                                        style={{
                                            width: "100%",
                                            height: "140px"
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </ContentWrapper>
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

