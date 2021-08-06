import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { putService, postService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './attendance.style';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};
export default function TrainingGuidelinesModal(props) {
  const { Guidelinescontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...Guidelinescontroller,
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
            `trainingGuidelines/update/${Guidelinescontroller.id}`,
            values
          )
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`trainingGuidelines/post/${trainingID}`, values)
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
        title="Сургалтын удирдамж"
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
            labelAlign="left"
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
                      <Input allowClear />
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
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
