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
import React, { useContext, useEffect, useState } from 'react';
import { PAGESIZE } from '../../../constants/Constant';
import { useProjectStore } from '../../../context/ProjectContext';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import DescriptionModal from './components/DescriptionModal';
import ImplementationModal from './components/ImplementationModal';
import ImplementationFileModal from './ImplementationFileModa';
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
let editRoww;
let isEditModee;
const Implementation = () => {
  const { ProjectList } = useProjectStore();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblee, setIsModalVisiblee] = useState(false);
  const [impId, setImpId] = useState();
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

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(
        `implementationOfSemp/getListByProjectId/${ProjectList.id}`,
        obj
      )
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

  const addd = () => {
    setIsModalVisiblee(true);
    isEditModee = false;
  };

  const editt = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    editRoww = row;
    isEditModee = true;
    setIsModalVisiblee(true);
  };

  const closeModall = () => {
    setIsModalVisiblee(false);
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
    putService(`implementationOfSemp/delete/${row.id}`)
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

  function openTab(row) {
    window.open(`${row.file.path}`);
  }

  const info = row => {
    getService(
      `projectStatusHistory/getByImplementationOfSempId/${row.id}`
    ).then(result => {
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
              style={{ marginTop: '30px' }}
              pagination={false}
            />
          ),
          onOk() {},
        });
      }
    });
  };

  const handleDeletedd = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`implementationSempFiles/delete/${row.id}`)
      .then(() => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirmm(row) {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeletedd(row);
        onInit();
      },
      onCancel() {},
    });
  }

  const popp = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirmm(row);
    }
  };

  const actionFile = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={event => editt(event, row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={event => popp(event, row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faFilePdf} />}
        onClick={() => openTab(row)}
      />
    </>
  );

  const creadetDate = row => (
    <>
      <>{moment(row && row.createdDate).format('YYYY-M-D')}</>
    </>
  );

  const addFile = row => {
    setImpId(row.id);
    getService(
      `implementationSempFiles/getByImplementationSemp/${row.id}`
    ).then(result => {
      if (result) {
        Modal.info({
          title: 'Хавсралт файл',
          width: 1300,
          okText: 'Буцах',
          content: (
            <div className="button-demo">
              <Layout className="btn-layout">
                <Content>
                  <Row>
                    <Col xs={24} md={24} lg={24}>
                      <Row justify="end" gutter={[16, 16]}>
                        <Col>
                          {toolsStore.user.role.id === 21 ? (
                            ''
                          ) : (
                            <Tooltip title="Нэмэх" arrowPointAtCenter>
                              <Button
                                type="text"
                                className="export"
                                icon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={addd}
                              >
                                {' '}
                              </Button>
                            </Tooltip>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Content>
              </Layout>
              <div className="datatable-responsive-demo">
                <DataTable
                  value={result}
                  removableSort
                  paginator
                  emptyMessage="Өгөгдөл олдсонгүй..."
                  rows={10}
                  className="p-datatable-responsive-demo"
                  dataKey="id"
                >
                  <Column header="Тайлбар" field="description" />
                  <Column header="Огноо" body={creadetDate} />
                  <Column headerStyle={{ width: '8rem' }} body={actionFile} />
                </DataTable>
              </div>
            </div>
          ),
          onOk() {},
        });
      }
    });
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

      {row.file && toolsStore.user.role.id !== 21 ? (
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

      {row.projectStatus.name === 'Зөвшөөрсөн' &&
      toolsStore.user.role.id !== 21 ? (
        <Tooltip title="Файл нэмэх">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => addFile(row)}
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

  const description = row => (
    <>
      <span className="p-column-title">Тайлбар</span>
      <Tooltip placement="topLeft" title={row.description}>
        {row.description}
      </Tooltip>
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
              <Col xs={24} md={24} lg={24}>
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
            <Column header="Тайлбар" body={description} />
            <Column header="Хугацаа" body={period} />
            <Column
              field="projectStatus.name"
              header="Статус"
              body={statusBodyTemplate}
            />
            <Column headerStyle={{ width: '12rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ImplementationModal
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
              type={2}
            />
          )}
          {isModalVisiblee && (
            <ImplementationFileModal
              EditRow={editRoww}
              isModalVisible={isModalVisiblee}
              close={closeModall}
              isEditMode={isEditModee}
              impId={impId}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Implementation;
