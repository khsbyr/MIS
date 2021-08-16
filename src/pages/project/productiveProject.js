import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
  DatePicker,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Tooltip,
  Tag,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AutoCompleteSelect from '../../components/Autocomplete';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import OrgaStyle from '../training/tabs/components/orga.style';
import ContentWrapper from './more/productiveProject.style';
import ProductiveProjectModal from './more/productiveProjectModal';

const { Option } = Select;
const { Content } = Layout;

let editRow;
let isEditMode;
const productiveProject = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const toolsStore = useContext(ToolsContext);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  // const [, setStateOrga] = useState([]);
  const [stateOrga, setStateOrga] = useState([]);
  const history = useHistory();

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
    // getService(`criteria/getListByForWhatId/1`).then(result => {
    //   if (result) {
    //     setStateCriteria(result.content || []);
    //   }
    // });
  }, [lazyParams]);

  const selectedStatus = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onChangeStatus = value => {
    console.log(value);
  };

  const getTraining = orgId => {
    getService(`training/getList/${orgId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      }
    });
  };

  const selectOrgs = value => {
    getTraining(value);
  };

  const add = () => {
    editRow = null;
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
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

  const pop = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
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
        onClick={event => edit(event, row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={event => pop(event, row)}
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
      <span className="p-column-title">Төслийн нэр</span>
      {row.name}
    </>
  );

  // const orgNameBodyTemplate = row => (
  //   <>
  //     <span className="p-column-title">Байгууллагын нэр</span>
  //     {row.trainingBudget && row.trainingBudget.totalBudget}
  //   </>
  // );

  const activityDirectionBodyTemplate = row => (
    <>
      <span className="p-column-title">Төслийн үйл ажиллагааны чиглэл</span>
      {row.trainingBudget && row.trainingBudget.performanceBudget}
    </>
  );

  const fundingBodyTemplate = row => (
    <>
      <span className="p-column-title">Төслийн санхүүжилт</span>
      {moment(row.trainingStartDate && row.trainingStartDate).format(
        'YYYY-M-D'
      )}
    </>
  );

  const dateBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөл хэрэгжүүлэх хугацаа</span>
      {moment(row.trainingEndDate && row.trainingEndDate).format('YYYY-M-D')}
    </>
  );

  const dateSentBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөл ирүүлсэн огноо</span>
      {row.totalParticipants}
    </>
  );

  const statusBodyTemplate = row => (
    <>
      <Select
        defaultValue="1"
        onChange={onChangeStatus}
        onClick={event => selectedStatus(event, row)}
        style={{ width: '70%' }}
      >
        <Option key="1">
          <Tag color="green">Зөвшөөрсөн</Tag>
        </Option>
        <Option key="2">
          <Tag color="red">Цуцлагдсан</Tag>
        </Option>
      </Select>
    </>
  );

  const ShowProjectInfo = row => history.push(`/projectList/${row.data.id}`);

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={14}>
              <p className="title">Бүтээмжит төсөл</p>
            </Col>
            <Col xs={24} md={18} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={6} lg={7}>
                  <OrgaStyle>
                    <AutoCompleteSelect
                      valueField="id"
                      placeholder="Байгууллага сонгох"
                      data={stateOrga}
                      onChange={value => selectOrgs(value)}
                    />
                  </OrgaStyle>
                </Col>
                <Col xs={12} md={5} lg={5}>
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
                <Col xs={8} md={2} lg={2}>
                  <Tooltip title="Хэвлэх" arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={8} md={2} lg={2}>
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
                <Col xs={8} md={2} lg={2}>
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            onRowClick={ShowProjectInfo}
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
              header="Төслийн нэр"
              filter
              body={NameBodyTemplate}
              sortable
            />
            {/* <Column
              header="Байгууллагын нэр"
              thousandSeparator
              filter
              body={orgNameBodyTemplate}
            /> */}
            <Column
              header="Төслийн үйл ажиллагааны чиглэл"
              filter
              body={activityDirectionBodyTemplate}
            />
            <Column
              header="Төслийн санхүүжилт"
              filter
              body={fundingBodyTemplate}
            />
            <Column
              header="Төсөл хэрэгжүүлэх хугацаа"
              filter
              body={dateBodyTemplate}
            />
            <Column
              header="Төсөл ирүүлсэн огноо"
              filter
              body={dateSentBodyTemplate}
            />
            <Column header="Статус" body={statusBodyTemplate} />
            <Column headerStyle={{ width: '6rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ProductiveProjectModal
              Trainingcontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default productiveProject;
