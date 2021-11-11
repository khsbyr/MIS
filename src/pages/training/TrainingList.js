import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
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
  Tooltip,
} from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PAGESIZE } from '../../constants/Constant';
import { useToolsStore } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from './training.style';
import TrainingModal from './TrainingModal';

const { Content } = Layout;
const { Option } = Select;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TrainingList = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const toolsStore = useToolsStore();
  const [orgID] = useState([]);
  const [trainingID, setTrainingID] = useState();
  const history = useHistory();
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [participantsList, setParticipantsList] = useState();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService('training/get', obj)
        .then(data => {
          const dataList = data.content || [];
          dataList.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(data.totalElements);
          setList(dataList);
          toolsStore.setIsShowLoader(false);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          message.error(error.toString());
          toolsStore.setIsShowLoader(false);
        });
    }, 1000);
  };

  useEffect(() => {
    onInit();
    getService(`training/getTotalParticipantsNumber`).then(result => {
      if (result) {
        setParticipantsList(result || []);
      }
    });
  }, [lazyParams]);

  const getTraining = orgId => {
    if (orgId) {
      getService(`training/getList/${orgId}`, {}).then(result => {
        if (result) {
          const listResult = result.content || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setList(listResult);
          setSelectedRows([]);
        }
      });
    } else {
      onInit();
    }
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
    setTrainingID(row.id);
    event.preventDefault();
    event.stopPropagation();
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const onPage = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter = event => {
    const params = { ...lazyParams, ...event };
    params.first = 0;
    setLazyParams(params);
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
      {toolsStore.user.roleId === 9 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faPen} />}
          onClick={event => edit(event, row)}
        />
      )}
      {toolsStore.user.roleId === 9 ? (
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

  const aimagBody = row => (
    <>
      <span className="p-column-title">Аймаг</span>
      {row.address?.childrenAddress.map(z => (
        <p>
          {z.aimag.name} <br />
        </p>
      ))}
    </>
  );

  const sumBody = row => (
    <>
      <span className="p-column-title">Аймаг</span>
      {row.address?.childrenAddress.map(z => (
        <p>
          {z.soum.name} <br />
        </p>
      ))}
    </>
  );

  const startDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Эхэлсэн огноо</span>
      {moment(row.trainingStartDate && row.trainingStartDate).format(
        'YYYY-MM-DD'
      )}
    </>
  );

  const endDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Дууссан огноо</span>
      {moment(row.trainingEndDate && row.trainingEndDate).format('YYYY-MM-DD')}
    </>
  );

  const participantBodyTemplate = row => (
    <>
      <span className="p-column-title">Оролцогчдын тоо</span>
      {row.totalParticipants}
    </>
  );

  const orgName = row => (
    <>
      <span className="p-column-title">Байгууллага</span>
      {row.organization.name}
    </>
  );

  const ShowTrainingInfo = row => history.push(`/trainingList/${row.data.id}`);

  function exportTab() {
    window.open(`/exportTrainingList`);
  }

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={10}>
              <p className="title">Сургалтын жагсаалт</p>
              {toolsStore.user.roleId === 1 || toolsStore.user.roleId === 3 ? (
                <pre
                  style={{
                    fontSize: '16px',
                    color: 'grey',
                  }}
                >
                  Нийт оролцогчид: {participantsList?.total} Эрэгтэй:{' '}
                  {participantsList?.male} Эмэгтэй: {participantsList?.female}{' '}
                </pre>
              ) : (
                ''
              )}
            </Col>

            <Col xs={24} md={18} lg={14}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={12} lg={8}>
                  {toolsStore?.user?.roleId === 1 ||
                  toolsStore?.user?.roleId === 3 ? (
                    <Select
                      showSearch
                      allowClear
                      placeholder="Байгууллагаар хайх"
                      onChange={value => selectOrgs(value)}
                      style={{ width: ' 100%' }}
                      size="small"
                      defaultActiveFirstOption={false}
                      notFoundContent={null}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {toolsStore.orgList &&
                        toolsStore.orgList.map((z, index) => (
                          <Option key={index} value={z.id}>
                            {z.name ? z.name : 'Тодорхойгүй'}
                          </Option>
                        ))}
                    </Select>
                  ) : (
                    ''
                  )}
                </Col>

                {toolsStore.user.role.id === 1 ||
                toolsStore.user.role.id === 3 ? (
                  <Col xs={8} md={2} lg={2}>
                    <Tooltip title={t('export')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFileExcel} />}
                        onClick={() => exportTab()}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                ) : (
                  ''
                )}

                {toolsStore.user.role.id === 1 ||
                toolsStore.user.role.id === 3 ? (
                  <Col xs={8} md={2} lg={2}>
                    <Tooltip title={t('add')} arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={add}
                      />
                    </Tooltip>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <div className="datatable-selection-demo">
            <DataTable
              ref={dt}
              selectionMode="single"
              emptyMessage="Өгөгдөл олдсонгүй..."
              value={list}
              first={lazyParams.first}
              rows={PAGESIZE}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyParams.sortField}
              sortOrder={lazyParams.sortOrder}
              onFilter={onFilter}
              filters={lazyParams.filters}
              lazy
              paginator
              className="p-datatable-responsive-demo"
              selection={selectedRows}
              onRowClick={ShowTrainingInfo}
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
                field="name"
                header="Сургалтын сэдэв"
                filter
                body={NameBodyTemplate}
                sortable
                filterPlaceholder="Хайх"
                filterMatchMode="contains"
              />
              <Column
                field="address.aimags"
                header="Аймаг"
                filter
                body={aimagBody}
                sortable
                filterPlaceholder="Хайх"
                filterMatchMode="contains"
              />
              <Column
                field="address.soums"
                header="Сум"
                filter
                body={sumBody}
                sortable
                filterPlaceholder="Хайх"
                filterMatchMode="contains"
              />
              <Column
                field="startDateFormat"
                header="Эхэлсэн огноо"
                filterMatchMode="startsWith"
                sortable
                filterPlaceholder="Хайх"
                filter
                body={startDateBodyTemplate}
              />
              <Column
                field="endDateFormat"
                header="Дууссан огноо"
                sortable
                body={endDateBodyTemplate}
                filterPlaceholder="Хайх"
                filter
                filterMatchMode="startsWith"
              />
              <Column
                field="totalParticipants"
                header="Оролцогчдын тоо"
                filterPlaceholder="Хайх"
                filter
                sortable
                body={participantBodyTemplate}
                filterMatchMode="equals"
              />
              <Column
                field="organization.name"
                header="Байгууллага"
                filterPlaceholder="Хайх"
                filter
                sortable
                body={orgName}
                filterMatchMode="equals"
              />
              <Column headerStyle={{ width: '6rem' }} body={action} />
            </DataTable>
            {isModalVisible && (
              <TrainingModal
                Trainingcontroller={editRow}
                isModalVisible={isModalVisible}
                close={closeModal}
                isEditMode={isEditMode}
                orgId={orgID}
                trainingID={trainingID}
              />
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TrainingList;
