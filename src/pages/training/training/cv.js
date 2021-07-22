import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, message, Modal, Row } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import AutoCompleteSelect from "../../../components/Autocomplete";
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
import ContentWrapper from "../../criteria/criteria.style";
import CvModal from "../training/components/CvModal";
import OrgaStyle from "./components/orga.style";



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
    const [stateOrg, setStateOrg] = useState([]);
    const [OrgID, setOrgID] = useState([]);

    const selectOrgs = (value) => {
        getGuidelines(value);
      };

    const getGuidelines = (orgId) => {
    getService(`trainers/getList/${orgId}`, {}).then((result) => {
        if (result) {
        let list = result || [];
        list.map((item, index) => (item.index = index + 1));
        setList(list);
        setOrgID(orgId);
        setSelectedRows([]);
        }
    });
    };

    useEffect(() => {
        onInit();
        getService("organization/get").then((result) => {
            if (result) {
              setStateOrg(result.content || []);
            }
          });
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
                <Button type="text" icon={<FontAwesomeIcon icon={faPen} />}  onClick={() => edit(row)} />
                <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />}  onClick={() => pop(row)} />
            </React.Fragment>
        );
    }

    const edit = (row) => {
        editRow = row
        isEditMode = true
        setIsModalVisible(true)
        
    }

    const handleDeleted = (row) => {
        if (row.length === 0) {
          message.warning("Устгах өгөгдлөө сонгоно уу");
          return;
        }
        putService("trainers/delete/" + row.id)
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

    const FirstNameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Нэр</span>
                {row.firstName}
            </React.Fragment>
        );
    }

    const LastNameBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Овог</span>
                {row.lastName}
            </React.Fragment>
        );
    }

    const phoneBodyTemplate = (row) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Утас</span>
                {row.phoneNumber}
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
                                <p className="title">Сургагч багшийн CV</p>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <Row justify="end" gutter={[16, 16]}>
                                    <Col xs={8} md={8} lg={4}>
                                        <OrgaStyle>
                                        <AutoCompleteSelect
                                            valueField="id"
                                            placeholder="Байгууллага сонгох"
                                            data={stateOrg}
                                            onChange={(value) => selectOrgs(value)}                                           
                                        />
                                        </OrgaStyle>
                                    </Col>
                                    <Col xs={8} md={8} lg={4}>
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
                                    <Col xs={8} md={8} lg={4}>
                                        <Button type="text" icon={<FontAwesomeIcon icon={faPrint} />} >Хэвлэх </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={4}>
                                        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faFileExcel} />} >
                                            Экспорт
                                        </Button>
                                    </Col>
                                    <Col xs={8} md={8} lg={8}>
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
                        onSelectionChange={(e) => {
                            setSelectedRows(e.value);
                        }}
                        dataKey="id">
                        <Column field="index" header="№" body={indexBodyTemplate} sortable />
                        <Column header="Нэр" body={FirstNameBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column header="Овог" body={LastNameBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column header="Утас" body={phoneBodyTemplate} sortable filter filterPlaceholder="Хайх"/>
                        <Column field="registerNumber" header="Сургагч багшийн регистер" sortable filter filterPlaceholder="Хайх"/>
                        <Column headerStyle={{ width: '7rem' }} body={action}></Column>
                    </DataTable>
                    {isModalVisible && (
                        <CvModal
                            Trainerscontroller={editRow}
                            isModalVisible={isModalVisible}
                            close={closeModal}
                            isEditMode={isEditMode}
                            orgId = {OrgID}
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

export default CV;



