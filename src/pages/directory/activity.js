import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { putService, getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import ActivityModal from './components/ActivityModal';
// import OrgaStyle from '../training/tabs/components/orga.style';
// import AutoCompleteSelect from '../../components/Autocomplete';

const { Content } = Layout;

let editRow;
let isEditMode;
const Activity = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [stateTraining, setStateTraining] = useState([]);

  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  // const [stateActivityType, setStateActivityType] = useState([]);
  // const [stateeProjectType, setStateProjectType] = useState([]);
  const [activityID, setActivityID] = useState();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('activity/get', list)
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
    // getService('activityType/get').then(result => {
    //   if (result) {
    //     setStateActivityType(result || []);
    //   }
    // });
    // getService('projectType/get').then(result => {
    //   if (result) {
    //     setStateProjectType(result || []);
    //   }
    // });
  }, [lazyParams]);

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = row => {
    setActivityID(row.id);
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    putService(`activity/delete/${row.id}`)
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

  const activitiesBodyTemplate = row => (
    <>
      <span className="p-column-title">Үйл ажиллагаа</span>
      {row.activities}
    </>
  );

  const activitytypeBodyTemplate = row => (
    <>
      <span className="p-column-title">Үйл ажиллагааны төрөл</span>
      {row.activityType.name}
    </>
  );

  const projecttypeBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөлийн төрөл</span>
      {row.projectType.name}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={6}>
              <p className="title">Үйл ажиллагаа бүртгэх</p>
            </Col>
            <Col xs={18} md={12} lg={18}>
              <Row justify="end" gutter={[16, 16]}>
                {/* <Col xs={12} md={8} lg={10}>
                  <OrgaStyle>
                    <AutoCompleteSelect
                      valueField="id"
                      placeholder="Үйл ажиллагааны төрөл сонгох"
                      data={stateActivityType}
                      onChange={value => selectAtivityType(value)}
                    />
                  </OrgaStyle>
                </Col>
                <Col xs={12} md={8} lg={6}>
                  <OrgaStyle>
                    <AutoCompleteSelect
                      valueField="id"
                      placeholder="Төсөлийн төрөл сонгох"
                      data={stateeProjectType}
                      onChange={value => selectProjectType(value)}
                    />
                  </OrgaStyle>
                </Col> */}
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
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              header="№"
              field="index"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="name"
              body={activitiesBodyTemplate}
              header="Бүрэлдэхүүний нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="activityType.name"
              body={activitytypeBodyTemplate}
              header="Үйл ажиллагааны төрөл"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="projectType.name"
              body={projecttypeBodyTemplate}
              header="Төсөлийн төрөл"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '6rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ActivityModal
              Activitycontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              activityID={activityID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Activity;
