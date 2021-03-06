import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Form, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import CertificateModal from '../../training/tabs/components/CertificateModal';
import EducationModal from '../../training/tabs/components/EducationModal';
import ExperienceAdviceModal from '../../training/tabs/components/ExperienceAdviceModal';
import ExperienceModal from '../../training/tabs/components/ExperienceModal';
import MembershipModal from '../../training/tabs/components/MembershipModal';
import PublishedWorkModal from '../../training/tabs/components/PublishedWorkModal';
import TeacherExperienceModal from '../../training/tabs/components/TeacherExperienceModal';

let editRow;
let isEditModee;
let editRowEducation;
export default function CvShowModal(props) {
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
      getService(`education/getByTrainerId/${Trainerscontroller.trainers.id}`)
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
      getService(`expierence/getByTrainerId/${Trainerscontroller.trainers.id}`)
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
        `expierenceForAdvice/getByTrainerId/${Trainerscontroller.trainers.id}`
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
        `expierenceForTeach/getByTrainerId/${Trainerscontroller.trainers.id}`
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
        `publishedWork/getByTrainerId/${Trainerscontroller.trainers.id}`
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
        `propertyLicense/getByTrainerId/${Trainerscontroller.trainers.id}`
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
      getService(`membership/getByTrainerId/${Trainerscontroller.trainers.id}`)
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
        purpose: Trainerscontroller.trainers.purpose,
        skill: Trainerscontroller.trainers.skill,
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`education/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitEducation();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmEducation(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedEducation(row);
        onInitEducation();
      },
      onCancel() {},
    });
  }

  const pop = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`expierence/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitExperience();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirm(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedExperience(row);
        onInitExperience();
      },
      onCancel() {},
    });
  }

  const popExperience = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`expierenceForAdvice/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitExperienceAdvice();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmExperienceAdvice(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedExperienceAdvice(row);
        onInitExperienceAdvice();
      },
      onCancel() {},
    });
  }

  const popExperienceAdvice = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`expierenceForTeach/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitExperienceTeacher();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmTeacherExperience(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedTeacherExperience(row);
        onInitExperienceTeacher();
      },
      onCancel() {},
    });
  }

  const popTeacherExperience = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`publishedWork/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitPublishedWork();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmPublishedWork(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedPublishedWork(row);
        onInitPublishedWork();
      },
      onCancel() {},
    });
  }

  const popPublishedWork = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`propertyLicense/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitLicense();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmCertificate(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedLicense(row);
        onInitLicense();
      },
      onCancel() {},
    });
  }

  const popCertificate = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`membership/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInitMembership();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmMembership(row) {
    Modal.confirm({
      title: '???? ?????????????????? ???????????????? ?????????? ???? ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: '????????????',
      cancelText: '??????????',
      onOk() {
        handleDeletedMembership(row);
        onInitMembership();
      },
      onCancel() {},
    });
  }

  const popMembership = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
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
        3. ??????????????????{' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={add}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column field="degree" header="??????????, ??????" />
            <Column field="universityName" header="???? ???????? ???????????????????? ??????" />
            {/* <Column
              field={moment(listEducation.enrolledDate).format('YYYY-M-D')}
              header="???????????? ??????????"
            /> */}
            <Column
              field="enrolledDate"
              header="???????????? ??????????"
              body={enrolledDate}
            />
            <Column
              field="graduatedDate"
              header="?????????????? ??????????"
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
        4. ?????????? ????????????????{' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addExperience}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column field="position" header="?????????? ????????????" />
            <Column field="organizationName" header="???????????????????????? ??????" />
            <Column
              field="hiredDate"
              header="?????????? ?????????? ??????????"
              body={hiredDate}
            />
            <Column
              field="firedDate"
              header="???????????? ???????????? ??????????"
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
        5. ???????????? ???????????????????????? ?????????? ????????????????{' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addExperienceAdvice}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column field="position" header="?????????? ????????????" />
            <Column field="organizationName" header="???????????????????????? ??????" />
            <Column
              field="hiredDate"
              header="?????????? ?????????? ??????????"
              body={hiredDate}
            />
            <Column
              field="firedDate"
              header="???????????? ???????????? ??????????"
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
        6. ?????????????? ?????????? ????????????????{' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addTeacherExperience}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column field="position" header="?????????? ????????????" />
            <Column field="organizationName" header="???????????????????????? ??????" />
            <Column
              field="hiredDate"
              header="?????????? ?????????? ??????????"
              body={hiredDate}
            />
            <Column
              field="firedDate"
              header="???????????? ???????????? ??????????"
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
        7. ???????????????????? ???????????? (?????????? ??????????????????, ???????????????????? ????????????, ?????? ??????????
        ????????????, ???????????????????????? ?????????????????? ){' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addPublishedWork}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column field="name" header="?????????????????? ??????" />
            <Column field="publishedDate" header="??????????" body={publishedDate} />
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
        8. ???????????? ?????? ???????? ???????????????????? ?????????? ??????, ??????????????????, ????????????, ????????????
        ??????????????????{' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addCertificate}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column
              field="propertyName"
              header="?????????? ??????, ??????????????????, ?????????????????? ??????"
            />
            <Column field="licensedBy" header="?????????????? ???????????????????????? ??????" />
            <Column field="licensedDate" header="??????????" body={licensedDate} />
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
        9. ???????????????????? (???????? ?????????????? ?????????? ???????????? ?????? ???????????????????????? ???????????? ????????){' '}
        <Button
          type="text"
          className="export"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={addMembership}
          style={{ float: 'right' }}
        >
          ??????????
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
            <Column field="index" header="???" style={{ width: '50px' }} />
            <Column field="position" header="?????????? ????????????" />
            <Column field="organization" header="???????????????????????? ??????" />
            <Column field="enrolledDate" header="??????????" body={enrolledDate} />
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
    </div>
  );
}
