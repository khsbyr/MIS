import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

const { TextArea } = Input;

export default function projectPurposeModal(props) {
  const { isModalVisible, isEditMode } = props;
  return (
    <div>
      <Modal
        title="Төслийн зорилго, санал болгож буй шийдэл, ашиг хүртэгчид болон ач холбогдол"
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
              <Col>
                <Form.Item
                  label="Төслийн зорилго:"
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
                  label="Тулгамдаж буй хүндрэл, бэрхшээлүүдийг шийдвэрлэх талаар дэвшүүлж буй шийдэл, хэрэгжүүлэх стартеги:"
                  name="#"
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Төслийн ашиг хүртэгчид:" name="#">
                  <Input />
                </Form.Item>
                <Form.Item label="Төслийн үр ашиг:" name="#">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Зах зээлийн холбоо, хамтын ажиллагаа:"
                  name="#"
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Хугацаа болон тогтвортой байдал:" name="#">
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
