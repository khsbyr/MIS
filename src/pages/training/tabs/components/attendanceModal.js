import { Col, Form, Input, InputNumber, message, Modal, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './attendance.style';

export default function TrainingProgramModal(props) {
  const { Attendancecontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);

  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  };

  const selectCountry = value => {
    getAimag(value);
  };

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
    getService('country/get').then(result => {
      if (result) {
        setStateCountry(result || []);
      }
    });
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });

    if (Attendancecontroller !== undefined) {
      getService(
        `soum/getList/${
          Attendancecontroller && Attendancecontroller.user.address.aimag.id
        }`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${
          Attendancecontroller && Attendancecontroller.user.address.soum.id
        }`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
    if (isEditMode) {
      // setGenderID(Attendancecontroller.gender.id);
      form.setFieldsValue({
        ...Attendancecontroller,
        CountryID: Attendancecontroller.user.address
          ? Attendancecontroller.user.address.country.id
          : '',
        AimagID: Attendancecontroller.user.address
          ? Attendancecontroller.user.address.aimag.id
          : '',
        SoumID: Attendancecontroller.user.address
          ? Attendancecontroller.user.address.soum.id
          : '',
        BagID: Attendancecontroller.user.address
          ? Attendancecontroller.user.address.bag.id
          : '',
        addressDetail: Attendancecontroller.user.address.addressDetail,
        Gender: Attendancecontroller.gender.gender,
        GenderID: Attendancecontroller.gender.id,
        lastName: Attendancecontroller.user.lastname,
        firstName: Attendancecontroller.user.firstname,
        phone: Attendancecontroller.user.phoneNumber,
        register: Attendancecontroller.user.register,
        email: Attendancecontroller.user.email,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainingId = trainingID;
        values.address = {
          addressDetail: values.addressDetail,
          country: {
            id: values.CountryID,
          },
          aimag: {
            id: values.AimagID,
          },
          soum: {
            id: values.SoumID,
          },
          bag: {
            id: values.BagID,
          },
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
                <Form.Item name="phone" label="Холбогдох утас:">
                  <InputNumber
                    parser={value => value.substring(0, 12)}
                    type="number"
                  />
                </Form.Item>
                <Form.Item name="register" label="Регистрийн дугаар">
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="email" label="Email хаяг:">
                  <Input />
                </Form.Item>
                <Form.Item label="Улс:" name="CountryID">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateCountry}
                    onChange={value => selectCountry(value)}
                  />
                </Form.Item>
                <Form.Item label="Аймаг, хот:" name="AimagID">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateAimag}
                    onChange={value => selectAimag(value)}
                  />
                </Form.Item>
                <Form.Item name="SoumID" layout="vertical" label="Сум, Дүүрэг:">
                  <AutoCompleteSelect
                    valueField="id"
                    data={stateSum}
                    onChange={value => selectSum(value)}
                  />
                </Form.Item>
                <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                  <AutoCompleteSelect valueField="id" data={stateBag} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="addressDetail" label="Дэлгэрэнгүй хаяг">
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item label="Хүйс" name="Gender">
              <Select
                placeholder="Хүйс сонгох"
                style={{ width: 150 }}
                onChange={handleChange}
              >
                <Option value={1}>Эрэгтэй</Option>
                <Option value={2}>Эмэгтэй</Option>
              </Select>
            </Form.Item> */}
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
