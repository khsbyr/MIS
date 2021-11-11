import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../training/tabs/components/organization.style';
import ServiceModal from './component/serviceModal';

const { Content } = Layout;

let editRow;
let isEditMode;

const Service = props => {
  const { t } = useTranslation();
  const dt = useRef(null);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toolsStore = useContext(ToolsContext);
  const [lazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });

  let loadLazyTimeout = null;

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(
        `/makhisVeterinaryService/getListByVeterinaryId/${props.id}`,
        obj
      )
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
    }, 500);
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

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

    putService(`makhisVeterinaryService/delete/${row.id}`)
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

  const clinicalExamination = row => (
    <>
      <span className="p-column-title">Тандалт буюу эмнэлзүйн үзлэг</span>
      {row.clinicalExamination}
    </>
  );

  const preventionVaccination = row => (
    <>
      <span className="p-column-title">Урьдчилан сэргийлэх вакцинжуулалт</span>
      {row.preventionVaccination}
    </>
  );

  const disinfection = row => (
    <>
      <span className="p-column-title">Халдваргүйжүүлэлт</span>
      {row.disinfection}
    </>
  );

  const parasiteTreatment = row => (
    <>
      <span className="p-column-title">Паразитын эмчилгээ</span>
      {row.parasiteTreatment}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={18} md={12} lg={24}>
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
              field="clinicalExamination"
              body={clinicalExamination}
              header="Тандалт буюу эмнэлзүйн үзлэг"
            />
            <Column
              field="preventionVaccination  "
              body={preventionVaccination}
              header="Урьдчилан сэргийлэх вакцинжуулалт"
            />
            <Column
              field="disinfection"
              body={disinfection}
              header="Халдваргүйжүүлэлт"
            />
            <Column
              field="parasiteTreatment"
              body={parasiteTreatment}
              header="Паразитын эмчилгээ "
            />
            <Column headerStyle={{ width: '6rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <ServiceModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              serviceID={props.id}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Service;
