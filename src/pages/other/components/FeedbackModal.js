import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, DatePicker, Form, Input, message, Modal, Radio, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import locale from 'antd/es/date-picker/locale/mn_MN';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/cv.styled';
// import { shapeData } from '../../../constants/Constant';
import 'moment/locale/mn';
import { PATTERN_PHONE, PATTERN_REGISTER } from '../../../constants/Pattern';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function FeedbackModal(props) {
  const { Feedbackcontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [valueCheck, setValueCheck] = useState();
  const [stateFeedbackType, setStateFeedbackType] = useState([]);
  const [stateFeedbackID, setStateFeedbackID] = useState([]);
  const [stateCriteria, setStateCriteria] = useState([]);
  const [stateCriteriaID, setStateCriteriaID] = useState([]);
  const [Date, setDate] = useState([]);

  function onDateChange(date, value) {
    setDate(value);
  }
  const onChangeCheck = e => {
    setValueCheck(e.target.value);
  };
  useEffect(() => {
    getService('feedbackType/get').then(result => {
      if (result) {
        setStateFeedbackType(result || []);
      }
    });

    getService('criteria/getFeedbackCriteria').then(result => {
      if (result) {
        setStateCriteria(result || []);
      }
    });

    if (isEditMode) {
      setDate(Feedbackcontroller.feedbackDate);
      setStateFeedbackID(Feedbackcontroller.feedbackType.id);
      setStateCriteriaID(Feedbackcontroller?.feedbackCriteria[0]?.criteria?.id);

      form.setFieldsValue({
        ...Feedbackcontroller,
        TypeID: Feedbackcontroller.feedbackType
          ? Feedbackcontroller.feedbackType.name
          : '',
        UserID: Feedbackcontroller.user
          ? Feedbackcontroller.user.firstname
          : '',
        CriteriaID: Feedbackcontroller.feedbackCriteria
          ? Feedbackcontroller.feedbackCriteria.name
          : '',
        OrgID: Feedbackcontroller.organization
          ? Feedbackcontroller.organization.name
          : '',
        ShapeID: Feedbackcontroller.feedbackShape
          ? Feedbackcontroller.feedbackShape.name
          : '',
        feedbackDate: Feedbackcontroller ? Feedbackcontroller.feedbackDate : '',
      });
    }
  }, []);

  const selectFeedbackType = value => {
    setStateFeedbackID(value);
  };

  const selectCriteria = value => {
    setStateCriteriaID(value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        // values.user = { id: stateUserID };
        // values.organization = { id: stateOrgID };
        values.feedback = {
          feedbackType: { id: stateFeedbackID },
          // feedbackShape: { id: stateShapeID },
          feedbackDate: Date,
          complainant: values.complainant,
          complainantEmail: values.complainantEmail,
          isResolve: values.isResolve,
          measures: values.measures,
          description: values.description,
          phoneNumber: values.phoneNumber,
          addressDetail: values.addressDetail,
          registerNumber: values.registerNumber,
        };
        values.criteriaIds = [stateCriteriaID];
        if (isEditMode) {
          putService(`feedback/update/${Feedbackcontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`feedback/post`, values)
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
        title="Санал гомдлын бүртгэл"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1000}
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
            <Row gutter={[30, 20]}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item placeholder="Огноо:">
                  <DatePicker
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="Огноо"
                    className="FormItem"
                    onChange={onDateChange}
                    locale={locale}
                    defaultValue={
                      isEditMode
                        ? Feedbackcontroller &&
                          moment(Feedbackcontroller.feedbackDate).zone(0)
                        : null
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="complainant"
                  placeholder="Санал гомдол гаргагч:"
                  rules={[
                    {
                      required: true,
                      message: 'Заавал бөглөх хэсгийг бөглөнө үү!',
                    },
                  ]}
                >
                  <Input
                    className="FormItem"
                    placeholder="Санал гомдол гаргагч"
                  />
                </Form.Item>
                <Form.Item
                  name="complainantEmail"
                  placeholder="Санал гомдол гаргагчийн и-мэйл:"
                >
                  <Input
                    className="FormItem"
                    placeholder="Санал гомдол гаргагчийн и-мэйл"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  name="TypeID"
                  placeholder="Санал, гомдлын төрөл:"
                  rules={[
                    {
                      required: true,
                      message: 'Заавал бөглөх хэсгийг бөглөнө үү!',
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="Хүлээн авсан хэлбэр"
                    valueField="id"
                    data={stateFeedbackType}
                    size="medium"
                    onChange={value => selectFeedbackType(value)}
                  />
                </Form.Item>
                <Form.Item
                  name="registerNumber"
                  placeholder="Санал гомдол гаргагчийн регистр:"
                  rules={[
                    {
                      required: true,
                      pattern: PATTERN_REGISTER,
                      message: 'Регистрийн дугаар буруу байна',
                    },
                  ]}
                >
                  <Input
                    className="FormItem"
                    placeholder="Санал гомдол гаргагчийн регистр"
                  />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  placeholder="Санал гомдол гаргагчийн утас:"
                  rules={[
                    {
                      required: true,
                      pattern: PATTERN_PHONE,
                      message: 'Утасны дугаар буруу байна',
                    },
                  ]}
                >
                  <Input
                    className="FormItem"
                    placeholder="Санал гомдол гаргагчийн утас"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={24}>
                <Form.Item name="addressDetail">
                  <Input.TextArea placeholder="Санал гомдол гаргагчийн хаяг" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="CriteriaID" placeholder="Шалгуур үзүүлэлт:">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      placeholder="Шалгуур үзүүлэлт"
                      valueField="id"
                      defaultValue={
                        Feedbackcontroller?.feedbackCriteria[0]?.criteria?.id
                      }
                      data={stateCriteria}
                      size="medium"
                      onChange={value => selectCriteria(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      placeholder="Шалгуур үзүүлэлт"
                      valueField="id"
                      data={stateCriteria}
                      size="medium"
                      onChange={value => selectCriteria(value)}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 30]}>
              <Col xs={24} md={24} lg={12}>
                <h2 className="title">Санал, гомдлын агуулга</h2>
                <Form.Item name="description">
                  <Input.TextArea
                    placeholder="(Санал, гомдлын агуулга)"
                    style={{
                      width: '100%',
                      height: '150px',
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <h2 className="title">Авсан арга хэмжээ</h2>
                <Form.Item name="measures">
                  <Input.TextArea
                    placeholder="(Авсан арга хэмжээ)"
                    style={{
                      width: '100%',
                      height: '150px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2 className="title">Шийдвэрлэсэн эсэх</h2>
                <Form.Item name="isResolve">
                  <Radio.Group value={valueCheck} onChange={onChangeCheck}>
                    <Radio value>Тийм</Radio>
                    <Radio value={false}>Үгүй</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
