import { InboxOutlined } from '@ant-design/icons';
import { faCalendarAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AutoComplete,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import { ToolsContext } from '../../../../context/Tools';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './cv.styled';
import CvShowModal from './CvShowModal';

// import { colourOptions } from '../data';

const { Dragger } = Upload;
const { Option } = Select;
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function CvModal(props) {
  const { Trainerscontroller, isModalVisible, isEditMode, trainerID, orgId } =
    props;
  const [form] = Form.useForm();
  const toolsStore = useContext(ToolsContext);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [, setSelectedRows] = useState([]);
  const loadLazyTimeout = null;
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [listExperienceAdvice, setListExperienceAdvice] = useState([]);
  const [listExperienceTeacher, setListExperienceTeacher] = useState([]);
  const [listPublishedWork, setListPublishedWork] = useState([]);
  const [listLicense, setListLicense] = useState([]);
  const [listMembership, setListMembership] = useState([]);
  const [userID, setUserID] = useState();
  const [BirthDatee, setBirthDatee] = useState();
  const [, setStateOrg] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [changedBirthDate, setChangedBirthDate] = useState();
  const [, setIsOnchange] = useState(false);
  // const [isOnChange, setIsOnchange] = useState(false);
  const [options, setOptions] = useState([]);
  // const filter = createFilterOptions();

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
  const onInitEducation = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `education/getByTrainerId/${Trainerscontroller.trainers.id}`,
        listEducation
      )
        .then(result => {
          const listeducation = result || [];
          listeducation.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListEducation(listeducation);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  const onInitExperience = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `expierence/getByTrainerId/${Trainerscontroller.trainers.id}`,
        listExperience
      )
        .then(result => {
          const listexperience = result || [];
          listexperience.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListExperience(listexperience);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  const onInitExperienceAdvice = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `expierenceForAdvice/getByTrainerId/${Trainerscontroller.id}`,
        listExperienceAdvice
      )
        .then(result => {
          const listexperienceAdvice = result || [];
          listexperienceAdvice.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListExperienceAdvice(listexperienceAdvice);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  const onInitExperienceTeacher = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `expierenceForTeach/getByTrainerId/${Trainerscontroller.id}`,
        listExperienceTeacher
      )
        .then(result => {
          const listexperienceTeacher = result || [];
          listexperienceTeacher.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListExperienceTeacher(listexperienceTeacher);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  const onInitPublishedWork = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `publishedWork/getByTrainerId/${Trainerscontroller.id}`,
        listPublishedWork
      )
        .then(result => {
          const listpublishedWork = result || [];
          listpublishedWork.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListPublishedWork(listpublishedWork);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  const onInitLicense = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `propertyLicense/getByTrainerId/${Trainerscontroller.id}`,
        listLicense
      )
        .then(result => {
          const listlicense = result || [];
          listlicense.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListLicense(listlicense);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  const onInitMembership = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `membership/getByTrainerId/${Trainerscontroller.id}`,
        listMembership
      )
        .then(result => {
          const listmembership = result || [];
          listmembership.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setListMembership(listmembership);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  useEffect(() => {
    onInit();
    onInitEducation();
    onInitExperience();
    onInitExperienceAdvice();
    onInitExperienceTeacher();
    onInitPublishedWork();
    onInitLicense();
    onInitMembership();
    getService('organization/get').then(result => {
      if (result) {
        setStateOrg(result.content || []);
      }
    });
    getService(`user/getNotTrainerUserListByOrgId/${orgId}`).then(result => {
      if (result) {
        setOptions(result || []);
      }
    });
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
        purpose: Trainerscontroller.trainers.purpose,
        skill: Trainerscontroller.trainers.skill,
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

  const selectUser = (value, option) => {
    setIsOnchange(true);
    getService(`user/get/${option.key}`, {}).then(result => {
      if (result) {
        const selectedUser = result;
        setBirthDatee(selectedUser.birthDate);
        setUserID(selectedUser.id);
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
        values.organizationId = orgId;
        if (isEditMode) {
          values.trainers = { purpose: values.purpose, skill: values.skill };
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
          values.trainers = { purpose: values.purpose, skill: values.skill };
          values.user = {
            id: userID,
            firstname: values.firstname,
            lastname: values.lastname,
            register: values.registerNumber,
            phoneNumber: values.phoneNumber,
            email: values.email,
            birthDate: changedBirthDate,
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
          postService(`trainers/post`, values)
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
        title="Сургагч багшийн CV бүртгэх"
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
                  <AutoComplete
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
                  </AutoComplete>
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
              <CvShowModal
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
