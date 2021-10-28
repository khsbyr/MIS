/* eslint-disable no-nested-ternary */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faFilePdf,
  faHistory,
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
  Table,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { PAGESIZE, PlanType } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { deleteService, getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from './more/report.style';
import ReportModal from './components/reportModal';
import AutocompleteSelect from '../../components/Autocomplete';
import DescriptionModal from './components/DescriptionModal';

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
    dataIndex: ['planReportStatus', 'status'],
    key: ['planReportStatus', 'status'],
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

const Report = () => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  // const [planList, setPlanList] = useState();
  const [status, setStatus] = useState();
  const [visible, setVisible] = useState(false);
  const [reportId, setReportId] = useState();

  let loadLazyTimeout = null;

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url = value ? `/planReport/getByPlan/${value}` : `planReport/get`;
      getService(`${url}`, obj)
        .then(result => {
          const listResult = result.content || [];
          setList(listResult);
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });

          setTotalRecords(result.totalElements);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
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
    deleteService(`/planReport/delete/${row.id}`)
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

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const modalClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    onInit();
    getService('planReportStatus/get').then(result => {
      if (result) {
        setStatus(result || []);
      }
    });
    // getService('/plan/get').then(result => {
    //   if (result) {
    //     setPlanList(result.content || []);
    //   }
    // });
  }, [lazyParams]);

  // const selectPlan = value => {
  //   onInit(value);
  // };

  const info = row => {
    getService(`planReportStatusHistory/get/${row.id}`).then(result => {
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
      {row.plan.typeId === 1 ? (
        <Tooltip title="Төлөвийн түүх харах">
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faHistory} />}
            onClick={() => info(row)}
          />
        </Tooltip>
      ) : (
        ''
      )}
    </>
  );

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Төлөвлөгөөний нэр</span>
      <Tooltip placement="topLeft" title={row.plan.name}>
        {row.plan.name}
      </Tooltip>
    </>
  );

  const firstnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэгч</span>

      {row?.user?.firstname}
    </>
  );

  const indicatorProcessBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэл</span>
      <Tooltip placement="topLeft" title={row.performance}>
        {row.performance}
      </Tooltip>
    </>
  );

  const upIndicatorBodyTemplate = row => (
    <>
      <span className="p-column-title">Он, сар</span>
      {moment(row && row.dateFormat).format('YYYY-MM')}
    </>
  );
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

  // const handleSearch = value => {
  //   if (loadLazyTimeout) {
  //     clearTimeout(loadLazyTimeout);
  //   }
  //   loadLazyTimeout = setTimeout(() => {
  //     getService(`plan/get?search=name:*${value}*`).then(result => {
  //       if (result) {
  //         setPlanList(result.content);
  //       }
  //     });
  //   }, 300);
  // };

  const selectType = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url =
        value === 1
          ? `planReport/getByTypeId/1`
          : value === 0
          ? `planReport/get?search=plan.typeId:0`
          : `planReport/get`;
      getService(url, obj)
        .then(result => {
          const listResult = result.content || [];
          setList(listResult);
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });

          setTotalRecords(result.totalElements);
          setSelectedRows([]);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };

  const onChangeStatus = value => {
    if (value === '3') {
      setVisible(true);
    } else {
      const datas = {
        statusId: value,
        planReportId: reportId,
      };
      putService(`planReportStatus/updatePlanReportStatus`, datas)
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    }
  };

  const selectedStatus = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    setReportId(row.id);
  };

  const getColor = id => {
    switch (id) {
      case 1:
        return 'processing';
      case 2:
        return 'success';
      case 3:
        return 'error';
      default:
        return 'processing';
    }
  };

  const statusBodyTemplate = row => (
    <>
      <span className="p-column-title">Статус</span>
      {row.plan.typeId === 1 ? (
        <Select
          disabled={toolsStore.user.role.id !== 4}
          defaultValue={
            <Tag color={getColor(row.planReportStatus.id)}>
              {row.planReportStatus.status}
            </Tag>
          }
          onChange={onChangeStatus}
          onClick={event => selectedStatus(event, row)}
          style={{ width: '100%', background: 'unset' }}
        >
          {status?.map(z => (
            <Option key={z.id}>
              <Tag color={getColor(z.id)}>{z.status}</Tag>
            </Option>
          ))}
        </Select>
      ) : (
        'Тодорхойгүй'
      )}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={10}>
              <p className="title">{t('report')}</p>
            </Col>
            <Col xs={24} md={18} lg={14}>
              <Row justify="end" gutter={[16, 16]}>
                {toolsStore?.user?.roleId === 1 ||
                toolsStore?.user?.roleId === 4 ? (
                  <Col xs={12} md={12} lg={7}>
                    <AutocompleteSelect
                      valueField="id"
                      data={PlanType}
                      placeholder="Төрөл сонгох"
                      onChange={value => selectType(value)}
                    />
                  </Col>
                ) : (
                  ''
                )}
                {/* <Col xs={12} md={12} lg={11}>
                  <Select
                    valueField="id"
                    data={planList}
                    size="small"
                    style={{ width: '100%' }}
                    placeholder="Төлөвлөгөөний нэрээр хайх"
                    onChange={value => selectPlan(value)}
                    onSearch={handleSearch}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    notFoundContent={null}
                    allowClear
                    showSearch
                  >
                    {planList &&
                      planList.map((z, index) => (
                        <Option key={index} value={z.id}>
                          <Tooltip placement="topLeft" title={z.name}>
                            {z.name}
                          </Tooltip>
                        </Option>
                      ))}
                  </Select>
                </Col> */}
                <Col xs={8} md={3} lg={2}>
                  <Tooltip title={t('print')} arrowPointAtCenter>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
                <Col xs={8} md={3} lg={2}>
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
                <Col xs={8} md={3} lg={2}>
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
                <Col xs={8} md={3} lg={2}>
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
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
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
              header="№"
              headerStyle={{ width: '4rem' }}
              body={indexBodyTemplate}
            />
            <Column
              field="plan.name"
              header="Төлөвлөгөөний нэр"
              body={nameBodyTemplate}
              filter
              sortable
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="user.firstname"
              header="Гүйцэтгэгч"
              body={firstnameBodyTemplate}
              filter
              sortable
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="performance"
              header="Гүйцэтгэл"
              body={indicatorProcessBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              field="dateFormat"
              header="Он, сар"
              body={upIndicatorBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
              filterMatchMode="startsWith"
            />
            <Column
              header="Төлөв"
              body={statusBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '10rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ReportModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
            />
          )}
          {visible && (
            <DescriptionModal
              isModalVisible={visible}
              close={modalClose}
              planReportId={reportId}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Report;
