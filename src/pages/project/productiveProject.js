import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AutoCompleteSelect from '../../components/Autocomplete';
import { PAGESIZE } from '../../constants/Constant';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import OrgaStyle from '../training/tabs/components/orga.style';
import ContentWrapper from './more/productiveProject.style';
import ProductiveProjectModal from './more/productiveProjectModal';

const { Option } = Select;
const { Content } = Layout;

let editRow;
let isEditMode;
const productiveProject = props => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toolsStore = useToolsStore();
  const [selectedRows, setSelectedRows] = useState([]);
  const [status, setStatus] = useState();
  const [projectID, setProjectID] = useState();
  const history = useHistory();
  const [form] = Form.useForm();
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);

  let loadLazyTimeout = null;

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url = value
        ? `project/getByProjectTypeId/${props.type}?search=organization.id:${value}`
        : `project/getByProjectTypeId/${props.type}`;
      getService(url, obj)
        .then(result => {
          const listResult = result.content;
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(result.totalElements);
          setList(listResult);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }, 1000);
  };

  useEffect(() => {
    onInit();
    getService('projectStatus/getByTypeId/1').then(result => {
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
        message.success('?????????????????? ??????????????????');
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  const selectOrgs = value => {
    onInit(value);
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }

    putService(`project/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        onInit();
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
      message.warning('???????????? ???????????????? ?????????????? ????');
    } else {
      confirm(row);
    }
  };

  const action = row => (
    <>
      {toolsStore.user.role.id === 21 ||
      toolsStore.user.role.id === 19 ||
      toolsStore.user.role.id === 22 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faPen} />}
          onClick={event => edit(event, row)}
        />
      )}
      {toolsStore.user.role.id === 21 ||
      toolsStore.user.role.id === 19 ||
      toolsStore.user.role.id === 22 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faTrash} />}
          onClick={event => pop(event, row)}
        />
      )}
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );

  const NameBodyTemplate = row => (
    <>
      <span className="p-column-title">?????????????? ??????</span>
      {row.projectName}
    </>
  );

  const userBodyTemplate = row => (
    <>
      <span className="p-column-title">??????????????????????</span>
      {row.organization.name}
    </>
  );

  const dateBodyTemplate = row => (
    <>
      <span className="p-column-title">?????????? ?????????????????????? ??????????????</span>
      {row.period} ??????
    </>
  );

  const dateSentBodyTemplate = row => (
    <>
      <span className="p-column-title">?????????? ???????????????? ??????????</span>
      {moment(row.createdDate && row.createdDate).format('YYYY-MM-DD')}
    </>
  );

  const typeBodyTemplate = row => (
    <>
      <span className="p-column-title">??????????</span>
      {row.subProjectType ? row.subProjectType.name : '??????????????????????'}
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
        return '?????????????????? ???????????????????? ???????????? ????????????';
      case 2:
        return '??????-?? ???????????????? ?????????????????? ?????????????????? ?????????????? ????????????';
      case 3:
        return '???????????? ?????????????????????????? ?????? ??????????';
      case 4:
        return '?????? ???????????????????? ???????????? ????????????????';
      default:
        return '';
    }
  };

  const statusBodyTemplate = row => (
    <>
      <span className="p-column-title">????????????</span>

      <Select
        disabled
        defaultValue={
          <Tag color={getColor(row.projectStatus.id)}>
            {row.projectStatus.name}
          </Tag>
        }
        onChange={onChangeStatus}
        onClick={event => selectedStatus(event, row)}
        style={{ width: '100%' }}
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
            <Col xs={24} md={24} lg={14}>
              <p className="title">{getName(props.type)}</p>
            </Col>
            <Col xs={24} md={18} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={6} lg={7}>
                  {toolsStore.user.roleId === 1 ? (
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="?????????????????????? ????????????"
                        data={toolsStore.orgList}
                        onChange={value => selectOrgs(value)}
                      />
                    </OrgaStyle>
                  ) : (
                    ''
                  )}
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
                <Col xs={6} md={2} lg={2}>
                  <Tooltip title={t('print')} arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={6} md={2} lg={2}>
                  <Tooltip title={t('export')} arrowPointAtCenter>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={6} md={2} lg={2}>
                  <Tooltip title={t('pdf')} arrowPointAtCenter>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFilePdf} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                {toolsStore.user.role.id === 21 ||
                toolsStore.user.role.id === 19 ||
                toolsStore.user.role.id === 22 ? (
                  ''
                ) : (
                  <Col xs={6} md={2} lg={2}>
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
                )}
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <DataTable
            emptyMessage="?????????????? ??????????????????..."
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            onRowClick={ShowProjectInfo}
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
              header="???"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              header="?????????????? ??????"
              field="projectName"
              filter
              body={NameBodyTemplate}
              sortable
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              header="??????????????????????"
              field="organization.name"
              filter
              sortable
              body={userBodyTemplate}
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              header="?????????? ?????????????????????? ??????????????"
              field="period"
              filter
              sortable
              body={dateBodyTemplate}
              filterPlaceholder="????????"
              filterMatchMode="equals"
            />
            <Column
              header="?????????? ???????????????? ??????????"
              field="createdDateFormat"
              sortable
              body={dateSentBodyTemplate}
              filter
              filterPlaceholder="????????"
              filterMatchMode="startsWith"
            />
            <Column
              header="??????????"
              field="subProjectType.name"
              body={typeBodyTemplate}
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />

            <Column
              field="projectStatus.name"
              header="????????????"
              body={statusBodyTemplate}
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
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
