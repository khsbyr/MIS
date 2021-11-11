import { Col, Form, message, Modal, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/plan.styled';

export default function ReportModal(props) {
  const { EditRow, isModalVisible, isEditMode, serviceID } = props;
  const [form] = Form.useForm();

  useEffect(() => {
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
        if (isEditMode) {
          putService(`makhisVeterinaryService/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`makhisVeterinaryService/post/${serviceID}`, values)
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
        title="Үйлчилгээ бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1100}
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
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Тандалт буюу эмнэлзүйн үзлэг нэр:"
                  name="clinicalExamination"
                  className="planName"
                >
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Урьдчилан сэргийлэх вакцинжуулалт:"
                  name="preventionVaccination"
                >
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Халдваргүйжүүлэлт:" name="disinfection">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Паразитын эмчилгээ:" name="parasiteTreatment">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
