import { Col, Form, Input, message, Modal, Row, InputNumber } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

export default function financeModal(props) {
  const { EditRow, isModalVisible, isEditMode, summaryID } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        largeAmountOfCapital: EditRow.largeAmountOfCapital,
        capacity: EditRow.capacity,
        evaluation: EditRow.evaluation,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`financingEstimatesRates/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`financingEstimatesRates/post/${summaryID}`, values)
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
        title="Холбогдох хөрөнгө, тоног төхөөрөмж,  шаардлагатай санхүүжилтийн тооцоолол, хувь хэмжээ"
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
                  label="Төсөл хэрэгжүүлэхэд шаардлагатай том хэмжээний хөрөнгө, тоног төхөөрөмж:"
                  name="largeAmountOfCapital"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Хүчин чадал:" name="capacity">
                  <Input />
                </Form.Item>
                <Form.Item label="Үнэлгээ (мөнгөн дүнгээр):" name="evaluation">
                  <InputNumber type="number" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
