import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
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
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import TrainingParticipantsModal from './components/trainingParticipantsModal';

const { Content } = Layout;
const { Option } = Select;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const TrainingParticipants = props => {
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toolsStore = useContext(ToolsContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const dt = useRef(null);
  const [TrainingList, setTrainingList] = useState();

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      const url = value
        ? `participants/get?search=trainingProgram.training.id:${value}`
        : `participants/get`;
      getService(url, obj)
        .then(data => {
          const dataList = data.content || [];
          setTrainingID(props.id);
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
    // getService(`training/get`).then(result => {
    //   if (result) {
    //     setTrainingList(result.content || []);
    //   }
    // });
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
    const params = { ...lazyParams, ...event };
    params.first = 0;
    setLazyParams(params);
  };

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`participants/delete/${row.id}`)
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

  const pop = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
    } else {
      confirm(row);
    }
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
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );

  const FirstNameBodyTemplate = row => (
    <>
      <span className="p-column-title">??????</span>
      {row.user.firstname}
    </>
  );

  const LastNameBodyTemplate = row => (
    <>
      <span className="p-column-title">????????</span>
      {row.user.lastname}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????? ????????????</span>
      {row.user.register}
    </>
  );

  // const trainingProgram = row => (
  //   <>
  //     <span className="p-column-title">????????????????</span>
  //     {row.trainingProgram.operation
  //       ? row.trainingProgram.operation
  //       : '??????????????????????'}
  //   </>
  // );

  const phone = row => (
    <>
      <span className="p-column-title">????????</span>
      {row.user.phoneNumber}
    </>
  );

  const jobDesc = row => (
    <>
      <span className="p-column-title">???????? ??????????????</span>
      {row.jobDescription ? row.jobDescription : '??????????????????????'}
    </>
  );

  const gender = row => (
    <>
      <span className="p-column-title">????????</span>
      {row.gender.gender}
    </>
  );

  function selectTraining(value) {
    if (value) {
      onInit(value);
    } else {
      onInit();
    }
  }

  const handleSearch = value => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      getService(`training/get?search=name:*${value}*`).then(result => {
        if (result) {
          setTrainingList(result.content);
        }
      });
    }, 300);
  };

  const options = TrainingList?.map(d => (
    <Option key={d.id}>
      <Tooltip placement="topLeft" title={d.name}>
        {d.name}
      </Tooltip>
    </Option>
  ));

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">?????????????????? ????????????????????</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col xs={12} md={12} lg={12}>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    onChange={value => selectTraining(value)}
                    placeholder="?????????????????? ???????????? ????????"
                    size="small"
                    allowClear
                    onSearch={handleSearch}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    notFoundContent={null}
                  >
                    {options}
                  </Select>
                </Col>
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
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="???"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="user.lastname"
              header="????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={LastNameBodyTemplate}
              filterMatchMode="contains"
            />
            <Column
              field="user.firstname"
              header="??????"
              sortable
              filter
              filterPlaceholder="????????"
              body={FirstNameBodyTemplate}
              filterMatchMode="contains"
            />
            <Column
              field="user.register"
              header="???????????????????? ????????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={registerNumberBodyTemplate}
              filterMatchMode="startsWith"
            />
            <Column
              field="user.phoneNumber"
              header="????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={phone}
              filterMatchMode="startsWith"
            />
            <Column
              field="jobDescription"
              header="???????? ??????????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={jobDesc}
              filterMatchMode="contains"
            />
            <Column
              field="gender.gender"
              header="????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={gender}
              filterMatchMode="contains"
            />
            {/* <Column
              field="trainingProgram.operation"
              header="????????????????"
              sortable
              filter
              filterPlaceholder="????????"
              body={trainingProgram}
              filterMatchMode="contains"
            /> */}
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TrainingParticipantsModal
              Attendancecontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TrainingParticipants;
