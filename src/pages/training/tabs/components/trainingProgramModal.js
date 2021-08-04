import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './guidelines.style';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};

export default function TrainingProgramModal(props) {
  const { Trainingprogramcontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  // const [setStateTeam] = useState([]);
  const [TrainingTeamID] = useState([]);
  // const PAGESIZE = 20;
  // const [lazyParams, setLazyParams] = useState({
  //   page: 0,
  // });
  const loadLazyTimeout = null;

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };

  useEffect(() => {
    onInit();
    // getService('trainingPlan/get').then(result => {
    //   if (result) {
    //     setStateTeam(result.content || []);
    //     // training_plan.id =
    //     // stateplanID(planID)
    //   }
    // });
    if (Trainingprogramcontroller !== null) {
      getService(`training/get/${Trainingprogramcontroller.id}`).then(
        result => {
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
  }, []);

  // const selectTrainingTeam = trainingTeamID => {
  //   setTrainingTeamID(trainingTeamID);
  // };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.training = { id: trainingID };
        values.training_team = { id: TrainingTeamID };

        if (isEditMode) {
          putService(`trainingProgram/update/${trainingID}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`trainingProgram/post/${trainingID}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        errorCatch(info);
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
            labelAlign="left"
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
