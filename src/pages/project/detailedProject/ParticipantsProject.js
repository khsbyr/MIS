/* eslint-disable no-use-before-define */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/attendance.style';
import ParticipantsProjectModal from './components/ParticipantsProjectModal';

const { Content } = Layout;

let editRow;
let isEditMode;
let loadLazyTimeout = null;

const ParticipantsProject = props => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toolsStore = useContext(ToolsContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [projectId, setProjectId] = useState();
  const [criteriaId, setCriteriaId] = useState();
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const dt = useRef(null);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(
        `farmer/getListByCriteria?criteriaId=${props.criteriaId}&projectId=${props.projectId}`,
        obj
      )
        .then(data => {
          const dataList = data || [];
          setProjectId(props.projectId);
          setCriteriaId(props.criteriaId);
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

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    putService(`farmer/delete/${row.id}`)
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

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const action = row => (
    <>
      {toolsStore.user.role.id === 21 || toolsStore.user.role.id === 19 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faPen} />}
          onClick={() => edit(row)}
        />
      )}
      {toolsStore.user.role.id === 21 || toolsStore.user.role.id === 19 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faTrash} />}
          onClick={() => pop(row)}
        />
      )}
    </>
  );

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row justify="end" gutter={[16, 16]}>
                  {toolsStore.user.role.id === 21 ||
                  toolsStore.user.role.id === 19 ? (
                    ''
                  ) : (
                    <Col>
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
        </Layout>
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
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ParticipantsProjectModal
              Attendancecontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              projectId={projectId}
              criteriaId={criteriaId}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ParticipantsProject;
