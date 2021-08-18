import { Col, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

const { TextArea } = Input;

export default function resultModal(props) {
  const { EditRow, isModalVisible, isEditMode, summaryID } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        areasOfActivity: EditRow.projectResult.areasOfActivity,
        result: EditRow.projectResult.result,
        yield: EditRow.projectResult.yield,
        effect: EditRow.projectResult.effect,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`projectResult/update/${EditRow.projectResult.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`projectResult/post/${summaryID}`, values)
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
        title="Төслийн хүрээнд гарах үр дүн"
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
            <Row gutter={30}>
              <Col span={24}>
                <Form.Item
                  label="Үйл ажиллагааны чиглэл:"
                  name="areasOfActivity"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Үр дүн:" name="result">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Гарц:" name="yield">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Нөлөө:" name="effect">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
