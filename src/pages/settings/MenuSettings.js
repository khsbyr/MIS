import React, { useState, useEffect, Suspense, useContext } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button, message, Layout, Checkbox, Tooltip, Row, Col } from 'antd';
import {
  FolderAddFilled,
  DeleteFilled,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import {
  faFileExcel,
  faPlus,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToolsContext } from '../../context/Tools';
import { errorCatch, isEmptyObject, sortArray } from '../../tools/Tools';
import {
  deleteService,
  getService,
  patchService,
  postService,
  putService,
} from '../../service/service';
import MenuModal from './components/MenuModal';
import { Confirm } from '../../components/Confirm';
import './style.module.scss';
import { MSG } from '../../constants/Constant';
import ContentWrapper from '../criteria/criteria.style';

const { Content } = Layout;
let isEditMode;
const url = '/menus/get';

export default function MenuSettings() {
  const toolsStore = useContext(ToolsContext);
  const [menuList, setMenuList] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const convertTree = listArg => {
    const list = listArg;
    console.log(list);
    list.forEach(menu => {
      console.log(menu);
      menu.key = menu.id;
      menu.data = menu;
      menu.menus = convertTree(menu.menus);
    });
    return sortArray(list, 'priority');
  };

  const loadData = () => {
    toolsStore.setIsShowLoader(true);
    getService(url)
      .then(data => {
        const list = data.content || [];
        console.log(convertTree(list));
        setMenuList(convertTree(list));
        setSelectedMenus([]);
        toolsStore.setIsShowLoader(false);
      })
      .catch(error => {
        message.error(error.message);
        toolsStore.setIsShowLoader(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const save = menu => {
    toolsStore.setIsShowLoader(true);
    if (isEditMode) {
      putService(`${url}/${menu.id}`, menu)
        .then(() => {
          setIsShowModal(false);
          loadData();
        })
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    } else {
      postService(url, menu)
        .then(() => {
          setIsShowModal(false);
          setSelectedRow({});
          loadData();
        })
        .catch(error => {
          errorCatch(error);
          toolsStore.setIsShowLoader(false);
        });
    }
  };

  function deleteMenuPromise() {
    return new Promise((resolve, reject) => {
      Object.entries(selectedMenus).forEach(([key, menu]) => {
        if (menu.checked) {
          deleteService(`${url}/${key}`)
            .then(() => resolve('ok'))
            .catch(error => {
              reject(error);
            });
        }
      });
    });
  }

  async function deleteData() {
    toolsStore.setIsShowLoader(true);
    try {
      await deleteMenuPromise().then(result => {
        if (result === 'ok') {
          message.success(MSG.SUCCESS_DEL);
          loadData();
        }
      });
    } catch (error) {
      errorCatch(error);
    } finally {
      toolsStore.setIsShowLoader(false);
    }
  }

  const add = () => {
    setIsShowModal(true);
    isEditMode = false;
  };

  const remove = () => {
    if (isEmptyObject(selectedMenus)) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    Confirm(deleteData);
  };

  const onSelecttion = e => {
    e.originalEvent.preventDefault();
    e.originalEvent.stopPropagation();
    // e.stopPropagation();
    setSelectedMenus(e.value);
  };

  const edit = row => {
    isEditMode = true;
    setIsShowModal(true);
    setSelectedRow(row.node);
  };

  const activeBodyTemplate = rowData => (
    <Checkbox defaultChecked={rowData.isSeparator} disabled />
  );

  const priorityBodyTemplate = row => {
    const priorityChange = (e, isUp) => {
      e.preventDefault();
      e.stopPropagation();
      const serviceName = isUp ? 'priorityUp' : 'priorityDown';
      patchService(`${url}/${serviceName}/${row.id}`).then(() => {
        loadData();
      });
    };
    return (
      <div className="priority">
        <Tooltip placement="left" title="Дээш">
          <Button
            icon={<CaretUpOutlined />}
            size="small"
            className="priorityBtn"
            onClick={e => priorityChange(e, true)}
          />
        </Tooltip>
        <Tooltip placement="left" title="Доош">
          <Button
            icon={<CaretDownOutlined />}
            size="small"
            className="priorityBtn"
            onClick={e => priorityChange(e, false)}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Цэсний жагсааалт</p>
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
          <TreeTable
            value={menuList}
            selectionMode="checkbox"
            className="p-datatable-responsive-demo"
            selectionKeys={selectedMenus}
            onSelectionChange={onSelecttion}
            onRowClick={edit}
          >
            <Column
              field="priority"
              header="Дараалал"
              style={{ width: '60px' }}
            />
            <Column field="name" header="Цэсний нэр" expander filter />
            <Column field="description" header="Нэр" filter />
            <Column
              field="url"
              header="Цэсний URL хаяг"
              filter
              style={{ width: '20%' }}
            />
            <Column
              field="isSeparator"
              header="Холбоостой эсэх"
              style={{ width: 80, textAlign: 'center' }}
              body={activeBodyTemplate}
            />
            <Column
              field=""
              header="Дараалал өөрчлөх"
              style={{ width: 100 }}
              body={priorityBodyTemplate}
            />
          </TreeTable>
        </div>
        {isShowModal && (
          <Suspense fallback={<div>...</div>}>
            <MenuModal
              visible={isShowModal}
              isEditMode={isEditMode}
              editValue={selectedRow}
              close={() => setIsShowModal(false)}
              save={save}
            />
          </Suspense>
        )}
      </div>
    </ContentWrapper>
  );
}
