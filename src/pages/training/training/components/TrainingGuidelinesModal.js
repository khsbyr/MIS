import {
  Col, Form,
  Input, Modal,
  Row
} from "antd";
import React, { useEffect, useState } from "react";
import AutoCompleteSelect from "../../../../components/Autocomplete";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./attendance.style";

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
export default function TrainingGuidelinesModal(props) {
    const { TrainingGuidelinesModalController, isModalVisible, isEditMode } = props;
    const [stateAimag, setStateAimag] = useState([]);
    const [stateSum, setStateSum] = useState([]);
    const [stateCountry, setStateCountry] = useState([]);
    const [stateBag, setStateBag] = useState([]);
    const [form] = Form.useForm();
    const [lazyParams, setLazyParams] = useState({
      page: 0,
    });   

    useEffect(() => {
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
      if(TrainingGuidelinesModalController!==undefined) {
      getService(
        `soum/getList/${TrainingGuidelinesModalController.address.aimag.id}`
      ).then((result) => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${TrainingGuidelinesModalController.address.soum.id}`
      ).then((result) => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
      if (isEditMode) {
        form.setFieldsValue({
          ...TrainingGuidelinesModalController,
          CountryID: TrainingGuidelinesModalController.address.country.id,
          AimagID: TrainingGuidelinesModalController.address.aimag.id,
          SoumID: TrainingGuidelinesModalController.address.soum.id,
          BagID: TrainingGuidelinesModalController.address.bag.id,
          AddressDetail:
          TrainingGuidelinesModalController.address.addressDetail,
          trainingStartDate:
          TrainingGuidelinesModalController.trainingStartDate,
          subject: TrainingGuidelinesModalController.subject,
          reason: TrainingGuidelinesModalController.reason,
          aim: TrainingGuidelinesModalController.aim,
          operation: TrainingGuidelinesModalController.operation,
          result: TrainingGuidelinesModalController.result,
        });
      }
    }, []);

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
      debugger
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
            },
          };
          if (isEditMode) {
            putService("trainingGuidelines/update/" + TrainingGuidelinesModalController.id, values)
              .then((result) => {
                props.close(true);
              })
              .catch((error) => {
                errorCatch(error);
              });
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
                title="Оролцогчийн бүртгэл"
                okText="Хадгалах"
                cancelText="Буцах"
                width={1000}
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
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалтын сэдэв:"
                      name="subject"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалт зохион байгуулах үндэслэл:"
                      name="reason"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Сургалтын зорилго:"
                      name="aim"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
            
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Хэрэгжүүлэх үйл ажиллагаа:"
                      name="operation"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
        
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Хүлээгдэж буй үр дүн:"
                      name="result"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <p style={{ color: "#7d7d7d", fontSize: "13px" }}>
                      Сургалт зохион байгуулагдах газар:
                    </p>
                  </Col>
                </Row>
                <Row style={{ maxWidth: "95%" }}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Улс:" name="CountryID">
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
                    <Form.Item
                      name="SoumID"
                      layout="vertical"
                      label="Сум, Дүүрэг:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateSum}
                        onChange={(value) => selectSum(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="BagID"
                      layout="vertical"
                      label="Баг, Хороо:"
                    >
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
                          height: "110px",
                        }}
                      />
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
}
