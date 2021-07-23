// import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import {
  getService,
  postService,
  putService,
} from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./guidelines.style";
import AutocompleteSelect from "../../../../components/Autocomplete";

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: "${label} хоосон байна!",
  types: {
    // eslint-disable-next-line no-template-curly-in-string
    email: "${label} is not a valid email!",
    // eslint-disable-next-line no-template-curly-in-string
    number: "${label} is not a valid number!",
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: "${label} must be between ${min} and ${max}",
  },
};

export default function GuidelinesModal(props) {
  const { Trainingprogramcontroller, isModalVisible, isEditMode, trainingID } = props;
  const [form] = Form.useForm();
  const [stateTeam, setStateTeam] = useState([]);
  const [TrainingTeamID, setTrainingTeamID] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const PAGESIZE = 20;
  // eslint-disable-next-line no-unused-vars
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  let loadLazyTimeout = null;

  useEffect(() => {
    onInit();
    getService("trainingPlan/get").then((result) => {
      if (result) {
        setStateTeam(result.content || []);
        console.log(result.content)
        // training_plan.id = 
        // stateplanID(planID)
      }
    });
    if (Trainingprogramcontroller !== null) {
      getService("training/get/" + Trainingprogramcontroller.id).then(
        (result) => {
          if (result) {
            // setTrainingID(Trainingprogramcontroller.id);
          }
        }
      );

      if (isEditMode) {
        form.setFieldsValue({
          ...Trainingprogramcontroller,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTrainingTeam = (TrainingTeamID) => {
    console.log(TrainingTeamID)
    setTrainingTeamID(TrainingTeamID);
  }

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };

  const save = () => {
    form
      .validateFields()
      .then((values) => {
        values.training = { id: trainingID };
        values.training_team = {id: TrainingTeamID }

        if (isEditMode) {
          putService(
            "trainingProgram/update/" + trainingID,
            values
          )
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
          postService("trainingProgram/post/" + trainingID, values);
          debugger;
          console
            .log(values)
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
        title="Сургалт бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
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
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      name="operation"
                      label="Үйл ажиллагаа:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="duration"
                      label="Хэрэгжих хугацаа:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="responsiblePersonName"
                      label="Хариуцах эзэн:"
                    >
                      <Input />
                    </Form.Item>
                    {/* <Form.Item
                      layout="vertical"
                      label="Хариуцах эзэн:"
                      name="responsiblePersonName"
                    >
                      <AutocompleteSelect
                        valueField="id"
                        data={stateTeam}
                        placeholder="Хариуцах эзэн"
                        onChange={(value) => selectTrainingTeam(value)}
                      />
                    </Form.Item> */}
                    <Form.Item
                      name="trainingMaterial"
                      label="Сургалтын материал"
                    >
                      <Input />
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
