import { BankFilled, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getService,
  postService,
  putService,
} from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import "./organization.style";
import ContentWrapper from "./organization.style";
import AutoCompleteSelect from "../../../components/Autocomplete";

const { Dragger } = Upload;

function onChange(date, dateString) {
  console.log(date, dateString);
}
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
export default function OrganizationModal(props) {
  console.log(props);
  const { Orgcontroller, isModalVisible, isEditMode } = props;
  const [stateBank, setStateBank] = useState([]);
  const [stateCurrency, setStateCurrency] = useState([]);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);


  useEffect(() => {
    getService("bank/get").then((result) => {
      if (result) {
        setStateBank(result || []);
      }
    });

    getService("currency/get").then((result) => {
      if (result) {
        setStateCurrency(result.content || []);
      }
    });
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
    if (isEditMode) {
      form.setFieldsValue({ ...Orgcontroller , 
        bankName : Orgcontroller.bank.name,
        Currency : Orgcontroller.currency.name,
        CountryName : Orgcontroller.address.country.name,
        AimagName : Orgcontroller.address.aimag.name,
        SoumName : Orgcontroller.address.soum.name,
        BagName : Orgcontroller.address.bag.name,
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
    if (isEditMode) {
      form.setFieldsValue({ ...Orgcontroller });
    }
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
    if (isEditMode) {
      form.setFieldsValue({ ...Orgcontroller });
    }
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
    if (isEditMode) {
      form.setFieldsValue({ ...Orgcontroller });
    }
  };

  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService("organization/update/" + Orgcontroller.id, values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
          debugger
          console.log(values);
          postService("organization/post", values)
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
        title="Зөвлөх байгууллага бүртгэх"
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
          layout="vertical"
          labelAlign={"left"}
          name="nest-messages"
          validateMessages={validateMessages}
        >
          <Row gutter={[72]}>
            <Col xs={24} md={24} lg={4}>
              <Dragger {...props} >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>

                <p className="ant-upload-hint">Зураг оруулах</p>
              </Dragger>
            </Col>
            <Col xs={24} md={24} lg={10}>
              <h2 className="title"> Байгууллагын мэдээлэл</h2>
              <Row gutter={32}>
                <Col xs={24} md={24} lg={12}>

                    <Form.Item
                      layout="vertical"
                      name="name"
                      label="Байгууллагын нэр:"
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
                    <Form.Item label="Регистрийн дугаар:" name="registerNumber" >
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={32}>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Банкны нэр:" name="bankName">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateBank}
                      />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Дансны нэр:" name="accountName">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={32}>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Дансны дугаар:" name="accountNumber">
                      <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Дансны вальют:" name="Currency">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateCurrency}
                      />
                    </Form.Item>
                </Col>
              </Row>

              <h2 className="title">Холбоо барих мэдээлэл</h2>
              <Row gutter={32}>
              <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Улс:" name="CountryName">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateCountry}
                    onChange={(value) => selectCountry(value)}
                      />
                    </Form.Item>
                </Col>
              <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Аймаг, хот:" name="AimagName">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateAimag}
                    onChange={(value) => selectAimag(value)}
                      />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={12}>
                <Form.Item name="SoumName" layout="vertical" label="Сум, Дүүрэг:">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateSum}
                    onChange={(value) => selectSum(value)}
                  />
                </Form.Item>
                </Col>
              </Row>
              <Row gutter={32}>
                <Col xs={24} md={24} lg={12}>
                <Form.Item name="BagName" layout="vertical" label="Баг, Хороо:">
                  <AutoCompleteSelect valueField="id" data={stateBag} />
                </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Утас:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={32}>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Е-майл хаяг:">
                      <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Веб хаяг:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={24}>
                    <Form.Item label="Хаяг:">
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
            <Col xs={24} md={24} lg={10}>
              <h2 className="title">Хариуцсан ажилтан:</h2>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Овог:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Нэр:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Регистрийн дугаар:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Албан тушаал:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Утасны дугаар:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Е-майл хаяг:">
                      <Input />
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Танилцуулга оруулах:">
                      <Upload {...props}>
                        <Button
                          icon={<UploadOutlined />}
                          style={{ height: "40px" }}
                        >
                          Танилцуулга оруулах
                        </Button>
                      </Upload>
                    </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} md={24} lg={12}>
                    <Form.Item>
                      <Checkbox onChange={onChange}>
                        Оруулсан мэдээлэл үнэн болно.
                      </Checkbox>
                    </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
