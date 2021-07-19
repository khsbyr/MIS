import { ExclamationCircleOutlined } from "@ant-design/icons";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row } from "antd";
import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import AutoCompleteSelect from "../../../../components/Autocomplete";
import { isShowLoading } from "../../../../context/Tools";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./guidelines.style";
import ParticipantsModal from "./ParticipantsModal"

const layout = {
    labelCol: {
        span: 20,
    },
    wrapperCol: {
        span: 22,
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
var editRow
var isEditModeParticipants;
export default function GuidelinesModal(props)  {
    const { Guidelinescontroller, isModalVisible, isEditMode } = props;
    const [isModalVisibleParticipants, setIsModalVisibleParticipants] = useState(false);
    const [stateAimag, setStateAimag] = useState([]);
    const [stateSum, setStateSum] = useState([]);
    const [stateCountry, setStateCountry] = useState([]);
    const [stateBag, setStateBag] = useState([]);
    const [stateParticipants, setStateParticipants] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [list, setList] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const PAGESIZE = 20;
    const [lazyParams, setLazyParams] = useState({
        page: 0,
      });
    let loadLazyTimeout = null;
    const FORMAT = "YYY/MM/DD"
    const { RangePicker } = DatePicker;

    function DateOnChange(date, dateString) {
        console.log(date, dateString);
    }

    useEffect(() => {
        onInit();
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
        getService(`soum/getList/${Guidelinescontroller.address.aimag.id}`).then((result) => {
            if (result) {
              setStateSum(result || []);
            }
          });
          getService(`bag/getList/${Guidelinescontroller.address.soum.id}`).then((result) => {
            if (result) {
              setStateBag(result || []);
            }
          });
        if (isEditMode) {
            form.setFieldsValue({
                ...Guidelinescontroller,
                CountryID : Guidelinescontroller.address.country.id,
                AimagID : Guidelinescontroller.address.aimag.id,
                SoumID : Guidelinescontroller.address.soum.id,
                BagID : Guidelinescontroller.address.bag.id,
                AddressDetail: Guidelinescontroller.address.addressDetail,
                StartDate: Guidelinescontroller.startDate,
            });
        }
    }, []);

    const onInit = () => {
        setLoading(true);
        if (loadLazyTimeout) {
          clearTimeout(loadLazyTimeout);
        }
        getService("participants/getList/1", list)
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
        isEditModeParticipants = true
        setIsModalVisibleParticipants(true)
    }

    const pop = (row) => {
        if (row.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        } else {
            confirm(row);
        }
    };

    const add = () => {
        setIsModalVisibleParticipants(true);
        isEditModeParticipants = false;
      };

    const closeModal = (isSuccess = false) => {
        setIsModalVisibleParticipants(false);
        if (isSuccess) onInit();
    };

    const handleDeleted = (row) => {
        if (row.length === 0) {
            message.warning("Устгах өгөгдлөө сонгоно уу");
            return;
        }
        
        putService("participants/delete/" + row.id)
            .then((result) => {
                message.success("Амжилттай устлаа");
                onInit();
            })
            .catch((error) => {
                errorCatch(error);
            });
    };

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

    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.address = {
                    addressDetail: values.AddressDetail,
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
                        "trainingGuidelines/update/" + Guidelinescontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("trainingGuidelines/post", values)
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
                title="Сургалтын удирдамж бүртгэх"
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
                        <Row >
                            <Col xs={24} md={24} lg={12}>
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Сургалтын сэдэв:" name="subject" rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Сургалт зохион байгуулах үндэслэл:" name="reason" rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Сургалтын зорилго:" name="aim" rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Хэрэгжүүлэх үйл ажиллагаа:" name="operation" rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Хүлээгдэж буй үр дүн:" name="result" rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>

                                    <Col xs={24} md={24} lg={24}>
                                        <p style={{ color: "#7d7d7d", fontSize: "13px" }}>Сургалт зохион байгуулагдах газар:</p>
                                    </Col>
                                </Row>
                                <Row style={{ maxWidth: "95%" }}>
                                    <Col xs={24} md={24} lg={12} >
                                        <Form.Item label="Улс:" name="CountryID" >
                                            <AutoCompleteSelect
                                                valueField="id"
                                                data={stateCountry}
                                                onChange={(value) => selectCountry(value)}
                                            />

                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <Form.Item label="Аймаг, хот:" name="AimagID">
                                            <AutoCompleteSelect
                                                valueField="id"
                                                data={stateAimag}
                                                onChange={(value) => selectAimag(value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <Form.Item name="SoumID" layout="vertical" label="Сум, Дүүрэг:">
                                            <AutoCompleteSelect
                                                valueField="id"
                                                data={stateSum}
                                                onChange={(value) => selectSum(value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                                            <AutoCompleteSelect valueField="id" data={stateBag} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Хаяг:" name="AddressDetail">
                                            <Input.TextArea
                                                style={{
                                                    width: "100%",
                                                    height: "110px"
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={12}>
                
                                <Row>
                                    <Col xs={24} md={24} lg={24}>
                                        <Form.Item label="Сургалтын оролцогчид:">
                                        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={add}>
                                            Нэмэх
                                        </Button> 
                                            <DataTable
                                                value={list}
                                                removableSort
                                                paginator
                                                rows={5}
                                                className="p-datatable-responsive-demo"
                                                selection={selectedRows}
                                                // onRowClick={edit}                                              
                                                onSelectionChange={(e) => {
                                                setSelectedRows(e.value);
                                                }}
                                                dataKey="id">                                                                                    
                                                    <Column field="index" header="№"/>
                                                    <Column field="name" header="Нэр"/>
                                                    <Column field="phone" header="Утас"/>
                                                    <Column headerStyle={{ width: '7rem' }} body={action}/>                                         
                                            </DataTable>
                                            {isModalVisibleParticipants && (
                                                <ParticipantsModal
                                                    ParticipantsModalController={editRow}
                                                    isModalVisible={isModalVisibleParticipants}
                                                    close={closeModal}
                                                    isEditMode={isEditModeParticipants}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} md={24} lg={12} >
                                        <Form.Item label="Сургалт эхлэх хугацаа:">
                                            <DatePicker value={Guidelinescontroller.startDate && moment(Guidelinescontroller.startDate, 'YYYY-MM-DD')} allowClear/>
                                        </Form.Item>                                   
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <Form.Item label="Сургалт дуусах хугацаа:">
                                            <DatePicker value={Guidelinescontroller.endDate && moment(Guidelinescontroller.endDate, 'YYYY-MM-DD')} allowClear/>
                                        </Form.Item>                                   
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Form>
                </ContentWrapper>
            </Modal>
        </div >
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

