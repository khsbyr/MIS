import React, { useState, useEffect, Suspense, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, message, Layout, Checkbox, Row, Col } from 'antd';
import {
  faFileExcel,
  faPlus,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToolsContext } from '../../context/Tools';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import { getService, postService, putService } from '../../service/service';
import { PAGESIZE } from '../../constants/Constant';
import RoleModal from './components/RoleModal';
import ContentWrapper from '../criteria/criteria.style';

const RoleConfig = React.lazy(() => import('./components/RoleConfig'));
const MenuConfig = React.lazy(() => import('./components/MenuConfig'));
const { Content } = Layout;

let isEditMode;
let selectedRole;

export default function Roles() {
  const [list, setList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfig, setIsShowConfig] = useState(false);
  const [isShowConfigMenu, setIsShowConfigMenu] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [lazyParams] = useState({
    first: 0,
    page: 0,
  });
  const toolsStore = useContext(ToolsContext);

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
          const listResult = data || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
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

  const edit = row => {
    isEditMode = true;
    setIsShowModal(true);
    setSelectedRow(row.data);
  };

  const closeModal = (isSuccess = false) => {
    setIsShowModal(false);
    if (isSuccess) loadData();
  };

  const activeBodyTemplate = rowData => (
    <Checkbox defaultChecked={rowData.isActive} disabled />
  );

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
        Цэс тохируулах
      </Button>
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Эрхийн тохиргоо</p>
              </Col>
              <Col xs={16} md={16} lg={10}>
                <Row justify="end" gutter={[16, 16]}>
                  <Col xs={8} md={4} lg={4}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={4} lg={4}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={4} lg={4}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={add}
                    >
                      Нэмэх
                    </Button>
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
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRow}
            editMode="row"
            onSelectionChange={e => {
              setSelectedRow(e.value);
            }}
            dataKey="id"
            onRowClick={edit}
          >
            <Column field="index" header="№" style={{ width: 40 }} />
            <Column field="name" header="Дүрийн нэр" sortable filter />
            <Column
              field="isActive"
              header="Идэвхтэй эсэх"
              sortable
              style={{ width: '25%', textAlign: 'center' }}
              body={activeBodyTemplate}
            />
            <Column
              field=""
              header="Үйлдэл"
              style={{ width: 200, textAlign: 'right' }}
              body={roleBodyTemplate}
            />
          </DataTable>
        </div>
        {isShowModal && (
          <RoleModal
            visible={isShowModal}
            isEditMode={isEditMode}
            roleController={selectedRow}
            close={closeModal}
            save={save}
          />
        )}
        {isShowConfig && selectedRole && (
          <Suspense fallback={<div>...</div>}>
            <RoleConfig
              visible={isShowConfig}
              role={selectedRole}
              close={() => setIsShowConfig(false)}
            />
          </Suspense>
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
