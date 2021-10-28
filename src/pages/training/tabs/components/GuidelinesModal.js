import { Col, Form, Input, Modal, Row, message } from 'antd';
import React, { useEffect } from 'react';
import { putService, postService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './guidelines.style';

const { TextArea } = Input;

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
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`trainingGuidelines/post/${trainingID}`, values)
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
        title="Сургалтын удирдамж"
        okText="Хадгалах"
        cancelText="Буцах"
        width={800}
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
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Сургалтын сэдэв:"
                      name="subject"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <TextArea style={{ width: '100%', height: '100px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Сургалт зохион байгуулах үндэслэл:"
                      name="reason"
                    >
                      <TextArea style={{ width: '100%', height: '100px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Сургалтын зорилго:"
                      name="aim"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <TextArea style={{ width: '100%', height: '100px' }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Хэрэгжүүлэх үйл ажиллагаа:"
                      name="operation"
                    >
                      <TextArea style={{ width: '100%', height: '100px' }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Хүлээгдэж буй үр дүн:"
                      name="result"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <TextArea style={{ width: '100%', height: '100px' }} />
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
