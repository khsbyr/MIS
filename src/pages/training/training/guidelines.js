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
import GuidelinesModal from './components/GuidelinesModal';
import OrgaStyle from './components/orga.style';

const { Content } = Layout;

let editRow;
let isEditMode;
const Guidelines = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const toolsStore = useContext(ToolsContext);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateOrga, setStateOrga] = useState([]);
  const [orgID, setOrgID] = useState([]);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('training/get', list)
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

  useEffect(() => {
    onInit();
    getService('organization/get').then(result => {
      if (result) {
        setStateOrga(result.content || []);
      }
    });
  }, [lazyParams]);

  const getGuidelines = orgId => {
    getService(`training/getList/${orgId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
        setOrgID(orgId);
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`training/delete/${row.id}`)
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
        onInit();
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

  const NameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.name}
    </>
  );

  const totalBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөв</span>
      {row.totalBudget}
    </>
  );

  const performanceBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн төсөв</span>
      {row.performanceBudget}
    </>
  );

  const startDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Эхэлсэн огноо</span>
      {row.trainingStartDate}
    </>
  );

  const endDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Дууссан огноо</span>
      {row.trainingEndDate}
    </>
  );

  const participantBodyTemplate = row => (
    <>
      <span className="p-column-title">Оролцогчдын тоо</span>
      {row.participantsNumber}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сургалт</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={5} />
                  <Col xs={8} md={8} lg={6}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Байгууллага сонгох"
                        data={stateOrga}
                        onChange={value => selectOrgs(value)}
                      />
                    </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
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
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
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
            <Column field="index" header="№" body={indexBodyTemplate} />
            <Column
              field="name"
              header="Сургалтын сэдэв"
              filter
              body={NameBodyTemplate}
            />
            <Column
              field="totalBudget"
              header="Төсөв"
              filter
              body={totalBudgetBodyTemplate}
            />
            <Column
              field="performanceBudget"
              header="Гүйцэтгэлийн төсөв"
              filter
              body={performanceBudgetBodyTemplate}
            />
            <Column
              field="trainingStartDate"
              header="Эхэлсэн огноо"
              filter
              body={startDateBodyTemplate}
            />
            <Column
              field="trainingEndDate"
              header="Дууссан огноо"
              filter
              body={endDateBodyTemplate}
            />
            <Column
              field="participantsNumber"
              header="Оролцогчдын тоо"
              filter
              body={participantBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <GuidelinesModal
              Guidelinescontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              orgID={orgID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Guidelines;
