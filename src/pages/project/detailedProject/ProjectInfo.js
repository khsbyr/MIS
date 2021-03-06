import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
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
import React, { useContext, useEffect, useState } from 'react';
import { PAGESIZE } from '../../../constants/Constant';
import { useProjectStore } from '../../../context/ProjectContext';
import { ToolsContext, useToolsStore } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import DescriptionModal from './components/DescriptionModal';
import ProjectInfoModal from './components/ProjectInfoModal';
import ContentWrapper from './style/ProjectInfo.style';

const { Content } = Layout;
const { Option } = Select;
const columns = [
  {
    title: 'Он, сар',
    dataIndex: 'createdDate',
    key: 'createdDate',
    render: createdDate => moment(createdDate).zone(0).format('YYYY-MM-DD'),
  },
  {
    title: 'Буцаасан ажилтан',
    dataIndex: ['user', 'firstname'],
    key: ['user', 'firstname'],
  },
  {
    title: 'Статус',
    dataIndex: ['projectStatus', 'name'],
    key: ['projectStatus', 'name'],
  },
  {
    title: 'Шалтгаан',
    dataIndex: 'definition',
    key: 'definition',
    ellipsis: {
      showTitle: false,
    },
    render: definition => (
      <Tooltip placement="topLeft" title={definition}>
        {definition}
      </Tooltip>
    ),
  },
];

let editRow;
let isEditMode;
const ProjectInfo = () => {
  const { ProjectList } = useProjectStore();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [status, setStatus] = useState();
  let loadLazyTimeout = null;
  const [totalRecords, setTotalRecords] = useState(0);
  const [operationID, setOperationID] = useState();
  const [visible, setVisible] = useState(false);
  const [statusId, setStatusId] = useState();
  const [generalStatus, setGeneralStatus] = useState();
  const { setIsShowLoader } = useToolsStore();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`operation/getListByProjectId/${ProjectList.id}`, obj)
        .then(result => {
          const listResult = result || [];
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
    }, 500);
  };

  useEffect(() => {
    onInit();
    getService(`/operation/getGeneralStatus/${ProjectList.id}`)
      .then(result => {
        setGeneralStatus(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });

    getService('projectStatus/getByTypeId/2').then(result => {
      if (result) {
        setStatus(result || []);
      }
    });
  }, [lazyParams]);

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

  const add = () => {
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
    putService(`operation/delete/${row.id}`)
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

  const info = row => {
    getService(`projectStatusHistory/getByOperationId/${row.id}`).then(
      result => {
        if (result) {
          Modal.info({
            title: 'Төлөвийн түүх',
            width: 1200,
            okText: 'Буцах',
            content: (
              <Table
                columns={columns}
                dataSource={result}
                size="small"
                style={{ marginTop: '30px', width: 'auto' }}
                pagination={false}
              />
            ),
            onOk() {},
          });
        }
      }
    );
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
      {toolsStore.user.role.id === 21 || toolsStore.user.role.id === 22 ? (
        ''
      ) : (
        <Tooltip title="Төлөвийн түүх харах">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faHistory} />}
            onClick={() => info(row)}
          />
        </Tooltip>
      )}
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const modalClose = () => {
    setVisible(false);
    onInit();
  };

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const startDate = row => (
    <>
      <span className="p-column-title">Эхлэх хугацаа</span>
      <>
        {moment(row && row.startDate)
          .zone(0)
          .format('YYYY-M-D')}
      </>
    </>
  );

  const endDate = row => (
    <>
      <span className="p-column-title">Дуусах хугацаа</span>
      <>
        {moment(row && row.endDate)
          .zone(0)
          .format('YYYY-M-D')}
      </>
    </>
  );

  const job = row => (
    <>
      <span className="p-column-title">Төлөвлөсөн ажил</span>
      <Tooltip placement="topLeft" title={row.plannedWork}>
        {row.plannedWork}
      </Tooltip>
    </>
  );

  const process = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн явц</span>
      <Tooltip placement="topLeft" title={row.performanceProcess}>
        {row.performanceProcess}
      </Tooltip>
    </>
  );

  const delay = row => (
    <>
      <span className="p-column-title">Хоцрогдол</span>
      {row.isDelay === false ? 'Хоцроогүй' : 'Хоцорсон'}
    </>
  );

  const period = row => (
    <>
      <span className="p-column-title">Хугацаа</span>
      {row.period} сар
    </>
  );

  const selectedStatus = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    setOperationID(row.id);
  };

  const onChangeStatus = value => {
    setStatusId(value);
    setVisible(true);
  };

  const getColor = id => {
    switch (id) {
      case 4:
        return 'success';
      case 5:
        return 'error';
      case 6:
        return 'processing';
      default:
        return 'processing';
    }
  };

  const statusBodyTemplate = row => (
    <>
      <span className="p-column-title">Статус</span>
      {toolsStore.user?.role?.roleLevel?.id === 3 ||
      toolsStore.user?.role?.roleLevel?.id === 5 ||
      toolsStore.user.role.id === 22 ? (
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
      ) : (
        <Select
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
      )}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={10}>
                <pre
                  style={{
                    fontSize: '16px',
                    color: 'grey',
                  }}
                >
                  Үйл ажиллагааны үр дүн: {generalStatus}
                </pre>
              </Col>
              <Col xs={24} md={24} lg={14}>
                <Row justify="end" gutter={[16, 16]}>
                  {toolsStore.user.role.id === 21 ||
                  toolsStore.user.role.id === 19 ||
                  toolsStore.user.role.id === 22 ? (
                    ''
                  ) : (
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
                  )}
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            className="p-datatable-responsive-demo"
            dataKey="id"
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
            <Column header="№" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column header="Эхлэх хугацаа" body={startDate} />
            <Column header="Дуусах хугацаа" body={endDate} />
            <Column header="Төлөвлөсөн ажил" body={job} />
            <Column header="Гүйцэтгэлийн явц" body={process} />
            <Column header="Хоцрогдол" body={delay} />
            <Column header="Хугацаа" body={period} />
            <Column
              field="projectStatus.name"
              header="Статус"
              body={statusBodyTemplate}
            />
            <Column headerStyle={{ width: '8rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ProjectInfoModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              projectId={ProjectList.id}
            />
          )}
          {visible && (
            <DescriptionModal
              isModalVisible={visible}
              close={modalClose}
              operationID={operationID}
              statusID={statusId}
              type={1}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ProjectInfo;
