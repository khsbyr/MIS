import { Col, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';

const { TextArea } = Input;

export default function DescriptionModal(props) {
  const { isModalVisible, isEditMode, doctorID } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({});
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        const data = {
          youngDoctorStatus: { id: 3 },
          youngDoctor: { id: doctorID },
          definition: values.description,
        };
        postService('youngDoctorStatusHistory/post', data)
          .then(() => {
            const datas = {
              youngDoctorId: doctorID,
              statusId: 3,
            };
            putService(`youngDoctorStatus/updateDoctorStatus`, datas)
              .then(() => {
                message.success('Амжилттай хадгаллаа');
              })
              .catch(error => {
                errorCatch(error);
              });
            props.close(true);
          })
          .catch(error => {
            errorCatch(error);
          });
      })
      .catch(info => {
        errorCatch(info);
      });
  };
  return (
    <div>
      <Modal
        title="Буцаасан шалтгаанаа оруулна уу!"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
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
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Заавал бөглөх хэсгийг бөглөнө үү!',
                  },
                ]}
              >
                <TextArea rows={5} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
