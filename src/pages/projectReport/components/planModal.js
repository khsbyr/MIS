import { Col, DatePicker, Form, Input, message, Modal, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import MulticompleteSelect from '../../../components/MulticompleteSelect';
import { PlanType } from '../../../constants/Constant';
import { useCriteriaStore } from '../../../context/CriteriaContext';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
// eslint-disable-next-line import/no-named-as-default
import ContentWrapper from './plan.style';

export default function PlanModal(props) {
  const { EditRow, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const { criteriaReferenceList, setCriteriaReferenceList } =
    useCriteriaStore();
  const [userList, setUserList] = useState();
  const [youngDoctor, setYoungDoctor] = useState();
  const [criteriaReferenceId, setCriteriaReferenceId] = useState();
  const [startDateValue, setStartDateValue] = useState();
  const [endDateValue, setEndDateValue] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [ProjectUsers, setProjectUsers] = useState([]);
  const [planType, setPlanType] = useState();

  useEffect(() => {
    getService(`criteriaReference/get`).then(result => {
      if (result) {
        setCriteriaReferenceList(result.content || []);
      }
    });

    getService(`user/get?search=organization.id:2`).then(result => {
      if (result) {
        setUserList(result.content || []);
      }
    });

    getService(`user/getAllYoungDoctorUserList`).then(result => {
      if (result) {
        setYoungDoctor(result || []);
      }
    });

    if (isEditMode) {
      getService(`planUser/getByPlan/${EditRow.id}`).then(result => {
        if (result) {
          result.forEach(z => {
            ProjectUsers.push(z.user.id);
          });
          setProjectUsers([...ProjectUsers]);
        }
      });
      setPlanType(EditRow.typeId);
      setCriteriaReferenceId(EditRow.criteriaReference.id);
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  function SelectedUsers(value) {
    setSelectedUsers(value);
  }

  function SelectedType(value) {
    setPlanType(value);
  }

  function criteriaReference(value) {
    setCriteriaReferenceId(value);
  }

  function startDate(date, value) {
    setStartDateValue(value);
  }

  function endDate(date, value) {
    setEndDateValue(value);
  }

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.plan = {
          name: values.name,
          target: values.target,
          description: values.description,
          startDate: startDateValue,
          endDate: endDateValue,
          organizationId: 2,
          criteriaReference: { id: criteriaReferenceId },
          typeId: planType,
        };
        values.userIds = selectedUsers;
        if (isEditMode) {
          putService(`plan/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('plan/post', values)
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
        title="Төлөвлөгөө бүртгэх"
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
            <Row gutter={30}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Төрөл:">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      placeholder="Төрөл сонгох"
                      defaultValue={EditRow.typeId}
                      valueField="id"
                      data={PlanType}
                      mode="multiple"
                      onChange={value => SelectedType(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      placeholder="Төрөл сонгох"
                      valueField="id"
                      data={PlanType}
                      mode="multiple"
                      onChange={value => SelectedType(value)}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={16}>
                <Form.Item label="Гүйцэтгэгчид:">
                  <MulticompleteSelect
                    data={planType === 1 ? youngDoctor : userList}
                    defaultValue={ProjectUsers}
                    valuefield="id"
                    size="medium"
                    onChange={value => SelectedUsers(value)}
                    type={1}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Үйл ажиллагаа:"
                  name="name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={12}>
                <Form.Item name="TrainerID" label="Бүрэлдэхүүн хэсэг:">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      placeholder="Бүрэлдэхүүн хэсэг сонгох"
                      defaultValue={EditRow?.criteriaReference?.id}
                      valueField="id"
                      data={criteriaReferenceList}
                      mode="multiple"
                      onChange={criteriaReference}
                    />
                  ) : (
                    <AutoCompleteSelect
                      placeholder="Бүрэлдэхүүн хэсэг сонгох"
                      valueField="id"
                      data={criteriaReferenceList}
                      mode="multiple"
                      onChange={criteriaReference}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={6}>
                <Form.Item label="Эхлэх огноо:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    onChange={startDate}
                    defaultValue={isEditMode ? moment(EditRow.startDate) : ''}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={6}>
                <Form.Item label="Дуусах огноо:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    onChange={endDate}
                    defaultValue={isEditMode ? moment(EditRow.endDate) : ''}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Төслийн хөгжлийн зорилт, дунд хугацааны шалгуур үзүүлэлтэд хамаарах үр дүн:"
                  name="target"
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Тайлбар:" name="description">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
