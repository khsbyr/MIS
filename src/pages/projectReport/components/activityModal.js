import { Col, DatePicker, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/mn_MN';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/CvModal.style';
import validateMessages from '../../../tools/validateMessage';
import 'moment/locale/mn';

const { TextArea } = Input;

export default function ActivityModal(props) {
  const { EditRow, isModalVisible, isEditMode, id } = props;
  const [form] = Form.useForm();
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();

  useEffect(() => {
    setStartDate(EditRow?.startDate);
    setEndDate(EditRow?.endDate);
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.startDate = StartDate;
        values.endDate = EndDate;
        if (isEditMode) {
          putService(`planActivity/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`planActivity/post/${id}`, values)
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

  function startDate(e, value) {
    setStartDate(value);
  }

  function endDate(e, value) {
    setEndDate(value);
  }

  return (
    <div>
      <Modal
        title="Үйл ажиллагааны дэс дараалал, задаргаа бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={900}
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
            <Row gutter={32}>
              <Col xs={18} md={12} lg={12}>
                <Form.Item
                  label="Эхлэх огноо:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    onChange={startDate}
                    defaultValue={
                      isEditMode ? EditRow && moment(EditRow.startDate) : ''
                    }
                    locale={locale}
                  />
                </Form.Item>
              </Col>
              <Col xs={18} md={12} lg={12}>
                <Form.Item
                  label="Дуусах огноо:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    onChange={endDate}
                    defaultValue={
                      isEditMode ? EditRow && moment(EditRow.endDate) : ''
                    }
                    locale={locale}
                  />
                </Form.Item>
              </Col>
              <Col xs={18} md={12} lg={24}>
                <Form.Item
                  label="Үйл ажиллагааны дэс дараалал, задаргаа:"
                  name="operation"
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
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
