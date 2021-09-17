import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
  faHistory,
  faFilePdf,
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
  Table,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import ContentWrapper from './style/ProjectInfo.style';
import { useProjectStore } from '../../../context/ProjectContext';
import { PAGESIZE } from '../../../constants/Constant';
import DescriptionModal from './components/DescriptionModal';
import ImplementationModal from './components/ImplementationModal';

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
  },
];

let editRow;
let isEditMode;
const Implementation = () => {
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

  function openTab(row) {
    window.open(`${row.file.path}`);
  }

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
      <Tooltip title="Төлөвийн түүх харах">
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faHistory} />}
          onClick={() => info(row)}
        />
      </Tooltip>
      {row.file ? (
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
      <span className="p-column-title">Төлөвлөсөн үйл ажиллагаа</span>
      {row.plannedWork}
    </>
  );

  const description = row => (
    <>
      <span className="p-column-title">Тайлбар</span>
      {row.description}
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
            <Column header="Төлөвлөсөн үйл ажиллагаа" body={job} />
            <Column header="Тайлбар" body={description} />
            <Column header="Хугацаа" body={period} />
            <Column
              field="projectStatus.name"
              header="Статус"
              body={statusBodyTemplate}
            />
            <Column headerStyle={{ width: '10rem' }} body={action} />
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
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Implementation;
