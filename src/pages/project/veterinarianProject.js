import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFilePdf,
  faHistory,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import DescriptionModal from './components/ModalComponent/DescriptionModal';
import ContentWrapper from './more/veterinarian.style';
import VeterinarianProjectModal from './more/veterinarianProjectModal';

const { Content } = Layout;
const { Option } = Select;

let editRow;
let isEditMode;
let trainerID;
const veterinarianProject = () => {
  const { t } = useTranslation();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [doctorID, setDoctorID] = useState();
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const [visible, setVisible] = useState(false);

  let loadLazyTimeout = null;

  const columns = [
    {
      title: 'Буцаасан ажилтан',
      dataIndex: ['user', 'firstname'],
      key: ['user', 'firstname'],
    },
    {
      title: 'Шалтгаан',
      dataIndex: 'definition',
      key: 'definition',
    },
  ];

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`user/getAllYoungDoctorUserList`, obj)
        .then(result => {
          const listResult = result || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(result.totalElements);
          setList(listResult);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };

  useEffect(() => {
    onInit();
    getService('youngDoctorStatus/get').then(result => {
      if (result) {
        setStatus(result || []);
      }
    });
  }, [lazyParams]);

  const add = () => {
    editRow = null;
    setIsModalVisible(true);
    isEditMode = false;
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`youngDoctor/delete/${row.youngDoctor.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInit();
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
        handleDeleted(row);
      },
      onCancel() {},
    });
  }

  const onChangeStatus = value => {
    if (value === '3') {
      setVisible(true);
    } else {
      const datas = {
        statusId: value,
        youngDoctorId: doctorID,
      };
      putService(`youngDoctorStatus/updateDoctorStatus`, datas)
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    }
  };

  const selectedStatus = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    setDoctorID(row.youngDoctor.id);
  };

  const pop = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  const edit = row => {
    trainerID = row.youngDoctor.id;
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const info = row => {
    getService(`youngDoctorStatusHistory/get/${row.youngDoctor.id}`).then(
      result => {
        if (result) {
          Modal.info({
            title: 'Төлөвийн түүх',
            width: 900,
            okText: 'Буцах',
            content: (
              <Table
                columns={columns}
                dataSource={result}
                size="small"
                style={{ marginTop: '30px' }}
                pagination={false}
              />
            ),
            onOk() {},
          });
        }
      }
    );
  };

  function openTab(row) {
    window.open(`${row.youngDoctor.file.path}`);
  }

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
      <Tooltip title="Төлөвийн түүх харах">
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faHistory} />}
          onClick={() => info(row)}
        />
      </Tooltip>
      {row.youngDoctor.file ? (
        <Tooltip title="Файл харах">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faFilePdf} />}
            onClick={() => openTab(row)}
          />
        </Tooltip>
      ) : (
        ''
      )}
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const modalClose = () => {
    setVisible(false);
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Малын эмчийн нэр</span>
      {row.firstname}
    </>
  );

  const phoneBodyTemplate = row => (
    <>
      <span className="p-column-title">Утас</span>
      {row.phoneNumber}
    </>
  );

  const registerBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистер</span>
      {row.register}
    </>
  );

  const reportBodyTemplate = row => (
    <>
      <span className="p-column-title">Нас</span>
      {row.age}
    </>
  );

  const genderBodyTemplate = row => (
    <>
      <span className="p-column-title">Хүйс</span>
      {row.gender?.gender}
    </>
  );

  const date = row => (
    <>
      <span className="p-column-title">Тайлан илгээсэн огноо</span>
      {moment(row && row.youngDoctor?.reportDate).format('YYYY-MM')}
    </>
  );

  const getColor = id => {
    switch (id) {
      case 1:
        return 'processing';
      case 2:
        return 'success';
      case 3:
        return 'error';
      default:
        return 'processing';
    }
  };

  const statusBodyTemplate = row => (
    <>
      <span className="p-column-title">Статус</span>

      <Select
        disabled
        defaultValue={
          <Tag color={getColor(row.youngDoctor.youngDoctorStatus.id)}>
            {row.youngDoctor.youngDoctorStatus.status}
          </Tag>
        }
        onChange={onChangeStatus}
        onClick={event => selectedStatus(event, row)}
        style={{ width: '100%', background: 'unset' }}
      >
        {status?.map(z => (
          <Option key={z.id}>
            <Tag color={getColor(z.id)}>{z.status}</Tag>
          </Option>
        ))}
      </Select>
    </>
  );

  const onPage = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter = event => {
    const params = { ...lazyParams, ...event, page: 0 };
    setLazyParams(params);
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">Залуу малын эмч хөтөлбөр</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                {/* <Col>
                  <Tooltip title={t('export')} arrowPointAtCenter>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col> */}

                <Col>
                  <Tooltip title={t('add')} arrowPointAtCenter>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={add}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>

        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
            ref={dt}
            lazy
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              header="Малын эмчийн нэр"
              field="firstname"
              body={FirstNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Утас"
              field="phoneNumber"
              body={phoneBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="startsWith"
            />
            <Column
              field="register"
              header="Регистер"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Нас"
              field="age"
              body={reportBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="equals"
            />
            <Column
              header="Хүйс"
              field="gender.gender"
              body={genderBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Тайлан илгээсэн огноо"
              field="youngDoctor.reportDate"
              body={date}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Төлөв"
              body={statusBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '8rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <VeterinarianProjectModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainerID={trainerID}
            />
          )}
          {visible && (
            <DescriptionModal
              isModalVisible={visible}
              close={modalClose}
              doctorID={doctorID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default veterinarianProject;
