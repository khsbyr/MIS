import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Checkbox,
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
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import PhoneNumber from '../../../../components/PhoneNumber';
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
import ContentWrapper from './organization.style';

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function OrganizationModal(props) {
  const {
    Orgcontroller,
    isModalVisible,
    isEditMode,
    isOrg = false,
    orgId,
  } = props;
  const [stateBank, setStateBank] = useState([]);
  const [stateCurrency, setStateCurrency] = useState([]);
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [responsibleUserID, setResponsibleUserID] = useState(null);
  const [role, setRole] = useState([]);
  const [, setRoleID] = useState([]);
  const [foundedDate, setFoundedDate] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState();

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const defaultFileList =
    Orgcontroller?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: Orgcontroller?.file?.fileName,
            status: 'done',
            url: Orgcontroller?.file?.path,
          },
        ]
      : [];

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
    getBase64(info.file.originFileObj, imageUrll => setImageUrl(imageUrll));
  }

  function onDateChange(date, value) {
    setFoundedDate(value);
  }

  useEffect(() => {
    getService('bank/get').then(result => {
      if (result) {
        setStateBank(result || []);
      }
    });

    getService('role/getAdmin').then(result => {
      if (result) {
        setRole(result || []);
      }
    });

    getService('currency/get').then(result => {
      if (result) {
        setStateCurrency(result.content || []);
      }
    });
    if (Orgcontroller !== undefined) {
      getService(
        `soum/getList/${
          Orgcontroller.address && Orgcontroller.address.aimag.id
        }`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${Orgcontroller.address && Orgcontroller.address.soum.id}`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
    if (isEditMode) {
      setImageUrl(Orgcontroller?.file?.path);
      setFoundedDate(Orgcontroller?.foundedYear);
      setResponsibleUserID(
        Orgcontroller?.responsibleUser && Orgcontroller.responsibleUser.id
      );
      setRoleID(Orgcontroller?.roleId);
      form.setFieldsValue({
        ...Orgcontroller,
        foundedYear: Orgcontroller ? Orgcontroller.foundedYear : '',
        bankID: Orgcontroller?.bank && Orgcontroller?.bank.id,
        Currency: Orgcontroller?.currency && Orgcontroller?.currency.id,
        CountryID: Orgcontroller?.address
          ? Orgcontroller?.address.country.id
          : '',
        AimagID: Orgcontroller?.address ? Orgcontroller?.address.aimag.id : '',
        SoumID: Orgcontroller?.address ? Orgcontroller?.address.soum.id : '',
        BagID: Orgcontroller?.address ? Orgcontroller?.address.bag.id : '',
        AddressDetail:
          Orgcontroller?.address && Orgcontroller?.address.addressDetail,
        RespoUserFirstName:
          Orgcontroller?.responsibleUser &&
          Orgcontroller?.responsibleUser.firstname,
        RespoUserLastName:
          Orgcontroller?.responsibleUser &&
          Orgcontroller?.responsibleUser.lastname,
        RespoUserRegister:
          Orgcontroller?.responsibleUser &&
          Orgcontroller?.responsibleUser.register,
        RespoUserPosition:
          Orgcontroller?.responsibleUser &&
          Orgcontroller?.responsibleUser.position,
        RespoUserPhone:
          Orgcontroller?.responsibleUser &&
          Orgcontroller?.responsibleUser.phoneNumber,
        RespoUserEmail:
          Orgcontroller?.responsibleUser &&
          Orgcontroller?.responsibleUser.email,
      });
    }
  }, []);

  const selectRole = value => {
    setRoleID(value);
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
        values.foundedYear = foundedDate;
        values.bank = { id: values.bankID };
        values.currency = { id: values.Currency };
        values.address = {
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
        };
        values.responsibleUser = {
          id: responsibleUserID,
          firstname: values.RespoUserFirstName,
          lastname: values.RespoUserLastName,
          register: values.RespoUserRegister,
          position: values.RespoUserPosition,
          phoneNumber: values.RespoUserPhone,
          email: values.RespoUserEmail,
        };
        if (isEditMode) {
          const url = orgId
            ? `organization/update/${orgId}`
            : `organization/update/${Orgcontroller.id}`;
          if (fileList[0]) {
            const serverApi = Orgcontroller.file
              ? updateFileServer(
                  `file/update/${Orgcontroller.file.id}`,
                  fileList[0]
                )
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.file = { id: response.data.id };
                putService(`${url}`, values)
                  .then(() => {
                    getService('organization/getAll').then(resultOrg => {
                      if (resultOrg) {
                        toolsStore.setOrgList(resultOrg || []);
                      }
                    });
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
            putService(`${url}`, values)
              .then(() => {
                getService('organization/getAll').then(resultOrg => {
                  if (resultOrg) {
                    toolsStore.setOrgList(resultOrg || []);
                  }
                });
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
              values.file = { id: response.data.id };
              postService('organization/post', values)
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
          postService('organization/post', values)
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

  const dateFormat = 'YYYY-MM-DD';

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Зураг оруулах</div>
    </div>
  );

  return (
    <div>
      <Modal
        title="Байгууллага бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1100}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
        cancelButtonProps={{ disabled: !!isOrg }}
        maskClosable={!isOrg}
        closable={!isOrg}
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
              <Col xs={24} md={24} lg={6}>
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
              <Col xs={24} md={24} lg={10}>
                <h2 className="title"> Байгууллагын мэдээлэл</h2>
                <Row gutter={32}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      layout="vertical"
                      name="name"
                      label="Байгууллагын нэр:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Регистрийн дугаар:"
                      name="registerNumber"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Байгуулагдсан он:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        onChange={onDateChange}
                        placeholder="Байгуулагдсан он"
                        style={{
                          height: '39px',
                          width: '100%',
                          borderRadius: '3px',
                        }}
                        defaultValue={
                          isEditMode && Orgcontroller?.foundedYear
                            ? moment(Orgcontroller?.foundedYear, dateFormat)
                            : null
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="БУБГД:"
                      name="certificateNumber"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Банкны нэр:"
                      name="bankID"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <AutoCompleteSelect valueField="id" data={stateBank} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Дансны нэр:"
                      name="accountName"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Дансны дугаар:"
                      name="accountNumber"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber type="number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Дансны вальют:"
                      name="Currency"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateCurrency}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Захиралын регистр:"
                      name="directorRegister"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Эрх:"
                      name="roleId"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={role}
                        onChange={value => selectRole(value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <h2 className="title">Холбоо барих мэдээлэл</h2>
                <Row gutter={32}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Улс:" name="CountryID">
                      <AutoCompleteSelect
                        defaultValue={[107]}
                        valueField="id"
                        data={toolsStore.countryList}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Аймаг, хот:" name="AimagID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={toolsStore.aimagList}
                        onChange={value => selectAimag(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="SoumID"
                      layout="vertical"
                      label="Сум, Дүүрэг:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateSum}
                        onChange={value => selectSum(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="BagID"
                      layout="vertical"
                      label="Баг, Хороо:"
                    >
                      <AutoCompleteSelect valueField="id" data={stateBag} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <PhoneNumber label="Утас:" name="phone" />
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Е-майл хаяг:" name="email">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item label="Веб хаяг:" name="web">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item label="Хаяг:" name="AddressDetail">
                      <Input.TextArea
                        style={{
                          width: '100%',
                          height: '110px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <h2 className="title">Хариуцсан ажилтан:</h2>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item
                      label="Овог:"
                      name="RespoUserLastName"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item
                      label="Нэр:"
                      name="RespoUserFirstName"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item
                      label="Регистрийн дугаар:"
                      name="RespoUserRegister"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input maxLength={10} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item label="Албан тушаал:" name="RespoUserPosition">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <PhoneNumber label="Утасны дугаар:" name="RespoUserPhone" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item
                      label="Е-майл хаяг:"
                      name="RespoUserEmail"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item label="Танилцуулга оруулах:">
                      <Upload {...props}>
                        <Button
                          icon={<UploadOutlined />}
                          style={{ height: '40px' }}
                        >
                          Танилцуулга оруулах
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={20}>
                    <Form.Item>
                      <Checkbox>Оруулсан мэдээлэл үнэн болно.</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
