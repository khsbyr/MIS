import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Radio,
  InputNumber,
} from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import { useToolsStore } from '../../../../context/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from '../../../training/tabs/components/attendance.style';
import PhoneNumber from '../../../../components/PhoneNumber';
import { PATTERN_REGISTER } from '../../../../constants/Pattern';

export default function ParticipantsProjectModal(props) {
  const {
    Attendancecontroller,
    isModalVisible,
    isEditMode,
    criteriaId,
    projectId,
  } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  // const [programList, setProgramList] = useState();

  const getSum = aimagId => {
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
  };

  const selectAimag = value => {
    getSum(value);
  };

  const getBag = sumID => {
    getService(`bag/getList/${sumID}`, {}).then(result => {
      if (result) {
        setStateBag(result || []);
      }
    });
  };

  const selectSum = value => {
    getBag(value);
  };

  useEffect(() => {
    // getService(
    //   `trainingProgram/get/${Attendancecontroller.trainingProgram.training.id}`
    // ).then(result => {
    //   if (result) {
    //     setProgramList(result.content);
    //   }
    // });
    if (Attendancecontroller !== undefined) {
      getService(
        `soum/getList/${Attendancecontroller?.user?.address?.aimag?.id}`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${Attendancecontroller?.user?.address?.soum?.id}`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
    if (isEditMode) {
      form.setFieldsValue({
        ...Attendancecontroller,
        CountryID: Attendancecontroller?.user?.address
          ? Attendancecontroller?.user?.address?.country?.id
          : '',
        AimagID: Attendancecontroller?.user?.address
          ? Attendancecontroller.user?.address?.aimag?.id
          : '',
        SoumID: Attendancecontroller.user?.address
          ? Attendancecontroller.user?.address?.soum?.id
          : '',
        BagID: Attendancecontroller.user?.address
          ? Attendancecontroller.user?.address?.bag?.id
          : '',
        addressDetail: Attendancecontroller.user?.address?.addressDetail,
        Gender: Attendancecontroller.gender.gender,
        GenderID: Attendancecontroller.gender.id,
        lastName: Attendancecontroller.user.lastname,
        firstName: Attendancecontroller.user.firstname,
        phone: Attendancecontroller.user.phoneNumber,
        email: Attendancecontroller.user.email,
        register: Attendancecontroller.user.register,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.projectId = projectId;
        values.criteriaId = criteriaId;
        values.address = {
          addressDetail: values.addressDetail,
          country: {
            id: 107,
          },
          aimag: {
            id: values.AimagID,
          },
          soum: {
            id: values.SoumID,
          },
          bag: values.BagID
            ? {
                id: values.BagID,
              }
            : null,
        };
        if (isEditMode) {
          putService(`farmer/update/${Attendancecontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('farmer/post', values)
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
        title="Оролцогчийн мэдээлэл"
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
            layout="vertical"
            labelAlign="left"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={[72]}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  name="lastName"
                  label="Овог"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="firstName"
                  label="Нэр:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="jobDescription"
                  label="Ажил эрхлэлт:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="register"
                  label="Регистрийн дугаар"
                  rules={[
                    {
                      required: true,
                      pattern: PATTERN_REGISTER,
                      message: 'Регистрийн дугаар буруу байна',
                    },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
                <PhoneNumber label="Холбогдох утас:" name="phone" />

                <Form.Item
                  name="familyMembers"
                  label="Ам бүл"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber size="large" type="number" />
                </Form.Item>

                <Form.Item
                  name="numberOfLivestock"
                  label="Малын тоо"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber size="large" type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="email" label="Email хаяг:">
                  <Input />
                </Form.Item>
                <Form.Item label="Улс:" name="CountryID">
                  <AutoCompleteSelect
                    defaultValue={107}
                    valueField="id"
                    data={toolsStore.countryList}
                  />
                </Form.Item>
                <Form.Item
                  label="Аймаг, хот:"
                  name="AimagID"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    valueField="id"
                    data={toolsStore.aimagList}
                    onChange={value => selectAimag(value)}
                  />
                </Form.Item>
                <Form.Item
                  name="SoumID"
                  layout="vertical"
                  label="Сум, Дүүрэг:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateSum}
                    onChange={value => selectSum(value)}
                  />
                </Form.Item>
                <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                  <AutoCompleteSelect valueField="id" data={stateBag} />
                </Form.Item>

                <Form.Item
                  name="account"
                  label="А Данс"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber size="large" type="number" />
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12}>
                  <Form.Item label="Хөтөлбөр:">
                    <Select
                      showSearch
                      placeholder="Хөтөлбөр сонгох"
                      onChange={programID}
                      defaultValue={Attendancecontroller?.trainingProgram?.id}
                      size="small"
                      onSearch={handleSearch}
                      filterOption={false}
                      defaultActiveFirstOption={false}
                      notFoundContent={null}
                    >
                      {programList &&
                        programList.map((z, index) => (
                          <Option key={index} value={z.id}>
                            {z.operation}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col> */}
            </Row>
            <Row>
              <Col xs={24} md={24} lg={5}>
                <Form.Item
                  label="Оторт явсан эсэх:"
                  name="isWentToOtor"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value>Тийм</Radio>
                    <Radio value={false}>Үгүй</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={5}>
                <Form.Item
                  label="Өрх толгойлсон эсэх:"
                  name="isSingleParent"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Radio.Group>
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
