import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../training/tabs/components/organization.style';
import CertificateModal from './component/certificateModal';

const { Content } = Layout;

let editRow;
let isEditMode;

const Certificate = props => {
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
        `/makhisFrequencyOfAnalysis/getListByVeterinaryId/${props.id}`,
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
      message.warning('???????????? ???????????????? ?????????????? ????');
      return;
    }

    putService(`makhisFrequencyOfAnalysis/delete/${row.id}`)
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

  const date = row => (
    <>
      <span className="p-column-title">????, ??????</span>
      {moment(row && row.date).format('YYYY-M-D')}
    </>
  );

  const megNumber = row => (
    <>
      <span className="p-column-title">?????? ????????????</span>
      {row.megNumber}
    </>
  );

  const fromWhere = row => (
    <>
      <span className="p-column-title">??????????????</span>
      {row.fromWhere}
    </>
  );

  const aimagName = row => (
    <>
      <span className="p-column-title">???????????? ???????????????? ??????????</span>
      {row.address?.aimag ? row.address.aimag.name : '??????????????????????'}
    </>
  );

  const soumName = row => (
    <>
      <span className="p-column-title">???????????? ???????????????? ??????</span>
      {row.address?.aimag ? row.address.soum.name : '??????????????????????'}
    </>
  );

  const validDate = row => (
    <>
      <span className="p-column-title">???????????????? ??????????????</span>
      {moment(row && row.validDate).format('YYYY-M-D')}
    </>
  );

  const purpose = row => (
    <>
      <span className="p-column-title">??????????????????</span>
      {row.purpose}
    </>
  );

  const certificateNumber = row => (
    <>
      <span className="p-column-title">???????????????????????? ??????</span>
      {row.certificateNumber}
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
            emptyMessage="?????????????? ??????????????????..."
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
              header="???"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column field="date" body={date} header="????, ??????" />
            <Column field="megNumber" body={megNumber} header="?????? ????????????" />
            <Column field="fromWhere" body={fromWhere} header="??????????????" />
            <Column
              field="address.aimag.name"
              body={aimagName}
              header="???????????? ???????????????? ??????????"
            />
            <Column
              field="address.soum.name"
              body={soumName}
              header="???????????? ???????????????? ??????"
            />
            <Column
              field="validDate"
              body={validDate}
              header="???????????????? ??????????????"
            />
            <Column field="purpose" body={purpose} header="??????????????????" />
            <Column
              field="certificateNumber"
              body={certificateNumber}
              header="???????????????????????? ??????"
            />

            <Column headerStyle={{ width: '6rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <CertificateModal
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

export default Certificate;
