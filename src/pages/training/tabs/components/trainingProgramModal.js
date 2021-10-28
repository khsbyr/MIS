import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, DatePicker, Form, Input, message, Modal, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import locale from 'antd/es/date-picker/locale/mn_MN';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './trainingProgram.style';
import 'moment/locale/mn';

export default function TrainingProgramModal(props) {
  const { Trainingprogramcontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState([]);

  function onStartDateChange(date, value) {
    setStartDate(value);
  }

  useEffect(() => {
    if (isEditMode) {
      setStartDate(Trainingprogramcontroller.startDate);

      form.setFieldsValue({
        ...Trainingprogramcontroller,
        startDate: Trainingprogramcontroller
          ? Trainingprogramcontroller.startDate
          : '',
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.date = startDate;
        values.training = { id: trainingID };
        if (isEditMode) {
          putService(
            `trainingProgram/update/${Trainingprogramcontroller.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`trainingProgram/post`, values)
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
        title="Сургалтын хөтөлбөр бүртгэх"
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
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      name="operation"
                      label="Үйл ажиллагаа:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item label="Огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%', height: '40px' }}
                        placeholder="Огноо:"
                        className="FormItem"
                        onChange={onStartDateChange}
                        locale={locale}
                        defaultValue={
                          isEditMode
                            ? moment(Trainingprogramcontroller.date)
                            : null
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
