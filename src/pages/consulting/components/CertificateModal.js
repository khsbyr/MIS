import { Form, Input, Modal, message, DatePicker, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/CvModal.style';

export default function CertificateModal(props) {
  const { LicenseController, isModalVisible, isEditMode, trainerID } = props;
  const [form] = Form.useForm();
  const [date, setDate] = useState(null);
  function onChangeDate(datee, value) {
    setDate(value);
  }
  useEffect(() => {
    setDate(LicenseController && LicenseController.licensedDate);
    if (isEditMode) {
      form.setFieldsValue({ ...LicenseController });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.person = { id: trainerID };
        values.licensedDate = date;
        if (isEditMode) {
          putService(`propertyLicense/update/${LicenseController.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('propertyLicense/post', values)
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
        title="Өөрийн нэр дээр бүртгэлтэй оюуны өмч, гэрчилгээ, лиценз, тусгай зөвшөөрөл  "
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            // {...layout}
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  name="propertyName"
                  label="Оюуны өмч, гэрчилгээ, лицензийн нэр:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20]}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="licensedBy" label="Олгосон байгууллагын нэр:">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Огноо:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    onChange={onChangeDate}
                    defaultValue={
                      isEditMode ? moment(LicenseController.licensedDate) : ''
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
