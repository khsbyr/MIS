/* eslint-disable no-console */
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import {
  faCalendarAlt,
  faEnvelope,
  faPen,
  faPhone,
  faPlus,
  faTrash,
  faUser,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Upload,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
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
import CertificateModal from './CertificateModal';
import ExperienceAdviceModal from './ExperienceAdviceModal';
import ContentWrapper from './cv.styled';
import EducationModal from './EducationModal';
import ExperienceModal from './ExperienceModal';
import MembershipModal from './MembershipModal';
import PublishedWorkModal from './PublishedWorkModal';
import TeacherExperienceModal from './TeacherExperienceModal';

const { Dragger } = Upload;
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

let editRow;
let isEditModee;
let editRowEducation;
export default function CvModal(props) {
  const { Trainerscontroller, isModalVisible, isEditMode, orgId } = props;
  const [isModalVisibleEducation, setIsModalVisibleEducation] = useState(false);
  const [isModalVisibleExperience, setIsModalVisibleExperience] =
    useState(false);
  const [isModalVisibleExperienceAdvice, setIsModalVisibleExperienceAdvice] =
    useState(false);
  const [isModalVisibleTeacherExperience, setIsModalVisibleTeacherExperience] =
    useState(false);
  const [isModalVisiblePublishedWork, setIsModalVisiblePublishedWork] =
    useState(false);
  const [isModalVisibleCertificate, setIsModalVisibleCertificate] =
    useState(false);
  const [isModalVisibleMembership, setIsModalVisibleMembership] =
    useState(false);
  const [form] = Form.useForm();
  const toolsStore = useContext(ToolsContext);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [listExperienceAdvice, setListExperienceAdvice] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [birthDate, setBirthDate] = useState([]);

  function onBirthDateChange(date, value) {
    console.log(date, value);
    setBirthDate(value);
  }
  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainers/get', list)
      .then(result => {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  const onInitEducation = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(
        `education/getByTrainerId/${Trainerscontroller.id}`,
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
        `expierence/getByTrainerId/${Trainerscontroller.id}`,
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

  useEffect(() => {
    onInit();
    onInitEducation();
    onInitExperience();
    onInitExperienceAdvice();
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
      setBirthDate(Trainerscontroller.birthDate);
      form.setFieldsValue({
        ...Trainerscontroller,
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
      });
    }
  }, [lazyParams]);

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

  const edit = row => {
    editRowEducation = row;
    isEditModee = true;
    setIsModalVisibleEducation(true);
  };

  const add = () => {
    editRowEducation = null;
    setIsModalVisibleEducation(true);
    isEditModee = false;
  };

  const handleDeletedEducation = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`education/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitExperience();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmEducation(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedEducation(row);
        onInitEducation();
      },
      onCancel() {},
    });
  }

  const pop = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmEducation(row);
    }
  };

  const action = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => edit(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => pop(row)}
      />
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisibleEducation(false);
    if (isSuccess) onInit();
  };

  const editExperience = row => {
    editRow = row;
    isEditModee = true;
    setIsModalVisibleExperience(true);
  };

  const handleDeletedExperience = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`expierence/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitExperience();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirm(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedExperience(row);
        onInit();
      },
      onCancel() {},
    });
  }

  const popExperience = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  const actionExperience = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editExperience(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popExperience(row)}
      />
    </>
  );

  const addExperience = () => {
    setIsModalVisibleExperience(true);
    isEditModee = false;
  };

  const closeModalExperience = (isSuccess = false) => {
    setIsModalVisibleExperience(false);
    if (isSuccess) onInit();
  };

  const editExperienceAdvice = row => {
    editRow = row.data;
    isEditModee = true;
    setIsModalVisibleExperienceAdvice(true);
  };

  const popExperienceAdvice = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };

  const actionExperienceAdvice = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editExperienceAdvice(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popExperienceAdvice(row)}
      />
    </>
  );

  const addExperienceAdvice = () => {
    setIsModalVisibleExperienceAdvice(true);
    isEditModee = false;
  };

  const closeModalExperienceAdvice = (isSuccess = false) => {
    setIsModalVisibleExperienceAdvice(false);
    if (isSuccess) onInit();
  };

  const editTeacherExperience = row => {
    editRow = row.data;
    isEditModee = true;
    setIsModalVisibleTeacherExperience(true);
  };

  const popTeacherExperience = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };
  const actionTeacherExperience = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editTeacherExperience(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popTeacherExperience(row)}
      />
    </>
  );

  const addTeacherExperience = () => {
    setIsModalVisibleTeacherExperience(true);
    isEditModee = false;
  };

  const closeModalTeacherExperience = (isSuccess = false) => {
    setIsModalVisibleTeacherExperience(false);
    if (isSuccess) onInit();
  };

  const editPublishedWork = row => {
    editRow = row.data;
    isEditModee = true;
    setIsModalVisiblePublishedWork(true);
  };

  const popPublishedWork = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };

  const actionPublishedWork = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editPublishedWork(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popPublishedWork(row)}
      />
    </>
  );

  const addPublishedWork = () => {
    setIsModalVisiblePublishedWork(true);
    isEditModee = false;
  };

  const closeModalPublishedWork = (isSuccess = false) => {
    setIsModalVisiblePublishedWork(false);
    if (isSuccess) onInit();
  };

  const editCertificate = row => {
    editRow = row.data;
    isEditModee = true;
    setIsModalVisibleCertificate(true);
  };

  const popCertificate = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };

  const actionCertificate = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editCertificate(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popCertificate(row)}
      />
    </>
  );

  const addCertificate = () => {
    setIsModalVisibleCertificate(true);
    isEditModee = false;
  };

  const closeModalCertificate = (isSuccess = false) => {
    setIsModalVisibleCertificate(false);
    if (isSuccess) onInit();
  };

  const editMembership = row => {
    editRow = row.data;
    isEditModee = true;
    setIsModalVisibleMembership(true);
  };

  const popMembership = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };

  const actionMembership = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => editMembership(row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => popMembership(row)}
      />
    </>
  );

  const addMembership = () => {
    setIsModalVisibleMembership(true);
    isEditModee = false;
  };

  const closeModalMembership = (isSuccess = false) => {
    setIsModalVisibleMembership(false);
    if (isSuccess) onInit();
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
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
        values.organization = { id: orgId };
        values.birthDate = birthDate;
        if (isEditMode) {
          putService(`trainers/update/${Trainerscontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('trainers/post', values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
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
                <Form.Item name="lastName">
                  <Input
                    className="FormItem"
                    placeholder="Овог:"
                    prefix={<FontAwesomeIcon icon={faUser} />}
                  />
                </Form.Item>

                <Form.Item name="firstName">
                  <Input
                    className="FormItem"
                    placeholder="Нэр:"
                    prefix={<FontAwesomeIcon icon={faUser} />}
                  />
                </Form.Item>
                <Form.Item name="registerNumber">
                  <Input
                    className="FormItem"
                    placeholder="Регистрийн дугаар:"
                    prefix={<FontAwesomeIcon icon={faUserEdit} />}
                  />
                </Form.Item>
                <Form.Item name="phoneNumber">
                  <Input
                    className="FormItem"
                    placeholder="Утас, факс:"
                    prefix={<FontAwesomeIcon icon={faPhone} />}
                  />
                </Form.Item>
                <Form.Item name="email">
                  <Input
                    className="FormItem"
                    placeholder="И-мэйл хаяг:"
                    prefix={<FontAwesomeIcon icon={faEnvelope} />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={9}>
                <Form.Item>
                  {/* <Input className="FormItem" placeholder="Төрсөн огноо:" prefix={<FontAwesomeIcon icon={faCalendarAlt} />} /> */}
                  <DatePicker
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="Төрсөн он, сар, өдөр"
                    className="FormItem"
                    onChange={onBirthDateChange}
                    defaultValue={
                      Trainerscontroller && moment(Trainerscontroller.birthDate)
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

            <h2 className="title">2. Ажлын зорилго</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="purpose">
                  <Input.TextArea
                    placeholder="(Горилж буй ажлын зорилгоо товч бичнэ үү)"
                    style={{
                      width: '100%',
                      height: '110px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <h2 className="title">
              3. Боловсрол{' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={add}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={listEducation}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  // onRowClick={edit}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="degree" header="Зэрэг, цол" />
                  <Column
                    field="universityName"
                    header="Их дээд сургуулийн нэр"
                  />
                  <Column field="enrolledDate" header="Элссэн огноо" />
                  <Column field="graduatedDate" header="Төгссөн огноо" />
                  <Column headerStyle={{ width: '7rem' }} body={action} />
                </DataTable>
                {isModalVisibleEducation && (
                  <EducationModal
                    CvEducationController={editRowEducation}
                    isModalVisibleEducation={isModalVisibleEducation}
                    close={closeModal}
                    isEditMode={isEditModee}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">
              4. Ажлын туршлага{' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addExperience}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={listExperience}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="position" header="Албан тушаал" />
                  <Column field="organizationName" header="Байгууллагын нэр" />
                  <Column field="hiredDate" header="Ажилд орсон огноо" />
                  <Column
                    headerStyle={{ width: '7rem' }}
                    body={actionExperience}
                  />
                </DataTable>
                {isModalVisibleExperience && (
                  <ExperienceModal
                    CvExperienceController={editRow}
                    isModalVisibleExperience={isModalVisibleExperience}
                    close={closeModalExperience}
                    isEditMode={isEditModee}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">
              5. Зөвлөх үйлчилгээний ажлын туршлага{' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addExperienceAdvice}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={listExperienceAdvice}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  // onRowClick={edit}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="position" header="Албан тушаал" />
                  <Column field="organizationName" header="Байгууллагын нэр" />
                  <Column field="hiredDate" header="Огноо" />
                  <Column
                    headerStyle={{ width: '7rem' }}
                    body={actionExperienceAdvice}
                  />
                </DataTable>
                {isModalVisibleExperienceAdvice && (
                  <ExperienceAdviceModal
                    Criteriacontroller={editRow}
                    isModalVisible={isModalVisibleExperienceAdvice}
                    close={closeModalExperienceAdvice}
                    isEditMode={isEditModee}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">
              6. Багшийн ажлын туршлага{' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addTeacherExperience}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={list}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  // onRowClick={edit}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="name" header="Албан тушаал" />
                  <Column field="" header="Байгууллагын нэр" />
                  <Column field="" header="Огноо" />
                  <Column
                    headerStyle={{ width: '7rem' }}
                    body={actionTeacherExperience}
                  />
                </DataTable>
                {isModalVisibleTeacherExperience && (
                  <TeacherExperienceModal
                    Criteriacontroller={editRow}
                    isModalVisible={isModalVisibleTeacherExperience}
                    close={closeModalTeacherExperience}
                    isEditMode={isEditMode}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">
              7. Хэвлүүлсэн бүтээл (Эрдэм шинжилгээ, судалгааны бүтээл, ном
              гарын авлага, хэлэлцүүлсэн илтгэлүүд ){' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addPublishedWork}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={list}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  // onRowClick={edit}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="" header="Бүтээлийн нэр" />
                  <Column field="" header="Огноо" />
                  <Column
                    headerStyle={{ width: '7rem' }}
                    body={actionPublishedWork}
                  />
                </DataTable>
                {isModalVisiblePublishedWork && (
                  <PublishedWorkModal
                    Criteriacontroller={editRow}
                    isModalVisible={isModalVisiblePublishedWork}
                    close={closeModalPublishedWork}
                    isEditMode={isEditMode}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">
              8. Өөрийн нэр дээр бүртгэлтэй оюуны өмч, гэрчилгээ, лиценз, тусгай
              зөвшөөрөл{' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addCertificate}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={list}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  // onRowClick={edit}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="name" header="Албан тушаал" />
                  <Column field="" header="Байгууллагын нэр" />
                  <Column field="" header="Огноо" />
                  <Column
                    headerStyle={{ width: '7rem' }}
                    body={actionCertificate}
                  />
                </DataTable>
                {isModalVisibleCertificate && (
                  <CertificateModal
                    Criteriacontroller={editRow}
                    isModalVisible={isModalVisibleCertificate}
                    close={closeModalCertificate}
                    isEditMode={isEditMode}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">
              9. Гишүүнчлэл (Олон нийтийн болон төрийн бус байгууллагын гишүүн
              эсэх){' '}
              <Button
                type="text"
                className="export"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addMembership}
                style={{ float: 'right' }}
              >
                Нэмэх
              </Button>
            </h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <DataTable
                  value={list}
                  removableSort
                  rows={10}
                  className="p-datatable-responsive-demo"
                  selection={selectedRows}
                  // onRowClick={edit}
                  onSelectionChange={e => {
                    setSelectedRows(e.value);
                  }}
                  dataKey="id"
                >
                  <Column field="index" header="№" style={{ width: '50px' }} />
                  <Column field="name" header="Албан тушаал" />
                  <Column field="" header="Байгууллагын нэр" />
                  <Column field="" header="Огноо" />
                  <Column
                    headerStyle={{ width: '7rem' }}
                    body={actionMembership}
                  />
                </DataTable>
                {isModalVisibleMembership && (
                  <MembershipModal
                    Criteriacontroller={editRow}
                    isModalVisible={isModalVisibleMembership}
                    close={closeModalMembership}
                    isEditMode={isEditMode}
                  />
                )}
              </Col>
            </Row>

            <h2 className="title">10. Ур чадвар</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="skill">
                  <Input.TextArea
                    placeholder="(Өөрийн давуу тал, ур чадвараа нэрлэнэ үү)"
                    style={{
                      width: '100%',
                      height: '140px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <h2 className="title">11. Хаягийн дэлгэрэнгүй</h2>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Form.Item name="AddressDetail">
                  <Input.TextArea
                    placeholder="(Дэлгэрэнгүй хаягаа оруулна уу)"
                    style={{
                      width: '100%',
                      height: '140px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
