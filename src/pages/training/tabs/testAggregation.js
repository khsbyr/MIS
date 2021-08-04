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
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import CriteriaModal from '../../criteria/components/CriteriaModal';
import ContentWrapper from '../../criteria/criteria.style';
import OrgaStyle from './components/orga.style';
import AutoCompleteSelect from '../../../components/Autocomplete';

const { Content } = Layout;

let editRow;
let isEditMode;
const TestAggregation = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stateTraining, setStateTraining] = useState([]);

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
    getService('testAggregation/get', list)
      .then(result => {
        const listResult = result.content || [];
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
    getService('training/get').then(result => {
      if (result) {
        setStateTraining(result.content || []);
      }
    });
  }, [lazyParams]);

  const selectTraining = value => {};
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

    putService(`testAggregation/delete/${row.id}`)
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
      <span className="p-column-title">Оролцогчийн нэр</span>
      {row.name}
    </>
  );

  const test1ShouldTakenBodyTemplate = row => (
    <>
      <span className="p-column-title">Сорил №1: Авбал зохих</span>
      {row.indicatorProcess}
    </>
  );

  const test1TakenBodyTemplate = row => (
    <>
      <span className="p-column-title">Сорил №1: Авсан</span>
      {row.indicatorProcess}
    </>
  );

  const test2ShouldTakenBodyTemplate = row => (
    <>
      <span className="p-column-title">Сорил №2: Авбал зохих</span>
      {row.indicatorProcess}
    </>
  );

  const test2TakenBodyTemplate = row => (
    <>
      <span className="p-column-title">Сорил №2: Авсан</span>
      {row.indicatorProcess}
    </>
  );

  const growthBodyTemplate = row => (
    <>
      <span className="p-column-title">Өсөлт бууралт</span>
      {row.indicatorProcess}
    </>
  );

  const explanationBodyTemplate = row => (
    <>
      <span className="p-column-title">Тайлбар</span>
      {row.indicatorProcess}
    </>
  );

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="№" rowSpan={2} />
        <Column header="Оролцогчийн нэр" rowSpan={2} />
        <Column header="Сорил №1" colSpan={2} />
        <Column header="Сорил №2" colSpan={2} />
        <Column header="Өсөлт бууралт" rowSpan={2} />
        <Column header="Тайлбар" rowSpan={2} />
        <Column headerStyle={{ width: '7rem' }} body={action} rowSpan={2} />
      </Row>
      <Row>
        <Column header="Авбал зохих" sortable field="indicatorProcess" />
        <Column header="Авсан" sortable />
        <Column header="Авбал зохих" sortable />
        <Column header="Авсан" sortable />
      </Row>
    </ColumnGroup>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сорилын нэгтгэл</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={10} />
                  <Col xs={8} md={8} lg={5}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Сургалт сонгох"
                        data={stateTraining}
                        onChange={value => selectTraining(value)}
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
            headerColumnGroup={headerGroup}
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
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="indicatorProcess"
              body={test1ShouldTakenBodyTemplate}
              sortable
            />
            <Column
              field="upIndicator"
              body={test1TakenBodyTemplate}
              sortable
            />
            <Column field="upIndicator" body={test2ShouldTakenBodyTemplate} />
            <Column field="upIndicator" body={test2TakenBodyTemplate} />
            <Column field="upIndicator" body={growthBodyTemplate} />
            <Column field="upIndicator" body={explanationBodyTemplate} />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CriteriaModal
              Criteriacontroller={editRow}
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

export default TestAggregation;