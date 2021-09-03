import { Col, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';

export default function investmentModal(props) {
  const { EditRow, isModalVisible, isEditMode, summaryID } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
        operationExpense: EditRow.operationExpense,
        total: EditRow.total,
        costOfCompany: EditRow.costOfCompany,
        projectInvestment: EditRow.projectInvestment,
        description: EditRow.description,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`projectInvestment/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`projectInvestment/post/${summaryID}`, values)
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
        title="Хөрөнгө оруулалт"
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
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  label="Үйл ажиллагаа буюу зардал:"
                  name="operationExpense"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт:"
                  name="projectInvestment"
                >
                  <CurrencyInput precision="0" suffix=" ₮" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Нийт  дүн:" name="total">
                  <CurrencyInput precision="0" suffix=" ₮" />
                </Form.Item>
                <Form.Item
                  label="Компаниас гаргах зардал хуваалт"
                  name="costOfCompany"
                >
                  <CurrencyInput precision="0" suffix=" ₮" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Санхүүжилтийн эх үүсвэр болон нэмэлт тайлбар:"
                  name="description"
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
