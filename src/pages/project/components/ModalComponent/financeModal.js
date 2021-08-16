import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

const { TextArea } = Input;

export default function financeModal(props) {
  const { isModalVisible, isEditMode } = props;
  return (
    <div>
      <Modal
        title="Холбогдох хөрөнгө, тоног төхөөрөмж,  шаардлагатай санхүүжилтийн тооцоолол, хувь хэмжээ"
        okText="Хадгалах"
        cancelText="Буцах"
        width={800}
        alignItems="center"
        visible={isModalVisible}
        // onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            // form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col span={24}>
                <Form.Item
                  label="Төсөл хэрэгжүүлэхэд шаардлагатай том хэмжээний хөрөнгө, тоног төхөөрөмж:"
                  name="#"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Хүчин чадал:" name="#">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Үнэлгээ (мөнгөн дүнгээр):" name="#">
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
