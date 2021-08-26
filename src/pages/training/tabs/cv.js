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
  Tooltip,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext, useRef } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { useToolsStore } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import ContentWrapper from '../../criteria/criteria.style';
import CvModal from './components/CvModal';
import OrgaStyle from './components/orga.style';
import { PAGESIZE } from '../../../constants/Constant';

const { Content } = Layout;

let editRow;
let isEditMode;
let trainerID;
let loadLazyTimeout = null;

const CV = () => {
  const toolsStore = useToolsStore();
  const [totalRecords, setTotalRecords] = useState(0);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const dt = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [OrgID, setOrgID] = useState([]);
  const [isOnChange, setIsOnChange] = useState(false);
  // const onInit = () => {
  //   toolsStore.setIsShowLoader(true);
  //   if (loadLazyTimeout) {
  //     clearTimeout(loadLazyTimeout);
  //   }
  //   getService(`user/getAllTrainerUserList`, list)
  //     .then(result => {
  //       const listResult = result || [];
  //       listResult.forEach((item, index) => {
  //         item.index = lazyParams.page * PAGESIZE + index + 1;
  //       });
  //       setList(listResult);
  //       setSelectedRows([]);
  //     })
  //     .finally(toolsStore.setIsShowLoader(false))
  //     .catch(error => {
  //       errorCatch(error);
  //       toolsStore.setIsShowLoader(false);
  //     });
  // };

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService('user/getAllTrainerUserList', obj)
        .then(data => {
          const dataList = data || [];
          dataList.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(data.totalElements);
          setList(dataList);
          toolsStore.setIsShowLoader(false);
        })
        .catch(error => {
          message.error(error.toString());
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };
  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const selectOrg = value => {
    setIsOnChange(true);
    getService(`user/getTrainerListByOrgId/${value}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = index + 1;
        });
        setList(listResult);
        setOrgID(value);
        setSelectedRows([]);
      }
    });
  };

  const add = () => {
    if (isOnChange === false) {
      message.warning('Байгууллага сонгоно уу!');
    } else {
      editRow = null;
      setIsModalVisible(true);
      isEditMode = false;
    }
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainers/delete/${row.trainers.id}`)
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
        // onInit();
      },
      onCancel() {},
    });
  }

  const pop = row => {
    if (isOnChange === false) {
      message.warning('Байгууллага сонгоно уу!');
    } else if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  const edit = row => {
    if (isOnChange === false) {
      message.warning('Байгууллага сонгоно уу!');
    } else {
      trainerID = row.trainers.id;
      editRow = row;
      isEditMode = true;
      setIsModalVisible(true);
    }
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

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.firstname}
    </>
  );

  const LastNameBodyTemplate = row => (
    <>
      <span className="p-column-title">Овог</span>
      {row.lastname}
    </>
  );

  const phoneBodyTemplate = row => (
    <>
      <span className="p-column-title">Утас</span>
      {row.phoneNumber}
    </>
  );

  const registerBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургагч багшийн регистер</span>
      {row.register}
    </>
  );
  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={24} lg={14}>
              <p className="title">Хүний нөөц</p>
            </Col>
            <Col xs={24} md={18} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={6} lg={7}>
                  <OrgaStyle>
                    <AutoCompleteSelect
                      valueField="id"
                      placeholder="Байгууллага сонгох"
                      data={toolsStore.orgList}
                      onChange={value => selectOrg(value)}
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
            ref={dt}
            lazy
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            removableSort
            paginator
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
            tableStyle={{ minWidth: 1000 }}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
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
              header="Овог"
              field="firstname"
              body={LastNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Нэр"
              field="lastname"
              body={FirstNameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Утас"
              field="phoneNumber"
              body={phoneBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="register"
              header="Сургагч багшийн регистер"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CvModal
              Trainerscontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              orgId={OrgID}
              trainerID={trainerID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default CV;
