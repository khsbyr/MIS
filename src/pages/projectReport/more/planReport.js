import { Col, Layout, Row } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { PAGESIZE } from '../../../constants/Constant';
import { ToolsContext } from '../../../context/Tools';
import { getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/organization.style';
import ActivityModal from '../components/activityModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const loadLazyTimeout = null;

const PlanReport = props => {
  const dt = useRef(null);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toolsStore = useContext(ToolsContext);
  const [lazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService(`/planReport/getByPlan/${props.id}`)
      .then(result => {
        const listResult = result.content;
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

  const LastnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Овог</span>
      {row.user.lastname}
    </>
  );

  const nameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.user.firstname}
    </>
  );

  const performance = row => (
    <>
      <span className="p-column-title">Гүйцэтгэл</span>
      {row.performance}
    </>
  );

  const date = row => (
    <>
      <span className="p-column-title">Он, сар</span>
      {moment(row && row.dateFormat).format('YYYY-MM')}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={18} md={12} lg={24}>
                <Row justify="end" gutter={[16, 16]} />
              </Col>
            </Row>
          </Content>
        </Layout>
        <div className="datatable-responsive-demo">
          <DataTable
            ref={dt}
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            first={lazyParams.first}
            rows={PAGESIZE}
            lazy
            paginator
            className="p-datatable-responsive-demo"
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="user.lastname"
              body={LastnameBodyTemplate}
              header="Овог"
            />
            <Column
              field="user.firstname"
              body={nameBodyTemplate}
              header="Нэр"
            />
            <Column field="performance" body={performance} header="Гүйцэтгэл" />
            <Column field="dateFormat" body={date} header="Он, сар" />
          </DataTable>
          {isModalVisible && (
            <ActivityModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              id={props.id}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default PlanReport;
