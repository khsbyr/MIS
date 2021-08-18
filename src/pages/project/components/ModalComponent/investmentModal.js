import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

export default function investmentModal(props) {
  const { isModalVisible, isEditMode } = props;
  return (
    <div>
      <Modal
        title="Хөрөнгө оруулалт"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1000}
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
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Үйл ажиллагаа буюу зардал:" name="#">
                  <Input />
                </Form.Item>
                <Form.Item label="Компаниас гаргах зардал хуваалт" name="#">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Нийт  дүн:" name="#">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт:"
                  name="#"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Компаниас гаргах %:" name="#">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт %:"
                  name="#"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Санхүүжилтийн эх үүсвэр болон нэмэлт тайлбар:"
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
