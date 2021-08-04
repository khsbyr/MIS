import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../criteria/criteria.style';
import CvModal from './components/CvModal';
import OrgaStyle from './components/orga.style';

const { Content } = Layout;

let editRow;
let isEditMode;
let trainerID;
const CV = props => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateOrg, setStateOrg] = useState([]);
  const [OrgID, setOrgID] = useState([]);
  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`trainers/getListByTrainingId/${props.id}`, list)
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
    getService(`training/get/${props.id}`, {}).then(result => {
      if (result) {
        setOrgID(result.organization.id);
      }
    });
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const getGuidelines = orgId => {
    getService(`user/getTrainerListByOrgId/${orgId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      }
    });
  };

  const selectOrgs = value => {
    getGuidelines(value);
  };

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
    putService(`trainers/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        // onInit();
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

  const pop = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  const edit = row => {
    trainerID = row.trainers.id;
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
    // if (isSuccess) onInit();
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.firstname}
    </>
  );

  const LastNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Овог</span>
      {row.lastname}
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
      <span className="p-column-title">Сургагч багшийн регистер</span>
      {row.register}
    </>
  );
  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сургагч багшийн CV</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={7} />
                  <Col xs={8} md={8} lg={5}>
                    <DatePicker
                      bordered={false}
                      suffixIcon={<DownOutlined />}
                      placeholder="Select year"
                      picker="year"
                      className="DatePicker"
                      style={{
                        width: '120px',
                        color: 'black',
                        cursor: 'pointer',
                      }}
                    />
                  </Col>
                  <Col xs={8} md={8} lg={4}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={add}
                    >
                      Нэмэх
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
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
              sortable
            />
            <Column
              header="Овог"
              body={LastNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Нэр"
              body={FirstNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Утас"
              body={phoneBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="registerNumber"
              header="Сургагч багшийн регистер"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CvModal
              Trainerscontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              orgId={OrgID}
              trainerID={trainerID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default CV;
