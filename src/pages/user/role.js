import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import {
  deleteService,
  getService,
  postService,
  putService,
} from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import RoleModal from './components/RoleModal';

const MenuConfig = React.lazy(() => import('./components/MenuConfig'));
const { Content } = Layout;

let isEditMode;
let selectedRole;
let editRow;

export default function Roles() {
  const { t } = useTranslation();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfigMenu, setIsShowConfigMenu] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);

  let loadLazyTimeout = null;

  const loadData = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService('role/get', obj)
        .then(data => {
          const listResult = data.content || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(data.totalElements);
          setList(listResult);
        })
        .finally(toolsStore.setIsShowLoader(false))
        .catch(error => {
          message.error(error.toString());
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };

  useEffect(() => {
    loadData();
  }, [lazyParams]);

  const save = role => {
    if (isEditMode) {
      putService(`role/update/${role.id}`, role)
        .then(() => {
          setIsShowModal(false);
          loadData();
        })
        .catch(error => errorCatch(error));
    } else {
      postService('role/post', role)
        .then(() => {
          setIsShowModal(false);
          setSelectedRow({});
          loadData();
        })
        .catch(error => errorCatch(error));
    }
  };

  const add = () => {
    setIsShowModal(true);
    isEditMode = false;
  };

  const edit = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    isEditMode = true;
    editRow = row;
    setIsShowModal(true);
    setSelectedRow(row.data);
  };

  const closeModal = (isSuccess = false) => {
    setIsShowModal(false);
    if (isSuccess) loadData();
  };

  const roleBodyTemplate = rowData => (
    <>
      <Button
        style={{ marginLeft: 10 }}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setIsShowConfigMenu(true);
          selectedRole = rowData;
        }}
      >
        {t('Set the menu')}
      </Button>
    </>
  );

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }
    deleteService(`role/delete/${row.id}`)
      .then(() => {
        message.success('?????????????????? ????????????');
        loadData();
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
        loadData();
      },
      onCancel() {},
    });
  }

  const pop = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
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
        onClick={event => edit(event, row)}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={event => pop(event, row)}
      />
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

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">{t('User role')}</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
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
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <DataTable
            ref={dt}
            value={list}
            removableSort
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
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRow}
            editMode="row"
            onSelectionChange={e => {
              setSelectedRow(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" header="???" style={{ width: 40 }} />
            <Column field="name" header={t('Role name')} />
            <Column
              field=""
              header={t('Action')}
              style={{ width: 200, textAlign: 'right' }}
              body={roleBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
        </div>
        {isShowModal && (
          <RoleModal
            visible={isShowModal}
            isEditMode={isEditMode}
            roleController={editRow}
            close={closeModal}
            save={save}
          />
        )}
        {isShowConfigMenu && selectedRole && (
          <Suspense fallback={<div>...</div>}>
            <MenuConfig
              visible={isShowConfigMenu}
              role={selectedRole}
              close={() => setIsShowConfigMenu(false)}
            />
          </Suspense>
        )}
      </div>
    </ContentWrapper>
  );
}
