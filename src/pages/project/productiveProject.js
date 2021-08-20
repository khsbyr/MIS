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
  Form,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AutoCompleteSelect from '../../components/Autocomplete';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import OrgaStyle from '../training/tabs/components/orga.style';
import ContentWrapper from './more/productiveProject.style';
import ProductiveProjectModal from './more/productiveProjectModal';

const { Option } = Select;
const { Content } = Layout;

let editRow;
let isEditMode;
const productiveProject = props => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams] = useState({
    page: 0,
  });
  const toolsStore = useToolsStore();
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateOrga, setStateOrga] = useState([]);
  const [status, setStatus] = useState();
  const [projectID, setProjectID] = useState();
  const history = useHistory();
  const [form] = Form.useForm();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`project/getByProjectTypeId/${props.type}`, list)
      .then(result => {
        const listResult = result;
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
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
    getService('projectStatus/get').then(result => {
      if (result) {
        setStatus(result || []);
      }
    });
    form.setFieldsValue({
      ...list,
    });
  }, [lazyParams]);
  const selectedStatus = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    setProjectID(row.id);
  };

  const onChangeStatus = value => {
    const datas = {
      statusId: value,
      projectId: projectID,
    };
    putService(`project/updateStatus`, datas)
      .then(() => {
        message.success('Амжилттай хадгаллаа');
      })
      .catch(error => {
        errorCatch(error);
      });
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

    putService(`project/delete/${row.id}`)
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
      {row.projectName}
    </>
  );

  const userBodyTemplate = row => (
    <>
      <span className="p-column-title">Хариуцсан хүн</span>
      {row.nameOfAuthorizedPerson}
    </>
  );

  const dateBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөл хэрэгжүүлэх хугацаа</span>
      {row.period} сар
    </>
  );

  const dateSentBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөл ирүүлсэн огноо</span>
      {moment(row.createdDate && row.createdDate).format('YYYY-M-D')}
    </>
  );

  const getColor = id => {
    switch (id) {
      case 1:
        return 'success';
      case 2:
        return 'error';
      case 3:
        return 'processing';
      default:
        return 'processing';
    }
  };

  const getName = type => {
    switch (type) {
      case 1:
        return 'Бүтээмжит төсөл';
      case 2:
        return 'МАА-н инновацийн төсөл';
      case 3:
        return 'Тэжээлийн үйлдвэрийн төсөл';
      default:
        return '';
    }
  };

  const statusBodyTemplate = row => (
    <>
      <span className="p-column-title">Статус</span>

      <Select
        defaultValue={
          <Tag color={getColor(row.projectStatus.id)}>
            {row.projectStatus.name}
          </Tag>
        }
        onChange={onChangeStatus}
        onClick={event => selectedStatus(event, row)}
        style={{ width: '70%' }}
      >
        {status?.map(z => (
          <Option key={z.id}>
            <Tag color={getColor(z.id)}>{z.name}</Tag>
          </Option>
        ))}
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
              <p className="title">{getName(props.type)}</p>
            </Col>
            <Col xs={24} md={18} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={6} lg={7}>
                  <OrgaStyle>
                    <AutoCompleteSelect
                      valueField="id"
                      placeholder="Байгууллага сонгох"
                      data={toolsStore.orgList}
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
            <Column header="Хариуцсан хүн" filter body={userBodyTemplate} />
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
              ProductiveController={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              type={props.type}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default productiveProject;
