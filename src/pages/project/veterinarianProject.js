import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
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
  Tooltip,
  Select,
  Tag,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from './more/veterinarian.style';
import VeterinarianProjectModal from './more/veterinarianProjectModal';

const { Content } = Layout;
const { Option } = Select;

let editRow;
let isEditMode;
let trainerID;
const veterinarianProject = () => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState();
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [doctorID, setDoctorID] = useState();
  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`user/getAllYoungDoctorUserList`, list)
      .then(result => {
        const listResult = result || [];
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
        // onInit();
      },
      onCancel() {},
    });
  }

  const onChangeStatus = value => {
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
    setIsModalVisible(false);
    if (isSuccess) onInit();
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
        defaultValue={
          <Tag color={getColor(row.youngDoctor.youngDoctorStatus.id)}>
            {row.youngDoctor.youngDoctorStatus.status}
          </Tag>
        }
        onChange={onChangeStatus}
        onClick={event => selectedStatus(event, row)}
        style={{ width: '60%', background: 'unset' }}
      >
        {status?.map(z => (
          <Option key={z.id}>
            <Tag color={getColor(z.id)}>{z.status}</Tag>
          </Option>
        ))}
      </Select>
    </>
  );

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
                <Col>
                  <Tooltip title="Хэвлэх" arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="Экспорт" arrowPointAtCenter>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="Нэмэх" arrowPointAtCenter>
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
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              header="Малын эмчийн нэр"
              body={FirstNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Утас"
              body={phoneBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column
              field="registerNumber"
              header="Регистер"
              body={registerBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column
              header="Нас"
              body={reportBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column
              header="Төлөв"
              body={statusBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
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
        </div>
      </div>
    </ContentWrapper>
  );
};

export default veterinarianProject;