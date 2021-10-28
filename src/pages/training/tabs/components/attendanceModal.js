import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import PhoneNumber from '../../../../components/PhoneNumber';
import { useToolsStore } from '../../../../context/Tools';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './attendance.style';

const { Option } = Select;

export default function TrainingProgramModal(props) {
  const { Attendancecontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [programList, setProgramList] = useState();
  const [programValue, setProgramValue] = useState();
  message.info('Хэрэглэгч системд бүртгэлгүй тул бүртгүүлнэ үү!', 7);

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
    getService(`trainingProgram/get/${trainingID}`).then(result => {
      if (result) {
        setProgramList(result.content);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...Attendancecontroller,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainingProgramId = programValue;
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
          putService(`participants/update/${Attendancecontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('participants/post', values)
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

  function programID(e) {
    setProgramValue(e);
  }

  const handleSearch = value => {
    getService(
      `trainingProgram/get/${trainingID}?search=operation:*${value}*`
    ).then(result => {
      if (result) {
        setProgramList(result.content);
      }
    }, 500);
  };

  // function isSingleParent(value) {
  //   setSingleParent(value.target.value);
  // }

  // function wentOtor(value) {
  //   setWentToOtor(value.target.value);
  // }

  return (
    <div>
      <Modal
        title="Ирцийн бүртгэл"
        okText="Хадгалах"
        cancelText="Буцах"
        width={900}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
        maskClosable={false}
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
                  name="register"
                  label="Регистрийн дугаар"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input maxLength={10} />
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

                <PhoneNumber label="Холбогдох утас:" name="phone" />

                {/* <Form.Item
                  name="familyMembers"
                  label="Ам бүл"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber size="large" type="number" />
                </Form.Item> */}

                <Form.Item label="Хөтөлбөр:">
                  <Select
                    showSearch
                    placeholder="Хөтөлбөр сонгох"
                    onChange={programID}
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
                {/* 
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
                </Form.Item> */}
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

                {/* <Form.Item
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
                </Form.Item> */}
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
