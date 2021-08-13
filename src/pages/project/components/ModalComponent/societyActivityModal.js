import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

const { TextArea } = Input;

export default function societyActivityModal(props) {
  const { isModalVisible, isEditMode } = props;
  return (
    <div>
      <Modal
        title="Нийгэм, байгаль орчны үйл ажиллагааны жагсаалт"
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
                  label="Үндсэн үйл ажиллагаа:"
                  name="#"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  label="МУ-ын Засгийн газар болон МАА ЭЗЭН төслийн бодлогыг дагаж мөрдөх:"
                  name="#"
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
