/* eslint-disable no-nested-ternary */
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import locale from 'antd/es/date-picker/locale/mn_MN';
import AutoCompleteSelect from '../../../components/Autocomplete';
import MulticompleteSelect from '../../../components/MulticompleteSelect';
import { PlanType, PlanType1, PlanType2 } from '../../../constants/Constant';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from './plan.style';
import 'moment/locale/mn';
import { useToolsStore } from '../../../context/Tools';

const { Option, OptGroup } = Select;

export default function PlanModal(props) {
  const { EditRow, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [userList, setUserList] = useState();
  const [youngDoctor, setYoungDoctor] = useState();
  const [criteriaReferenceId, setCriteriaReferenceId] = useState();
  const [startDateValue, setStartDateValue] = useState();
  const [endDateValue] = useState();
  const [ProjectUsers, setProjectUsers] = useState([]);
  const [planType, setPlanType] = useState();
  const toolsStore = useToolsStore();
  const [subCriteriaReference, setSubCriteriaReference] = useState();
  const [subCriteriaID, setsubCriteriaID] = useState();

  useEffect(() => {
    toolsStore.user.roleId !== 15
      ? getService(`user/getListByOrgId/1`).then(result => {
          if (result) {
            setUserList(result || []);
          }
        })
      : '';
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

      getService(
        `subCriteriaReference/getByCriteriaReferenceId/${EditRow.criteriaReference.id}`
      ).then(result => {
        if (result) {
          setSubCriteriaReference(result || []);
        }
      });

      setPlanType(EditRow.typeId);
      setCriteriaReferenceId(EditRow.criteriaReference.id);
      setsubCriteriaID(
        EditRow.subCriteriaReference ? EditRow.subCriteriaReference.id : ''
      );
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  function SelectedUsers(value) {
    setProjectUsers(value);
  }

  function SelectedType(value) {
    setPlanType(value);
  }

  function criteriaReference(value) {
    setCriteriaReferenceId(value);
    getService(`subCriteriaReference/getByCriteriaReferenceId/${value}`).then(
      result => {
        if (result) {
          setSubCriteriaReference(result || []);
        }
      }
    );
  }

  function startDate(date, value) {
    setStartDateValue(planType === 0 ? `${value}-01-01` : `${value}-01`);
  }

  function subCriteria(value) {
    setsubCriteriaID(value);
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
          organizationId: toolsStore.user?.orgId,
          criteriaReference: { id: criteriaReferenceId },
          // subCriteriaReference: subCriteriaID
          //   ? { id: subCriteriaID }
          //   : { id: '' },
          subCriteriaReference:
            criteriaReferenceId === 5
              ? { id: 7 }
              : criteriaReferenceId === 6
              ? { id: 8 }
              : { id: subCriteriaID },
          typeId: planType,
        };
        values.userIds = ProjectUsers;
        if (isEditMode) {
          putService(`plan/update/${EditRow.id}`, values)
            .then(() => {
              message.success('?????????????????? ??????????????????');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('plan/post', values)
            .then(() => {
              message.success('?????????????????? ??????????????????');
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
        title="???????????????????? ??????????????"
        okText="????????????????"
        cancelText="??????????"
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
                <Form.Item label="??????????:">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      placeholder="?????????? ????????????"
                      defaultValue={EditRow?.typeId}
                      valueField="id"
                      data={
                        toolsStore.user.roleId === 15
                          ? PlanType2
                          : toolsStore.user.roleId === 1 ||
                            toolsStore.user.role.id === 4
                          ? PlanType
                          : PlanType1
                      }
                      mode="multiple"
                      onChange={value => SelectedType(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      placeholder="?????????? ????????????"
                      valueField="id"
                      data={
                        toolsStore.user.roleId === 15
                          ? PlanType2
                          : toolsStore.user.roleId === 1 ||
                            toolsStore.user.role.id === 4
                          ? PlanType
                          : PlanType1
                      }
                      mode="multiple"
                      onChange={value => SelectedType(value)}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={16}>
                <Form.Item label="????????????????????????:">
                  <MulticompleteSelect
                    data={planType === 1 ? youngDoctor : userList}
                    value={ProjectUsers}
                    valuefield="id"
                    size="medium"
                    onChange={value => SelectedUsers(value)}
                    type={1}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="?????? ??????????????????:"
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

              {toolsStore.user.role.id !== 15 ? (
                <Col xs={24} md={24} lg={19}>
                  <Form.Item name="TrainerID" label="?????????????????????? ??????????:">
                    {isEditMode ? (
                      <Select
                        placeholder="?????????????? ?????????????????????? ?????????????????????? ????????????"
                        style={{ width: '100%' }}
                        onChange={criteriaReference}
                        size="small"
                        allowClear
                        defaultValue={EditRow?.criteriaReference?.id}
                      >
                        <Option value={3}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????? ?????????? ?????????????? ??????????????????"
                          >
                            ?????????? ?????????? ?????????????? ??????????????????
                          </Tooltip>
                        </Option>
                        <Option value={4}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????? ?????????????? ?????????????????? ?????????? ?????????????? ??????????????????
                            ??????????????????????"
                          >
                            ?????????? ?????????????? ?????????????????? ?????????? ?????????????? ??????????????????
                            ??????????????????????
                          </Tooltip>
                        </Option>
                        <Option value={5}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????????? ???????????????????????? ??????????????"
                          >
                            ?????????????? ???????????????????????? ??????????????
                          </Tooltip>
                        </Option>
                        <Option value={6}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????????????? ???????????? ?????????????? ?????????? ???????? ??????????????????
                            ?????????????????????? ??????????"
                          >
                            ?????????????????? ???????????? ?????????????? ?????????? ???????? ??????????????????
                            ?????????????????????? ??????????
                          </Tooltip>
                        </Option>
                      </Select>
                    ) : (
                      <Select
                        placeholder="?????????????? ?????????????????????? ?????????????????????? ????????????"
                        style={{ width: '100%' }}
                        onChange={criteriaReference}
                        size="small"
                        allowClear
                      >
                        <Option value={3}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????? ?????????? ?????????????? ??????????????????"
                          >
                            ?????????? ?????????? ?????????????? ??????????????????
                          </Tooltip>
                        </Option>
                        <Option value={4}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????? ?????????????? ?????????????????? ?????????? ?????????????? ??????????????????
                          ??????????????????????"
                          >
                            ?????????? ?????????????? ?????????????????? ?????????? ?????????????? ??????????????????
                            ??????????????????????
                          </Tooltip>
                        </Option>
                        <Option value={5}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????????? ???????????????????????? ????????????"
                          >
                            ?????????????? ???????????????????????? ????????????
                          </Tooltip>
                        </Option>
                        <Option value={6}>
                          <Tooltip
                            placement="topLeft"
                            title="?????????????????? ???????????? ?????????????? ?????????? ???????? ??????????????????
                          ?????????????????????? ??????????"
                          >
                            ?????????????????? ???????????? ?????????????? ?????????? ???????? ??????????????????
                            ?????????????????????? ??????????
                          </Tooltip>
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}

              {toolsStore.user.role.id === 15 ? (
                <Col xs={24} md={24} lg={19}>
                  <Form.Item name="TrainerID" label="?????????????????????? ??????????:">
                    {isEditMode ? (
                      <Select
                        placeholder="?????????????? ?????????????????????? ?????????????????????? ????????????"
                        style={{ width: '100%' }}
                        onChange={criteriaReference}
                        size="small"
                        allowClear
                        defaultValue={EditRow?.criteriaReference?.id}
                      >
                        <OptGroup label="???????? ?????????????? ?????????????? ??????????????????????">
                          <Option value={3}>
                            <Tooltip
                              placement="topLeft"
                              title="?????????? ?????????? ?????????????? ??????????????????"
                            >
                              ?????????? ?????????? ?????????????? ??????????????????
                            </Tooltip>
                          </Option>
                        </OptGroup>
                      </Select>
                    ) : (
                      <Select
                        placeholder="?????????????? ?????????????????????? ?????????????????????? ????????????"
                        style={{ width: '100%' }}
                        onChange={criteriaReference}
                        size="small"
                        allowClear
                      >
                        <OptGroup label="???????? ?????????????? ?????????????? ??????????????????????">
                          <Option value={3}>
                            <Tooltip
                              placement="topLeft"
                              title="?????????? ?????????? ?????????????? ??????????????????"
                            >
                              ?????????? ?????????? ?????????????? ??????????????????
                            </Tooltip>
                          </Option>
                        </OptGroup>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}

              <Col xs={24} md={24} lg={5}>
                <Form.Item label="??????????:">
                  <DatePicker
                    placeholder="?????????? ????????????"
                    picker={planType === 0 ? 'year' : 'month'}
                    onChange={startDate}
                    defaultValue={
                      isEditMode ? moment(EditRow.startDateFormat) : ''
                    }
                    locale={locale}
                  />
                </Form.Item>
              </Col>

              {criteriaReferenceId === 3 || criteriaReferenceId === 4 ? (
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="?????? ?????????????????????? ??????????:">
                    {isEditMode ? (
                      <AutoCompleteSelect
                        placeholder="?????? ?????????????????????? ????????????"
                        defaultValue={EditRow?.subCriteriaReference?.id}
                        valueField="id"
                        data={subCriteriaReference}
                        onChange={subCriteria}
                      />
                    ) : (
                      <AutoCompleteSelect
                        placeholder="?????? ?????????????????????? ????????????"
                        valueField="id"
                        data={subCriteriaReference}
                        onChange={subCriteria}
                      />
                    )}
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}

              {toolsStore.user?.role?.id !== 15 ? (
                <Col xs={24} md={24} lg={24}>
                  <Form.Item
                    label="?????????????? ???????????????? ????????????, ???????? ?????????????????? ?????????????? ???????????????????? ???????????????? ???? ??????:"
                    name="target"
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}
              {toolsStore.user?.role?.id !== 15 ||
              toolsStore.user?.role?.id !== 4 ||
              toolsStore.user?.role?.id !== 13 ? (
                <Col xs={24} md={24} lg={24}>
                  <Form.Item label="??????????????:" name="description">
                    <Input.TextArea rows={3} />
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
