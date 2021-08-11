import { Col, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
// eslint-disable-next-line import/no-named-as-default
import ContentWrapper from './plan.styled';

export default function TestResulModal(props) {
  const { TestResultController, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...TestResultController,
        firstname: TestResultController.participant.user.firstname,
        register: TestResultController.participant.user.register,
        shouldTaken: TestResultController.test.shouldBeTaken,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`testPoint/update/${TestResultController.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('test/post', values)
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
              <Col xs={24} md={24} lg={22}>
                <Form.Item
                  label="Нэр:"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Регистр:"
                  name="register"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Авбал зохих:"
                  name="shouldTaken"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Авсан:"
                  name="taken"
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
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
