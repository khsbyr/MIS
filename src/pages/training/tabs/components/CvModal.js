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
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import { useToolsStore } from '../../../../context/Tools';
import { useTrainingStore } from '../../../../context/TrainingContext';
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
import { PATTERN_REGISTER } from '../../../../constants/Pattern';

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
  const { Trainerscontroller, isModalVisible, isEditMode, trainerID } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const loadLazyTimeout = null;
  const [, setBirthDatee] = useState();
  const [, setIsOnchange] = useState(false);
  const [options, setOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const { TrainingList } = useTrainingStore();

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const defaultFileList =
    Trainerscontroller?.user?.trainers?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: Trainerscontroller?.user?.trainers?.file?.fileName,
            status: 'done',
            url: Trainerscontroller?.user?.trainers?.file?.path,
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

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };

  useEffect(() => {
    onInit();
    if (Trainerscontroller !== null) {
      getService(
        `soum/getList/${Trainerscontroller.user.address.aimag.id}`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(`bag/getList/${Trainerscontroller.user.address.soum.id}`).then(
        result => {
          if (result) {
            setStateBag(result || []);
          }
        }
      );
    }

    if (isEditMode) {
      setImageUrl(Trainerscontroller.user.trainers.file.path);
      form.setFieldsValue({
        ...Trainerscontroller,
        lastname: Trainerscontroller.user.lastname,
        firstname: Trainerscontroller.user.firstname,
        registerNumber: Trainerscontroller.user.register,
        phoneNumber: Trainerscontroller.user.phoneNumber,
        email: Trainerscontroller.user.email,
        OrganizationName: Trainerscontroller.user.orgName,
        AddressDetail: Trainerscontroller.user.address
          ? Trainerscontroller.user.address.addressDetail
          : '',
        CountryID: Trainerscontroller.user.address
          ? Trainerscontroller.user.address.country.id
          : '',
        AimagID: Trainerscontroller.user.address
          ? Trainerscontroller.user.address.aimag.id
          : '',
        SoumID: Trainerscontroller.user.address
          ? Trainerscontroller.user.address.soum.id
          : '',
        BagID: Trainerscontroller.user.address
          ? Trainerscontroller.user.address.bag.id
          : '',
        purpose: Trainerscontroller.user.trainers.purpose,
        skill: Trainerscontroller.user.trainers.skill,
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
        values.trainingTeam = {
          mission: values.mission,
          training: { id: TrainingList.id },
          user: {
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
          },
        };

        if (isEditMode) {
          if (fileList[0]) {
            const serverApi =
              Trainerscontroller && Trainerscontroller.user.trainers.file
                ? updateFileServer(
                    `file/update/${Trainerscontroller.user.trainers.file.id}`,
                    fileList[0]
                  )
                : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.fileId = response.data.id;
                putService(
                  `trainingTeam/update/${Trainerscontroller.id}`,
                  values
                )
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
            putService(`trainingTeam/update/${Trainerscontroller.id}`, values)
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
              values.fileId = response.data.id;
              postService('trainingTeam/post', values)
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
          postService('trainingTeam/post', values)
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
        maskClosable={false}
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
                    <img src={imageUrl} style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
              <Col xs={24} md={24} lg={9}>
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
              </Col>
            </Row>
            <h2 className="title">1. Гүйцэтгэх үүрэг</h2>
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
            </Row>
            <h2 className="title">2. Ажлын зорилго</h2>
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
            <h2 className="title">3. Ур чадвар</h2>
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
            <h2 className="title">4. Дэлгэрэнгүй хаяг</h2>
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
