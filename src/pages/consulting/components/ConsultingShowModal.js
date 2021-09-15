import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Form, message, Modal, Row, Upload } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import CertificateModal from './CertificateModal';
import EducationModal from './EducationModal';
import ExperienceAdviceModal from './ExperienceAdviceModal';
import ExperienceModal from './ExperienceModal';
import MembershipModal from './MembershipModal';
import PublishedWorkModal from './PublishedWorkModal';
import TeacherExperienceModal from './TeacherExperienceModal';

let editRow;
let isEditModee;
let editRowEducation;
export default function ConsultingShowModal(props) {
  const { Trainerscontroller, isEditMode, trainerID } = props;
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
  const [selectedRows, setSelectedRows] = useState([]);
  const loadLazyTimeout = null;
  const [listEducation, setListEducation] = useState([]);
  const [listExperience, setListExperience] = useState([]);
  const [listExperienceAdvice, setListExperienceAdvice] = useState([]);
  const [listExperienceTeacher, setListExperienceTeacher] = useState([]);
  const [listPublishedWork, setListPublishedWork] = useState([]);
  const [listLicense, setListLicense] = useState([]);
  const [listMembership, setListMembership] = useState([]);
  const [, setUserID] = useState();
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [, setBirthDate] = useState([]);
  // const onInit = () => {
  //   toolsStore.setIsShowLoader(false);
  //   if (loadLazyTimeout) {
  //     clearTimeout(loadLazyTimeout);
  //   }
  //   // getService('trainers/get', list)
  //   //   .then(result => {
  //   //     const listResult = result.content || [];
  //   //     listResult.forEach((item, index) => {
  //   //       item.index = lazyParams.page * PAGESIZE + index + 1;
  //   //     });
  //   //     setList(listResult);
  //   //     setSelectedRows([]);
  //   //   })
  //   //   .finally(toolsStore.setIsShowLoader(false))
  //   //   .catch(error => {
  //   //     errorCatch(error);
  //   //     toolsStore.setIsShowLoader(false);
  //   //   });
  // };

  const onInitEducation = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    if (Trainerscontroller !== null) {
      getService(`education/getByPersonId/${Trainerscontroller.person.id}`)
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
      getService(`expierence/getByPersonId/${Trainerscontroller.person.id}`)
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
        `expierenceForAdvice/getByPersonId/${Trainerscontroller.person.id}`
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
        `expierenceForTeach/getByPersonId/${Trainerscontroller.person.id}`
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
      getService(`publishedWork/getByPersonId/${Trainerscontroller.person.id}`)
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
        `propertyLicense/getByPersonId/${Trainerscontroller.person.id}`
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
      getService(`membership/getByPersonId/${Trainerscontroller.person.id}`)
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

  const enrolledDate = row => (
    <>{moment(row && row.enrolledDate).format('YYYY-M-D')}</>
  );

  const graduatedDate = row => (
    <>{moment(row && row.graduatedDate).format('YYYY-M-D')}</>
  );

  const hiredDate = row => (
    <>{moment(row && row.hiredDate).format('YYYY-M-D')}</>
  );

  const firedDate = row => (
    <>{moment(row && row.firedDate).format('YYYY-M-D')}</>
  );

  const publishedDate = row => (
    <>{moment(row && row.publishedDate).format('YYYY-M-D')}</>
  );

  const licensedDate = row => (
    <>{moment(row && row.licensedDate).format('YYYY-M-D')}</>
  );

  useEffect(() => {
    // onInit();
    onInitEducation();
    onInitExperience();
    onInitExperienceAdvice();
    onInitExperienceTeacher();
    onInitPublishedWork();
    onInitLicense();
    onInitMembership();

    if (isEditMode) {
      setBirthDate(Trainerscontroller.birthDate);
      setUserID(Trainerscontroller.id);
      form.setFieldsValue({
        ...Trainerscontroller,
        lastName: Trainerscontroller.lastname,
        firstName: Trainerscontroller.firstname,
        registerNumber: Trainerscontroller.register,
        phoneNumber: Trainerscontroller.phoneNumber,
        email: Trainerscontroller.email,
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
  }, [lazyParams]);

  const edit = row => {
    editRowEducation = row;
    isEditModee = true;
    setIsModalVisibleEducation(true);
  };

  const add = () => {
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
        onInitEducation();
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
    if (isSuccess) onInitEducation();
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
        onInitExperience();
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
    if (isSuccess) onInitExperience();
  };

  const editExperienceAdvice = row => {
    editRow = row;
    isEditModee = true;
    setIsModalVisibleExperienceAdvice(true);
  };

  const handleDeletedExperienceAdvice = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`expierenceForAdvice/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitExperienceAdvice();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmExperienceAdvice(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedExperienceAdvice(row);
        onInitExperienceAdvice();
      },
      onCancel() {},
    });
  }

  const popExperienceAdvice = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmExperienceAdvice(row);
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
    if (isSuccess) onInitExperienceAdvice();
  };

  const editTeacherExperience = row => {
    editRow = row;
    isEditModee = true;
    setIsModalVisibleTeacherExperience(true);
  };

  const handleDeletedTeacherExperience = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`expierenceForTeach/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitExperienceTeacher();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmTeacherExperience(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedTeacherExperience(row);
        onInitExperienceTeacher();
      },
      onCancel() {},
    });
  }

  const popTeacherExperience = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmTeacherExperience(row);
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
    if (isSuccess) onInitExperienceTeacher();
  };

  const editPublishedWork = row => {
    editRow = row;
    isEditModee = true;
    setIsModalVisiblePublishedWork(true);
  };

  const handleDeletedPublishedWork = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`publishedWork/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitPublishedWork();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmPublishedWork(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedPublishedWork(row);
        onInitPublishedWork();
      },
      onCancel() {},
    });
  }

  const popPublishedWork = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmPublishedWork(row);
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
    if (isSuccess) onInitPublishedWork();
  };

  const editCertificate = row => {
    editRow = row;
    isEditModee = true;
    setIsModalVisibleCertificate(true);
  };

  const handleDeletedLicense = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`propertyLicense/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitLicense();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmCertificate(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedLicense(row);
        onInitLicense();
      },
      onCancel() {},
    });
  }

  const popCertificate = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmCertificate(row);
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
    if (isSuccess) onInitLicense();
  };

  const editMembership = row => {
    editRow = row;
    isEditModee = true;
    setIsModalVisibleMembership(true);
  };

  const handleDeletedMembership = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`membership/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInitMembership();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmMembership(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedMembership(row);
        onInitMembership();
      },
      onCancel() {},
    });
  }

  const popMembership = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmMembership(row);
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
    if (isSuccess) onInitMembership();
  };

  return (
    <div>
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
            <Column field="universityName" header="Их дээд сургуулийн нэр" />
            <Column
              field="enrolledDate"
              header="Элссэн огноо"
              body={enrolledDate}
            />
            <Column
              field="graduatedDate"
              header="Төгссөн огноо"
              body={graduatedDate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisibleEducation && (
            <EducationModal
              CvEducationController={editRowEducation}
              isModalVisibleEducation={isModalVisibleEducation}
              close={closeModal}
              isEditMode={isEditModee}
              trainerID={trainerID}
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
            <Column
              field="hiredDate"
              header="Ажилд орсон огноо"
              body={hiredDate}
            />
            <Column
              field="firedDate"
              header="Ажлаас гарсан огноо"
              body={firedDate}
            />
            <Column headerStyle={{ width: '7rem' }} body={actionExperience} />
          </DataTable>
          {isModalVisibleExperience && (
            <ExperienceModal
              CvExperienceController={editRow}
              isModalVisibleExperience={isModalVisibleExperience}
              close={closeModalExperience}
              isEditMode={isEditModee}
              trainerID={trainerID}
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
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" header="№" style={{ width: '50px' }} />
            <Column field="position" header="Албан тушаал" />
            <Column field="organizationName" header="Байгууллагын нэр" />
            <Column
              field="hiredDate"
              header="Ажилд орсон огноо"
              body={hiredDate}
            />
            <Column
              field="firedDate"
              header="Ажлаас гарсан огноо"
              body={firedDate}
            />
            <Column
              headerStyle={{ width: '7rem' }}
              body={actionExperienceAdvice}
            />
          </DataTable>
          {isModalVisibleExperienceAdvice && (
            <ExperienceAdviceModal
              ExperienceAdviceController={editRow}
              isModalVisible={isModalVisibleExperienceAdvice}
              close={closeModalExperienceAdvice}
              isEditMode={isEditModee}
              trainerID={trainerID}
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
            value={listExperienceTeacher}
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
            <Column
              field="hiredDate"
              header="Ажилд орсон огноо"
              body={hiredDate}
            />
            <Column
              field="firedDate"
              header="Ажлаас гарсан огноо"
              body={firedDate}
            />
            <Column
              headerStyle={{ width: '7rem' }}
              body={actionTeacherExperience}
            />
          </DataTable>
          {isModalVisibleTeacherExperience && (
            <TeacherExperienceModal
              TeacherExperienceController={editRow}
              isModalVisible={isModalVisibleTeacherExperience}
              close={closeModalTeacherExperience}
              isEditMode={isEditModee}
              trainerID={trainerID}
            />
          )}
        </Col>
      </Row>

      <h2 className="title">
        7. Хэвлүүлсэн бүтээл (Эрдэм шинжилгээ, судалгааны бүтээл, ном гарын
        авлага, хэлэлцүүлсэн илтгэлүүд ){' '}
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
            value={listPublishedWork}
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
            <Column field="name" header="Бүтээлийн нэр" />
            <Column field="publishedDate" header="Огноо" body={publishedDate} />
            <Column
              headerStyle={{ width: '7rem' }}
              body={actionPublishedWork}
            />
          </DataTable>
          {isModalVisiblePublishedWork && (
            <PublishedWorkModal
              PublishedWorkController={editRow}
              isModalVisible={isModalVisiblePublishedWork}
              close={closeModalPublishedWork}
              isEditMode={isEditModee}
              trainerID={trainerID}
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
            value={listLicense}
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
            <Column
              field="propertyName"
              header="Оюуны өмч, гэрчилгээ, лицензийн нэр"
            />
            <Column field="licensedBy" header="Олгосон байгууллагын нэр" />
            <Column field="licensedDate" header="Огноо" body={licensedDate} />
            <Column headerStyle={{ width: '7rem' }} body={actionCertificate} />
          </DataTable>
          {isModalVisibleCertificate && (
            <CertificateModal
              LicenseController={editRow}
              isModalVisible={isModalVisibleCertificate}
              close={closeModalCertificate}
              isEditMode={isEditModee}
              trainerID={trainerID}
            />
          )}
        </Col>
      </Row>

      <h2 className="title">
        9. Гишүүнчлэл (Олон нийтийн болон төрийн бус байгууллагын гишүүн эсэх){' '}
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
            value={listMembership}
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
            <Column field="organization" header="Байгууллагын нэр" />
            <Column field="enrolledDate" header="Огноо" body={enrolledDate} />
            <Column headerStyle={{ width: '7rem' }} body={actionMembership} />
          </DataTable>
          {isModalVisibleMembership && (
            <MembershipModal
              MembershipController={editRow}
              isModalVisible={isModalVisibleMembership}
              close={closeModalMembership}
              isEditMode={isEditModee}
              trainerID={trainerID}
            />
          )}
        </Col>
      </Row>
      <h2 className="title">10. Тайлан </h2>
      <Row>
        <Col xs={24} md={24} lg={24}>
          <Form.Item>
            <Upload {...props}>
              <Button
                icon={<UploadOutlined />}
                style={{ height: '40px', width: '300px' }}
              >
                Тайлан оруулах
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
