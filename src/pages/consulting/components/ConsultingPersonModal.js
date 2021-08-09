import { InboxOutlined } from '@ant-design/icons';
import { faCalendarAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Upload,
} from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { ToolsContext } from '../../../context/Tools';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/cv.styled';
import ConsultingShowModal from './ConsultingShowModal';

const { Dragger } = Upload;
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function ConsultingPersonModal(props) {
  const { Trainerscontroller, isModalVisible, isEditMode, trainerID, orgId } =
    props;
  const [form] = Form.useForm();
  const toolsStore = useContext(ToolsContext);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const loadLazyTimeout = null;
  const [userID, setUserID] = useState();
  const [BirthDatee] = useState();
  const [changedBirthDate, setChangedBirthDate] = useState();
  const [personID, setPersonID] = useState();
  function onBirthDateChange(date, value) {
    setChangedBirthDate(value);
  }
  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    // getService('trainers/get', list)
    //   .then(result => {
    //     const listResult = result.content || [];
    //     listResult.forEach((item, index) => {
    //       item.index = lazyParams.page * PAGESIZE + index + 1;
    //     });
    //     setList(listResult);
    //     setSelectedRows([]);
    //   })
    //   .finally(toolsStore.setIsShowLoader(false))
    //   .catch(error => {
    //     errorCatch(error);
    //     toolsStore.setIsShowLoader(false);
    //   });
  };
  useEffect(() => {
    onInit();
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
      setChangedBirthDate(Trainerscontroller.birthDate);
      setUserID(Trainerscontroller.id);
      form.setFieldsValue({
        ...Trainerscontroller,
        lastname: Trainerscontroller.lastname,
        firstname: Trainerscontroller.firstname,
        registerNumber: Trainerscontroller.register,
        phoneNumber: Trainerscontroller.phoneNumber,
        email: Trainerscontroller.email,
        OrganizationName: Trainerscontroller.orgName,
        birthDateNew: Trainerscontroller.birthDate,
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
        // purpose: Trainerscontroller.trainers.purpose,
        // skill: Trainerscontroller.trainers.skill,
      });
    }
  }, []);

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

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          values.id = userID;
          values.birthDate = changedBirthDate;
          values.address = {
            addressDetail: values.AddressDetail,
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
          putService(`user/update/${Trainerscontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          values.person = { id: personID };
          values.user = {
            id: userID,
            firstname: values.firstname,
            lastname: values.lastname,
            register: values.registerNumber,
            phoneNumber: values.phoneNumber,
            email: values.email,
            address: {
              addressDetail: values.AddressDetail,
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
            },
          };
          postService(`person/post`, values)
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
        title="Зөвлөх хувь хүн бүртгэх"
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
              <Col xs={24} md={24} lg={4}>
                <Dragger {...props} style={{}}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-hint">Зураг оруулах</p>
                </Dragger>
              </Col>
              <Col xs={24} md={24} lg={2} />
              <Col xs={24} md={24} lg={9}>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {/* <AutoComplete
                    placeholder="Регистрын дугаар"
                    onSelect={selectUser}
                    filterOption={(inputValue, option) =>
                      option.children
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                    // onChange={value => console.log(value)}
                  >
                    {options.map(value => (
                      <Option key={value.id} value={value.register}>
                        {value.register}
                      </Option>
                    ))}
                  </AutoComplete> */}
                  <Input className="FormItem" placeholder="Регистр:" />
                </Form.Item>
                <Form.Item name="lastname">
                  <Input
                    className="FormItem"
                    placeholder="Овог:"
                    // prefix={<FontAwesomeIcon icon={faUser} />}
                  />
                </Form.Item>

                <Form.Item name="firstname">
                  <Input
                    className="FormItem"
                    placeholder="Нэр:"
                    // prefix={<FontAwesomeIcon icon={faUser} />}
                  />
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
                  <Input
                    className="FormItem"
                    placeholder="И-мэйл хаяг:"
                    // prefix={<FontAwesomeIcon icon={faEnvelope} />}
                  />
                </Form.Item>
                {/* <Form.Item name="OrganizationName">
                  <OrgaStyle>
                    <AutoCompleteSelect
                      valueField="id"
                      placeholder="Байгууллага сонгох"
                      data={stateOrg}
                      onChange={value => selectOrg(value)}
                    />
                  </OrgaStyle>
                </Form.Item> */}
              </Col>

              <Col xs={24} md={24} lg={9}>
                <Form.Item>
                  <DatePicker
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="Төрсөн он, сар, өдөр"
                    className="FormItem"
                    onChange={onBirthDateChange}
                    defaultValue={
                      isEditMode
                        ? Trainerscontroller &&
                          moment(Trainerscontroller.birthDate)
                        : BirthDatee
                    }
                  />
                </Form.Item>
                <Form.Item name="CountryID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Улс сонгох"
                    valueField="id"
                    data={stateCountry}
                    onChange={value => selectCountry(value)}
                  />
                </Form.Item>
                <Form.Item name="AimagID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Аймаг, хот сонгох"
                    valueField="id"
                    data={stateAimag}
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
            {/* <h2 className="title">1. Ажлын зорилго</h2>
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
            </Row>{' '} */}
            <h2 className="title">1. Дэлгэрэнгүй хаяг</h2>
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
              <ConsultingShowModal
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
