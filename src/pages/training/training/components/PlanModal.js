import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import ContentWrapper from './guidelines.style';
import validateMessages from '../../../../tools/validateMessage';

export default function PlanModal(props) {
  const { Plancontroller, isModalVisible, isEditMode, trainingID, orgID } =
    props;
  const [form] = Form.useForm();
  const [stateTrainers, setStateTrainers] = useState(false);
  const [stateUser, setStateUser] = useState([]);

  useEffect(() => {
    getService(`user/getByOrgId/${orgID}`).then(result => {
      if (result) {
        setStateUser(result || []);
      }
    });
    getService(`trainers/getList/${orgID}`).then(result => {
      if (result) {
        setStateTrainers(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...Plancontroller,
        UserID: Plancontroller.user && Plancontroller.user.id,
        TrainerID: Plancontroller.trainers && Plancontroller.trainers.id,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (values.UserID) {
          values.user = { id: values.UserID };
        } else {
          values.user = null;
        }
        if (values.TrainerID) {
          values.trainers = { id: values.TrainerID };
        } else {
          values.trainers = null;
        }
        values.training = { id: trainingID };
        if (isEditMode) {
          putService(`trainingTeam/update/${Plancontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('trainingTeam/post', values)
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
        title="Сургалтын баг"
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
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col xs={24} md={24} lg={18}>
                <Form.Item
                  label="Сургалтанд гүйцэтгэх үүрэг:"
                  name="mission"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="UserID">
                  <AutoCompleteSelect
                    valueField="id"
                    placeholder="Ажилчдаас сонгох"
                    data={stateUser}
                    // onChange={(value) => selectUser(value)}
                  />
                </Form.Item>
                <Form.Item name="TrainerID">
                  <AutoCompleteSelect
                    valueField="id"
                    placeholder="Багшаас сонгох"
                    data={stateTrainers}
                    // onChange={(value) => selectOrgs(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} />
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
