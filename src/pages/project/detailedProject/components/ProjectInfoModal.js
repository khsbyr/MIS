import { Col, Form, Input, message, Modal, Row, DatePicker, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from '../style/ProjectInfoModal.style';

const { TextArea } = Input;

export default function ProjectInfoModal(props) {
  const { EditRow, isModalVisible, isEditMode, projectId } = props;
  const [form] = Form.useForm();
  const [isDelayValue, setIsDelayValue] = useState();
  const [startDateValue, setStartDateValue] = useState();
  const [endDateValue, setEndDateValue] = useState();

  const isDelayFunc = e => {
    setIsDelayValue(e.target.value);
  };

  function startDate(date, value) {
    setStartDateValue(value);
  }

  function endDate(date, value) {
    setEndDateValue(value);
  }

  useEffect(() => {
    if (isEditMode) {
      setIsDelayValue(EditRow.isDelay);
      setStartDateValue(EditRow.startDate);
      setEndDateValue(EditRow.endDate);
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.operation = {
          startDate: startDateValue,
          endDate: endDateValue,
          plannedWork: values.plannedWork,
          performanceProcess: values.performanceProcess,
          reasonOfDelay: values.reasonOfDelay,
          isDelay: isDelayValue,
          description: values.description,
        };
        values.projectId = projectId;
        if (isEditMode) {
          putService(`operation/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`operation/post`, values)
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
        title="Үйл ажиллагаа бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1200}
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
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Эхлэх хугацаа:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    onChange={startDate}
                    defaultValue={
                      isEditMode ? moment(EditRow.startDate).zone(0) : ''
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Дуусах хугацаа:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    onChange={endDate}
                    defaultValue={
                      isEditMode ? moment(EditRow.endDate).zone(0) : ''
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Хоцрогдол:" name="isDelay">
                  <Radio.Group onChange={isDelayFunc} value={isDelayValue}>
                    <Radio value>Хоцорсон</Radio>
                    <Radio value={false}>Хоцроогүй</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Төлөвлөсөн ажил:" name="plannedWork">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Гүйцэтгэлийн явц:" name="performanceProcess">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Тайлбар:" name="description">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              {isDelayValue === true ? (
                <Col xs={24} md={24} lg={12}>
                  <Form.Item label="Хоцрогдлын шалтгаан:" name="reasonOfDelay">
                    <TextArea rows={5} />
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
