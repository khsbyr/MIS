import { PlusOutlined } from '@ant-design/icons';
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
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import { useToolsStore } from '../../../../context/Tools';
import {
  getService,
  postService,
  putService,
  updateFileServer,
  writeFileServer,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './cv.styled';
import CvShowModal from './CvShowModal';

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

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
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const loadLazyTimeout = null;
  const [userID, setUserID] = useState();
  const [BirthDatee, setBirthDatee] = useState();
  const [, setIsOnchange] = useState(false);
  const [options, setOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const defaultFileList =
    Trainerscontroller?.trainers?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: Trainerscontroller?.trainers?.file?.fileName,
            status: 'done',
            url: Trainerscontroller?.trainers?.file?.path,
          },
        ]
      : [];

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
    getBase64(info.file.originFileObj, imageUrll => setImageUrl(imageUrll));
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Зураг оруулах</div>
    </div>
  );

  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };

  useEffect(() => {
    onInit();
    getService(`user/getNotTrainerUserListByOrgId/${orgId}`).then(result => {
      if (result) {
        setOptions(result || []);
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
      setImageUrl(Trainerscontroller?.trainers?.file?.path);
      setUserID(Trainerscontroller.id);
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
          values.id = userID;
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
          if (fileList[0]) {
            const serverApi = Trainerscontroller.trainers.file
              ? updateFileServer(
                  `file/update/${Trainerscontroller.trainers.file.id}`,
                  fileList[0]
                )
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.trainers = {
                  purpose: values.purpose,
                  skill: values.skill,
                  file: { id: response.data.id },
                };

                putService(`user/update/${Trainerscontroller.id}`, values)
                  .then(() => {
                    message.success('Амжилттай хадгаллаа');
                    props.close(true);
                  })
                  .catch(error => {
                    errorCatch(error);
                  });
              })
              .catch(error => {
                errorCatch(error);
              });
          } else {
            putService(`user/update/${Trainerscontroller.id}`, values)
              .then(() => {
                message.success('Амжилттай хадгаллаа');
                props.close(true);
              })
              .catch(error => {
                errorCatch(error);
              });
          }
        } else if (fileList[0]) {
          writeFileServer(`file/upload`, fileList[0])
            .then(response => {
              values.trainers = {
                purpose: values.purpose,
                skill: values.skill,
                file: { id: response.data.id },
              };
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
              postService(`trainers/post`, values)
                .then(() => {
                  message.success('Амжилттай хадгаллаа');
                  props.close(true);
                })
                .catch(error => {
                  errorCatch(error);
                });
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
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  accept="image/*,.pdf"
                  maxCount={1}
                  defaultFileList={[...defaultFileList]}
                  customRequest={dummyRequest}
                  onChange={handleUpload}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Зураг" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
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

              <Col xs={24} md={24} lg={9}>
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
                <Form.Item>
                  {isEditMode && (
                    <DatePicker
                      prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                      disabled
                      placeholder="Төрсөн он, сар, өдөр"
                      className="FormItem"
                      defaultValue={
                        isEditMode
                          ? Trainerscontroller &&
                            moment(Trainerscontroller.birthDate).zone(0)
                          : BirthDatee
                      }
                    />
                  )}
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
