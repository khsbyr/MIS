import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, DatePicker, Form, Input, message, Modal, Radio, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/cv.styled';
import { shapeData } from '../../../constants/Constant';

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
  const [stateUser, setStateUser] = useState([]);
  const [stateUserID, setStateUserID] = useState([]);
  const [stateCriteria, setStateCriteria] = useState([]);
  const [stateCriteriaID, setStateCriteriaID] = useState([]);
  const [stateOrg, setStateOrg] = useState([]);
  const [stateOrgID, setStateOrgID] = useState([]);
  const [stateShapeID, setStateShapeID] = useState([]);
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
    getService('user/get').then(result => {
      if (result) {
        setStateUser(result.content || []);
      }
    });
    getService('criteria/get').then(result => {
      if (result) {
        setStateCriteria(result || []);
      }
    });
    getService('organization/get').then(result => {
      if (result) {
        setStateOrg(result.content || []);
      }
    });
    if (isEditMode) {
      setDate(Feedbackcontroller.feedbackDate);
      setStateFeedbackID(Feedbackcontroller.feedbackType.id);
      setStateUserID(Feedbackcontroller.user && Feedbackcontroller.user.id);
      setStateCriteriaID(
        Feedbackcontroller.criteria && Feedbackcontroller.criteria.id
      );
      setStateOrgID(
        Feedbackcontroller.organization && Feedbackcontroller.organization.id
      );
      setStateShapeID(
        Feedbackcontroller.shapeData && Feedbackcontroller.shapeData.id
      );
      form.setFieldsValue({
        ...Feedbackcontroller,
        TypeID: Feedbackcontroller.feedbackType
          ? Feedbackcontroller.feedbackType.name
          : '',
        UserID: Feedbackcontroller.user
          ? Feedbackcontroller.user.firstname
          : '',
        CriteriaID: Feedbackcontroller.criteria
          ? Feedbackcontroller.criteria.name
          : '',
        OrgID: Feedbackcontroller.organization
          ? Feedbackcontroller.organization.name
          : '',
        ShapeID: Feedbackcontroller.shapeData
          ? Feedbackcontroller.shapeData.name
          : '',
        feedbackDate: Feedbackcontroller ? Feedbackcontroller.feedbackDate : '',
      });
    }
  }, []);

  const selectFeedbackType = value => {
    setStateFeedbackID(value);
  };
  const selectUser = value => {
    setStateUserID(value);
  };
  const selectCriteria = value => {
    setStateCriteriaID(value);
  };
  const selectOrg = value => {
    setStateOrgID(value);
  };
  const selectShape = value => {
    setStateShapeID(value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.feedbackType = { id: stateFeedbackID };
        values.user = { id: stateUserID };
        values.criteria = { id: stateCriteriaID };
        values.organization = { id: stateOrgID };
        values.shapeData = { id: stateShapeID };
        values.feedbackDate = Date;
        if (isEditMode) {
          const saveData = {
            feedback: values,
            criteriaIds: [values.CriteriaID],
          };
          putService(`feedback/update/${Feedbackcontroller.id}`, saveData)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          const saveData = {
            feedback: values,
            criteriaIds: [values.CriteriaID],
          };
          postService(`feedback/post`, saveData)
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
              <Col xs={24} md={24} lg={8}>
                <Form.Item placeholder="Огноо:">
                  <DatePicker
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="Огноо"
                    className="FormItem"
                    onChange={onDateChange}
                    defaultValue={
                      Feedbackcontroller &&
                      moment(Feedbackcontroller.feedbackDate).zone(0)
                    }
                  />
                </Form.Item>
                <Form.Item
                  placeholder="Хүлээн авагч:"
                  name="UserID"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="Хүлээн авагч"
                    valueField="id"
                    data={stateUser}
                    size="medium"
                    onChange={value => selectUser(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  name="TypeID"
                  placeholder="Санал, гомдлын төрөл:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="Санал, гомдлын төрөл"
                    valueField="id"
                    data={stateFeedbackType}
                    size="medium"
                    onChange={value => selectFeedbackType(value)}
                  />
                </Form.Item>
                <Form.Item name="shapeID" placeholder="Хэлбэр:">
                  <AutoCompleteSelect
                    valueField="id"
                    placeholder="Хэлбэр"
                    data={shapeData}
                    onChange={value => selectShape(value)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  name="complainant"
                  placeholder="Санал гомдол гаргагч:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    className="FormItem"
                    placeholder="Санал гомдол гаргагч"
                  />
                </Form.Item>
                <Form.Item
                  name="OrgID"
                  placeholder="Байгууллага сонгох:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="Байгууллага сонгох"
                    valueField="id"
                    data={stateOrg}
                    size="medium"
                    onChange={value => selectOrg(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  name="CriteriaID"
                  placeholder="Шалгуур үзүүлэлт:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="Шалгуур үзүүлэлт"
                    valueField="id"
                    // defaultValue={
                    //   Feedbackcontroller.criteria &&
                    //   Feedbackcontroller.criteria[23].name
                    // }
                    defaultValue={
                      isEditMode
                        ? Feedbackcontroller.stateCriteria &&
                          Feedbackcontroller.stateCriteria[23].name
                        : null
                    }
                    data={stateCriteria}
                    size="medium"
                    onChange={value => selectCriteria(value)}
                  />
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
