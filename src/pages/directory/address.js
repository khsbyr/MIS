import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPrint,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { getService, deleteService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import OrgaStyle from '../training/tabs/components/orga.style';
import AutoCompleteSelect from '../../components/Autocomplete';
import AddressModal from './components/AddressModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Address = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stateCountry, setStateCountry] = useState([]);
  const [countryID, setCountryID] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [aimagID, setAimagID] = useState([]);
  const [stateSoum, setStateSoum] = useState([]);
  const [soumID, setSoumID] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('country/get', list)
      .then(result => {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  useEffect(() => {
    onInit();
    getService('country/get').then(result => {
      if (result) {
        setStateCountry(result || []);
      }
    });
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  }, [lazyParams]);

  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
        setCountryID(countryID);
      }
    });
  };
  const getSoum = aimagId => {
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setStateSoum(result || []);
        setSelectedRows([]);
        setAimagID(aimagID);
      }
    });
  };
  const getbag = soumId => {
    getService(`bag/getList/${soumId}`, {}).then(result => {
      if (result) {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
        setSoumID(soumID);
      }
    });
  };
  const selectCountry = value => {
    getAimag(value);
  };
  const selectAimag = value => {
    getSoum(value);
  };
  const selectSoum = value => {
    getbag(value);
  };
  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }

    deleteService(`country/delete/${row.id}`)
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

  const pop = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
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
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Улсын нэр</span>
      {row.name}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Хаяг</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={5}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Улс сонгох"
                        data={stateCountry}
                        onChange={value => selectCountry(value)}
                      />
                    </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={5}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Аймаг сонгох"
                        data={stateAimag}
                        onChange={value => selectAimag(value)}
                      />
                    </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={5}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Сум сонгох"
                        data={stateSoum}
                        onChange={value => selectSoum(value)}
                      />
                    </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
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
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" body={indexBodyTemplate} sortable />
            <Column
              field="name"
              body={nameBodyTemplate}
              header="Улсын нэр"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <AddressModal
              Addresscontroller={editRow}
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

export default Address;
