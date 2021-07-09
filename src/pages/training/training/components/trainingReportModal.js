import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Row, Col, Button, Upload } from "antd";
import {
  getService,
  postService,
  putService,
} from "../../../../service/service";
import {
  DownOutlined,
  SearchOutlined,
  CopyOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { errorCatch } from "../../../../tools/Tools";
import AutocompleteSelect from "../../../../components/Autocomplete";
import ContentWrapper from "./trainingReport.style";
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
export default function TrainingReportModal(props) {
  const { Composition, isModalVisible, isEditMode } = props;
  const [stateController, setStateController] = useState([]);
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  const [form] = Form.useForm();
  useEffect(() => {
    getService("criteria/get", {
      search: "status:true",
    }).then((result) => {
      if (result) {
        setStateController(result.content || []);
      }
    });

    if (isEditMode) {
      getService("criteria/get" + Composition.id).then((result) => {
        Composition.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Composition });
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.userService = { id: values.userServiceId };
        if (isEditMode) {
          putService("criteria/put" + Composition.id, values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
          postService("criteria/post", values)
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
        title="Сургалтын тайлан бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1200}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Row>
            <Col xs={24} md={24} lg={7}>
              <Form layout="vertical">
                <Form.Item label="Сургалтын нэр:">
                  <Input className="FormItem" />
                </Form.Item>
              </Form>
              <Form layout="vertical">
                <Form.Item label="Сургалтад хамрагдсан:">
                  <Input className="FormItem" />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={7}>
              <Form layout="vertical">
                <Form.Item label="Огноо:">
                  <DatePicker onChange={onChange} bordered={false} />
                </Form.Item>
              </Form>
              <Form layout="vertical">
                <Form.Item label="Сургалт явуулсан байгууллага, хүний нэр:">
                  <Input className="FormItem" />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={7}>
              <Form layout="vertical">
                <Form.Item label="Сургалт явагдсан газар:">
                  <Input className="FormItem" />
                </Form.Item>
              </Form>
              <Form layout="vertical">
                <Form.Item label="Сургагч багшийн нэр:">
                  <Input className="FormItem" />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={3}></Col>
          </Row>
          <Row>
            <Col xs={24} md={24} lg={20}>
              <h1 className="title">1. Сургалтын зорилго</h1>
              <Input.TextArea
                placeholder="(Сургалтын бэлтгэл, өмнө тодорхойлсон сургалтын хэрэгцээ, сургалтын үйл ажиллагааны зорилтын талаар мэдээлнэ үү)"
                style={{
                  width: "100%",
                  height: "140px",
                }}
              />
              <h1 className="title">
                2. Сургалтын хөтөлбөр, төлөвлөгөөний дагуу гүйцэтгэсэн ажил,
                сургалтын үйл явц:{" "}
              </h1>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={12} lg={12}>
                  <Input.TextArea
                    placeholder="(2.1. Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт)"
                    style={{
                      width: "100%",
                      height: "140px",
                    }}
                  />
                </Col>
                <Col xs={24} md={12} lg={12}>
                  <Input.TextArea
                    placeholder="(2.2. Хичээлийн явц, сургалтын хэлбэр, аргачлал)"
                    style={{
                      width: "100%",
                      height: "140px",
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
                <Col xs={24} md={12} lg={12}>
                  <Input.TextArea
                    placeholder="(2.3. Сургалтын тараах материал,  гарын авлагын тухай)"
                    style={{
                      width: "100%",
                      height: "140px",
                    }}
                  />
                </Col>
                <Col xs={24} md={12} lg={12}>
                  <Input.TextArea
                    placeholder="(2.4. Сургалтын танхим, зохион байгуулалтын тухай)"
                    style={{
                      width: "100%",
                      height: "140px",
                    }}
                  />
                </Col>
              </Row>
              <h1 className="title">3. Амжилт, бэрхшээлийн тойм</h1>
              <Input.TextArea
                placeholder="(Суралцагчид сургалтыг хэрхэн хүлээн авсан, сургалт бодит хэрэгцээг  хангасан эсэх, тулгарсан бэрхшээл, хэрхэн шийдвэрлэсэн тухай, сургалтын үнэлгээний санал асуулгын дүн  г.м.)"
                style={{
                  width: "100%",
                  height: "140px",
                }}
              />
              <h1 className="title">4. Гарсан үр дүн</h1>
              <Input.TextArea
                placeholder="(Суралцагчид сургалтыг хэрхэн хүлээн авсан, сургалт бодит хэрэгцээг  хангасан эсэх, тулгарсан бэрхшээл, хэрхэн шийдвэрлэсэн тухай, сургалтын үнэлгээний санал асуулгын дүн  г.м.)"
                style={{
                  width: "100%",
                  height: "140px",
                }}
              />
              <h1 className="title">5. Зөвлөмж</h1>
              <Input.TextArea
                placeholder="((Үйлчлүүлэгчдэд шаардлагатай цаашдын сургалт/зөвлөгөө зэрэг)"
                style={{
                  width: "100%",
                  height: "140px",
                }}
              />
              <h1 className="title">6. Зураг, хавсралт файл</h1>
              <Form layout="vertical">
                <Form.Item>
                  <Upload {...props}>
                    <Button
                      icon={<UploadOutlined />}
                      style={{ height: "40px" }}
                    >
                      Зураг, хавсралт файл
                    </Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
