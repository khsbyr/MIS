import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, message, Modal, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../criteria/criteria.style';
import PlanModal from './components/PlanModal';
import OrgaStyle from './components/orga.style';
import AutoCompleteSelect from '../../../components/Autocomplete';

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

let editRow;
let isEditMode;
const Plan = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateOrga, setStateOrga] = useState([]);
  const [stateGuide, setStateGuide] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingTeam/get', list)
      .then(result => {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      })
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  useEffect(() => {
    onInit();
    getService('organization/get').then(result => {
      if (result) {
        setStateOrga(result.content || []);
      }
    });
    getService('training/get').then(result => {
      if (result) {
        setStateGuide(result.content || []);
      }
    });
  }, [lazyParams]);

  const getGuidelines = orgId => {
    getService(`training/getList/${orgId}`, {}).then(result => {
      if (result) {
        setStateGuide(result || []);
      }
    });
  };

  const selectOrgs = value => {
    getGuidelines(value);
  };

  const getParti = teamId => {
    getService(`trainingTeam/getList/${teamId}`, {}).then(result => {
      if (result) {
        const listResult = result.content || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSelectedRows([]);
      }
    });
  };

  const selectGuide = value => {
    getParti(value);
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
    putService(`trainingTeam/delete/${row.id}`)
      .then(result => {
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

  const missionBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтанд гүйцэтгэх үүрэг</span>
      {row.mission}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Багийн гишүүдийн нэрс</span>
      {row.user ? row.user.firstname : row.trainers.firstName}
      {/* {row.training.training_plan.name} */}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={6}>
                <p className="title">Сургалтын баг</p>
              </Col>
              <Col xs={24} md={24} lg={18}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={6}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Байгууллага сонгох"
                        data={stateOrga}
                        onChange={value => selectOrgs(value)}
                      />
                    </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
                    <OrgaStyle>
                      <AutoCompleteSelect
                        valueField="id"
                        placeholder="Сургалт сонгох"
                        data={stateGuide}
                        onChange={value => selectGuide(value)}
                      />
                    </OrgaStyle>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <DatePicker
                      onChange={onChange}
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
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              sortable
            />
            <Column
              header="Сургалтанд гүйцэтгэх үүрэг"
              body={missionBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              header="Багийн гишүүдийн нэрс"
              body={nameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <PlanModal
              Plancontroller={editRow}
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
export default Plan;
