import { UploadOutlined } from '@ant-design/icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { useToolsStore } from '../../../context/Tools';
import {
  getService,
  postService,
  putService,
  updateFileServer,
  writeFileServer,
} from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/cv.styled';
import VeterinarianEducation from './veterinarianEducation';
import VeterinarianExperience from './veterinarianExperience';

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function veterinarianProjectModal(props) {
  const { EditRow, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const loadLazyTimeout = null;
  const [userID, setUserID] = useState();
  const [fileList, setFileList] = useState([]);
  const [orgList, setOrgList] = useState();
  const [selectedOrgId, setSelectedOrgId] = useState();

  const defaultFileList =
    EditRow?.youngDoctor?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: EditRow?.youngDoctor?.file?.fileName,
            status: 'done',
            url: EditRow?.youngDoctor?.file?.path,
          },
        ]
      : [];

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
  }

  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };
  useEffect(() => {
    onInit();
    getService(`organization/getByType/2`).then(result => {
      if (result) {
        setOrgList(result.content || []);
      }
    });
    if (EditRow !== null) {
      getService(`soum/getList/${EditRow.address?.aimag.id}`).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(`bag/getList/${EditRow.address?.soum.id}`).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }
    if (isEditMode) {
      setUserID(EditRow.id);
      setSelectedOrgId(EditRow.youngDoctor.organization.id);
      form.setFieldsValue({
        ...EditRow,
        lastname: EditRow.lastname,
        firstname: EditRow.firstname,
        registerNumber: EditRow.register,
        phoneNumber: EditRow.phoneNumber,
        email: EditRow.email,
        OrganizationName: EditRow.orgName,
        purpose: EditRow.youngDoctor ? EditRow.youngDoctor.purpose : '',
        AddressDetail: EditRow.address ? EditRow.address.addressDetail : '',
        CountryID: EditRow.address ? EditRow.address.country.id : '',
        AimagID: EditRow.address ? EditRow.address.aimag.id : '',
        SoumID: EditRow.address ? EditRow.address.soum.id : '',
        BagID: EditRow.address ? EditRow.address.bag.id : '',
        OrgID: EditRow?.youngDoctor?.organization?.id,
      });
    }
  }, []);

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

  const selectOrg = value => {
    setSelectedOrgId(value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
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
            const serverApi = EditRow.youngDoctor.file
              ? updateFileServer(
                  `file/update/${EditRow.youngDoctor.file.id}`,
                  fileList[0]
                )
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.youngDoctor = {
                  purpose: values.purpose,
                  file: { id: response.data.id },
                  organization: { id: selectedOrgId },
                };
                putService(`user/update/${EditRow.id}`, values)
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
            values.youngDoctor = {
              purpose: values.purpose,
              organization: { id: selectedOrgId },
            };
            putService(`user/update/${EditRow.id}`, values)
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
              values.user = {
                firstname: values.firstname,
                lastname: values.lastname,
                register: values.registerNumber,
                phoneNumber: values.phoneNumber,
                email: values.email,
                roleId: 15,
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
              values.youngDoctor = {
                purpose: values.purpose,
                organization: { id: selectedOrgId },
                file: { id: response.data.id },
              };
              postService(`youngDoctor/post`, values)
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
          values.user = {
            firstname: values.firstname,
            lastname: values.lastname,
            register: values.registerNumber,
            phoneNumber: values.phoneNumber,
            email: values.email,
            roleId: 15,
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
          values.youngDoctor = {
            purpose: values.purpose,
            organization: { id: selectedOrgId },
          };
          postService(`youngDoctor/post`, values)
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
        title="Залуу малын эмч бүртгэх"
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
              {/* <Col xs={24} md={24} lg={4}>
                <Dragger {...props} style={{}}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-hint">Зураг оруулах</p>
                </Dragger>
              </Col>
              <Col xs={24} md={24} lg={2} /> */}
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input className="FormItem" placeholder="Регистр:" />
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
                    defaultValue={[107]}
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
                <Form.Item name="OrgID">
                  <AutoCompleteSelect
                    className="FormItem"
                    placeholder="Байгууллага сонгох"
                    valueField="id"
                    data={orgList}
                    onChange={value => selectOrg(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h2 className="title">1. Дэлгэрэнгүй хаяг</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="AddressDetail">
                  <Input.TextArea
                    placeholder="(Ажлын зорилгоо оруулна уу)"
                    style={{
                      width: '100%',
                      height: '100px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h2 className="title">2. Ажлын зорилго</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="purpose">
                  <Input.TextArea
                    placeholder="(Ажлын зорилгоо оруулна уу)"
                    style={{
                      width: '100%',
                      height: '100px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h2 className="title">3. Тайлан</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Upload
                  accept="image/*,.pdf"
                  maxCount={1}
                  defaultFileList={[...defaultFileList]}
                  customRequest={dummyRequest}
                  onChange={handleUpload}
                >
                  <Button icon={<UploadOutlined />}>Файл хавсаргах</Button>
                </Upload>
              </Col>
            </Row>
            {isEditMode ? (
              <Row>
                <Col xs={24} md={24} lg={24}>
                  <VeterinarianEducation
                    youngDoctorID={EditRow?.youngDoctor.id}
                  />
                </Col>
                <Col xs={24} md={24} lg={24}>
                  <VeterinarianExperience
                    youngDoctorID={EditRow?.youngDoctor.id}
                  />
                </Col>
              </Row>
            ) : (
              ''
            )}

            <Row />
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
