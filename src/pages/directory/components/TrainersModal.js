import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AutoComplete,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { useToolsStore } from '../../../context/Tools';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/cv.styled';
import TrainersShowModal from './TrainersShowModal';
import { PATTERN_REGISTER } from '../../../constants/Pattern';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function TrainersModal(props) {
  const { Trainerscontroller, isModalVisible, isEditMode, trainerID } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const loadLazyTimeout = null;
  const [, setBirthDatee] = useState();
  const [, setIsOnchange] = useState(false);
  const [options, setOptions] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };

  useEffect(() => {
    onInit();
    if (Trainerscontroller !== null) {
      getService(`soum/getList/${Trainerscontroller.address.aimag.id}`).then(
        result => {
          if (result) {
            setStateSum(result || []);
          }
        }
      );
      getService(`bag/getList/${Trainerscontroller.address.soum.id}`).then(
        result => {
          if (result) {
            setStateBag(result || []);
          }
        }
      );
    }

    if (isEditMode) {
      form.setFieldsValue({
        ...Trainerscontroller,
        lastname: Trainerscontroller.lastname,
        firstname: Trainerscontroller.firstname,
        registerNumber: Trainerscontroller.register,
        phoneNumber: Trainerscontroller.phoneNumber,
        email: Trainerscontroller.email,
        OrganizationName: Trainerscontroller.orgName,
        AddressDetail: Trainerscontroller.address
          ? Trainerscontroller.address.addressDetail
          : '',
        CountryID: Trainerscontroller.address
          ? Trainerscontroller.address.country.id
          : '',
        AimagID: Trainerscontroller.address
          ? Trainerscontroller.address.aimag.id
          : '',
        SoumID: Trainerscontroller.address
          ? Trainerscontroller.address.soum.id
          : '',
        BagID: Trainerscontroller.address
          ? Trainerscontroller.address.bag.id
          : '',
        purpose: Trainerscontroller.trainers.purpose,
        skill: Trainerscontroller.trainers.skill,
      });
    }
  }, []);

  const selectUser = (value, option) => {
    setIsOnchange(true);
    getService(`user/get/${option.key}`, {}).then(result => {
      if (result) {
        const selectedUser = result;
        setBirthDatee(selectedUser.birthDate);
        getService(`soum/getList/${selectedUser.address?.aimag?.id}`).then(
          result1 => {
            if (result1) {
              setStateSum(result1 || []);
            }
          }
        );
        getService(`bag/getList/${selectedUser.address?.soum?.id}`).then(
          result2 => {
            if (result2) {
              setStateBag(result2 || []);
            }
          }
        );
        form.setFieldsValue({
          ...selectedUser,
          CountryID: selectedUser.address
            ? selectedUser.address.country.id
            : '',
          AimagID: selectedUser.address ? selectedUser.address.aimag.id : '',
          SoumID: selectedUser.address ? selectedUser.address.soum.id : '',
          BagID: selectedUser.address ? selectedUser.address.bag.id : '',
          AddressDetail: selectedUser.address
            ? selectedUser.address.addressDetail
            : '',
        });
      }
    });
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

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainers = {
          purpose: values.purpose,
          skill: values.skill,
        };
        values.user = {
          // id: userID,
          firstname: values.firstname,
          lastname: values.lastname,
          register: values.registerNumber,
          phoneNumber: values.phoneNumber,
          email: values.email,
          isTrue: true,
          address: {
            addressDetail: values.AddressDetail,
            country: {
              id: 107,
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
          },
        };

        if (isEditMode) {
          putService(
            `trainers/update/${Trainerscontroller.trainers.id}`,
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
          postService('trainers/post', values)
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

  const handleSearch = value => {
    getService(`user/getAllTrainerUserList?search=register:${value}*`).then(
      result => {
        if (result) {
          setOptions(result.content);
        }
      },
      500
    );
  };

  return (
    <div>
      <Modal
        title="Сургалтын баг бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1200}
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
            <h2 className="title">1. Хувь хүний мэдээлэл</h2>
            <Row gutter={[30, 30]}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                      pattern: PATTERN_REGISTER,
                      message: 'Регистрийн дугаар буруу байна',
                    },
                  ]}
                >
                  <AutoComplete
                    placeholder="Регистрын дугаар"
                    onSelect={selectUser}
                    onSearch={handleSearch}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    notFoundContent={null}
                  >
                    {options.map(value => (
                      <Option key={value.id} value={value.register}>
                        {value.register}
                      </Option>
                    ))}
                  </AutoComplete>
                </Form.Item>
                <Form.Item name="lastname">
                  <Input className="FormItem" placeholder="Овог:" />
                </Form.Item>

                <Form.Item name="firstname">
                  <Input className="FormItem" placeholder="Нэр:" />
                </Form.Item>
                <Form.Item name="phoneNumber">
                  <InputNumber
                    parser={value => value.substring(0, 12)}
                    type="number"
                    className="FormItem"
                    placeholder="Утас, факс:"
                    prefix={<FontAwesomeIcon icon={faPhone} />}
                  />
                </Form.Item>
                <Form.Item name="email">
                  <Input className="FormItem" placeholder="И-мэйл хаяг:" />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={12}>
                <Form.Item name="CountryID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Улс сонгох"
                    defaultValue={107}
                    valueField="id"
                    data={toolsStore.countryList}
                  />
                </Form.Item>
                <Form.Item name="AimagID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Аймаг, хот сонгох"
                    valueField="id"
                    data={toolsStore.aimagList}
                    onChange={value => selectAimag(value)}
                  />
                </Form.Item>
                <Form.Item name="SoumID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Сум, дүүрэг сонгох"
                    valueField="id"
                    data={stateSum}
                    onChange={value => selectSum(value)}
                  />
                </Form.Item>
                <Form.Item name="BagID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Баг, хороо сонгох"
                    valueField="id"
                    data={stateBag}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <h2 className="title">1. Гүйцэтгэх үүрэг</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="mission">
                  <Input.TextArea
                    placeholder="(Гүйцэтгэх үүргээ бичнэ үү)"
                    style={{
                      width: '100%',
                      height: '100px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row> */}
            <h2 className="title">1. Ажлын зорилго</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="purpose">
                  <Input.TextArea
                    placeholder="(Горилж буй ажлын зорилгоо товч бичнэ үү)"
                    style={{
                      width: '100%',
                      height: '100px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h2 className="title">2. Ур чадвар</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="skill">
                  <Input.TextArea
                    placeholder="(Өөрийн давуу тал, ур чадвараа нэрлэнэ үү)"
                    style={{
                      width: '100%',
                      height: '100px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>{' '}
            <h2 className="title">3. Дэлгэрэнгүй хаяг</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="AddressDetail">
                  <Input.TextArea
                    placeholder="(Дэлгэрэнгүй хаягаа оруулна уу)"
                    style={{
                      width: '100%',
                      height: '100px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {isEditMode ? (
              <TrainersShowModal
                Trainerscontroller={Trainerscontroller}
                isModalVisible={isModalVisible}
                isEditMode={isEditMode}
                trainerID={trainerID}
              />
            ) : null}
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}