import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { useProjectStore } from '../../context/ProjectContext';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../training/tabs/components/organization.style';
import OrganizationModal from '../training/tabs/components/OrganizationModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const ProjectOrg = () => {
  const loadLazyTimeout = null;
  const { ProjectList } = useProjectStore();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const PAGESIZE = 20;
  const [lazyParams] = useState({
    page: 0,
  });
  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService(
      `projectOrganization/getOrganizationListByProjectId/${ProjectList.id}`
    )
      .then(result => {
        const listResult = result;
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };
  useEffect(() => {
    onInit();
  }, [lazyParams]);

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
    putService(`organization/delete/${row.id}`)
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

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????????? ??????</span>
      {row.name}
    </>
  );

  const registerNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????? ????????????</span>
      {row.registerNumber}
    </>
  );

  const bankNameBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????? ??????</span>
      {row.bank?.name}
    </>
  );

  const accountNameBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????? ??????</span>
      {row.accountName}
    </>
  );

  const accountNumberBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????? ????????????</span>
      {row.accountNumber}
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
                    <Tooltip title="????????????" arrowPointAtCenter>
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPrint} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title="??????????????" arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFileExcel} />}
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
            emptyMessage="?????????????? ??????????????????..."
            rows={10}
            className="p-datatable-responsive-demo"
            dataKey="id"
          >
            <Column header="???" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column header="???????????????????????? ??????" body={nameBodyTemplate} />
            <Column
              header="???????????????????? ????????????"
              body={registerNumberBodyTemplate}
            />
            <Column header="???????????? ??????" body={bankNameBodyTemplate} />
            <Column header="???????????? ??????" body={accountNameBodyTemplate} />
            <Column header="???????????? ????????????" body={accountNumberBodyTemplate} />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <OrganizationModal
              Orgcontroller={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ProjectOrg;
