import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
  DatePicker,
  AutoComplete,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import {
  postService,
  putService,
  getService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './trainingProgram.style';
import { DATEFORMAT } from '../../../../constants/Constant';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};

export default function TrainingProgramModal(props) {
  const { Trainingprogramcontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const [stateTrainers, setStateTrainers] = useState(false);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [, setIsOnchange] = useState(false);

  function onStartDateChange(date, value) {
    setStartDate(value);
  }

  function onEndDateChange(date, value) {
    setEndDate(value);
  }

  useEffect(() => {
    getService(`trainingTeam/getList/${trainingID}`).then(result => {
      if (result) {
        setStateTrainers(result.content || []);
      }
    });
    if (isEditMode) {
      setStartDate(Trainingprogramcontroller.startDate);
      setEndDate(Trainingprogramcontroller.endDate);
      form.setFieldsValue({
        ...Trainingprogramcontroller,
        startDate: Trainingprogramcontroller
          ? Trainingprogramcontroller.startDate
          : '',
        endDate: Trainingprogramcontroller
          ? Trainingprogramcontroller.endDate
          : '',
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.startDate = startDate;
        values.endDate = endDate;
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
            {...layout}
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
                    <Form.Item label="Эхэлсэн огноо:">
                      <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        showTime
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%', height: '40px' }}
                        placeholder="Эхэлсэн огноо:"
                        className="FormItem"
                        onOk={{ style: { display: 'none' } }}
                        onChange={onStartDateChange}
                        defaultValue={
                          isEditMode
                            ? moment(
                                Trainingprogramcontroller.startDate
                              ).format(DATEFORMAT)
                            : null
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Дууссан огноо:">
                      <DatePicker
                        allowClear
                        format="YYYY-MM-DD HH:mm"
                        showTime
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%', height: '40px' }}
                        placeholder="Дууссан огноо:"
                        className="FormItem"
                        onChange={onEndDateChange}
                        defaultValue={
                          isEditMode
                            ? moment(Trainingprogramcontroller.endDate)
                            : null
                        }
                      />
                    </Form.Item>
                    {/* <Form.Item
                      layout="vertical"
                      label="Хариуцах эзэн:"
                      name="responsiblePersonName"
                    >
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        maxTagCount="responsive"
                      >
                        {stateTrainers &&
                          stateTrainers.map((z, index) => (
                            <Option key={index} value={z.user.fullName}>
                              {z.user.fullName}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item> */}
                    <Form.Item
                      name="responsiblePersonName"
                      layout="vertical"
                      label="Хариуцах эзэн:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <AutoComplete
                        placeholder="Хариуцах эзэн"
                        // onSelect={selectUser}
                        filterOption={(inputValue, option) =>
                          option.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {stateTrainers &&
                          stateTrainers.map((z, index) => (
                            <Option key={index} value={z.user.fullName}>
                              {z.user.fullName}
                            </Option>
                          ))}
                      </AutoComplete>
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
