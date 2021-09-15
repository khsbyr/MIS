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
import moment from 'moment';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import ContentWrapper from './style/ProjectInfo.style';
import { useProjectStore } from '../../../context/ProjectContext';
import ProjectInfoModal from './components/ProjectInfoModal';
import { PAGESIZE } from '../../../constants/Constant';

const { Content } = Layout;
const { Option } = Select;

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
    getService('projectStatus/get').then(result => {
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

  function openTab1(row) {
    window.open(`${row.data.file.path}`);
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

  const startDate = row => (
    <>
      <span className="p-column-title">Эхлэх хугацаа</span>
      <>{moment(row && row.startDate).format('YYYY-M-D')}</>
    </>
  );

  const endDate = row => (
    <>
      <span className="p-column-title">Дуусах хугацаа</span>
      <>{moment(row && row.endDate).format('YYYY-M-D')}</>
    </>
  );

  const job = row => (
    <>
      <span className="p-column-title">Төлөвлөсөн ажил</span>
      {row.plannedWork}
    </>
  );

  const process = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн явц</span>
      {row.performanceProcess}
    </>
  );

  const delay = row => (
    <>
      <span className="p-column-title">Хоцрогдол</span>
      {row.isDelay === false ? 'Хоцроогүй' : 'Хоцорсон'}
    </>
  );

  const selectedStatus = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onChangeStatus = value => {
    const datas = {
      statusId: value,
    };
    putService(`project/updateStatus`, datas)
      .then(() => {
        message.success('Амжилттай хадгаллаа');
      })
      .catch(error => {
        errorCatch(error);
      });
  };

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
            onRowClick={openTab1}
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
            {/* <Column header="Хоцрогдлын шалтгаан" body={budget} />
            <Column header="Тайлбар" body={budget} /> */}
            <Column
              field="projectStatus.name"
              header="Статус"
              body={statusBodyTemplate}
              sortable
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
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ProjectInfo;
