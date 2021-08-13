import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  postService,
  putService,
  getService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './guidelines.style';

const { Option } = Select;
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
  const [stateTrainers, setStateTrainers] = useState(false);
  useEffect(() => {
    getService(`trainingTeam/getList/${trainingID}`).then(result => {
      if (result) {
        setStateTrainers(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...Trainingprogramcontroller,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.training = { id: trainingID };
        if (isEditMode) {
          putService(
            `trainingProgram/update/${Trainingprogramcontroller.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`trainingProgram/post`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
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
        title="Сургалтын хөтөлбөр бүртгэх"
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
                      label="Хэрэгжих өдөр:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    {/* <Form.Item
                      name="responsiblePersonName"
                      label="Хариуцах эзэн:"
                    >
                      <Input />
                    </Form.Item> */}
                    <Form.Item
                      layout="vertical"
                      label="Хариуцах эзэн:"
                      name="responsiblePersonName"
                    >
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        maxTagCount="responsive"
                        // filterOption={(input, option) =>
                        //   option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                        // onChange={props.onChange}
                      >
                        {stateTrainers &&
                          stateTrainers.map((z, index) => (
                            <Option key={index} value={z.user.fullName}>
                              {z.user.fullName}
                            </Option>
                          ))}
                      </Select>
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
