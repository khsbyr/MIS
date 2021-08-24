import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../training/tabs/components/organization.style';
import InvestmentModal from './components/ModalComponent/investmentModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const investment = props => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const PAGESIZE = 20;
  const [summaryID, setSummaryID] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService(`/project/get/${props.projectId}`, list)
      .then(result => {
        const listResult = result.summaryBallotForm.sbf_projectInvestments;
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSummaryID(result.summaryBallotForm.id);
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
    putService(`projectInvestment/delete/${row.projectInvestment.id}`)
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

  const operationExpense = row => (
    <>
      <span className="p-column-title">Үйл ажиллагаа буюу зардал</span>
      {row.projectInvestment.operationExpense}
    </>
  );

  const total = row => (
    <>
      <span className="p-column-title">Нийт дүн</span>
      {row.projectInvestment.total}
    </>
  );

  const costOfCompany = row => (
    <>
      <span className="p-column-title">Компаниас гаргах зардал хуваалт</span>
      {row.projectInvestment.costOfCompany} (
      {row.projectInvestment.percentOfCompany} %)
    </>
  );

  const projectInvestment = row => (
    <>
      <span className="p-column-title">
        МАА-н ЭЗЭН төслийн хөрөнгө оруулалт
      </span>
      {row.projectInvestment.projectInvestment} (
      {row.projectInvestment.percentOfProjectInvestment} %)
    </>
  );

  const description = row => (
    <>
      <span className="p-column-title">
        Санхүүжилтийн эх үүсвэр болон нэмэлт тайлбар
      </span>
      {row.projectInvestment.description}
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
                    <Tooltip title="Хэвлэх" arrowPointAtCenter>
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faPrint} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title="Экспорт" arrowPointAtCenter>
                      <Button
                        type="text"
                        className="export"
                        icon={<FontAwesomeIcon icon={faFileExcel} />}
                      >
                        {' '}
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip title="Нэмэх" arrowPointAtCenter>
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
            value={list}
            removableSort
            paginator
            emptyMessage="Өгөгдөл олдсонгүй..."
            rows={10}
            className="p-datatable-responsive-demo"
            dataKey="id"
          >
            <Column header="№" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column
              header="Үйл ажиллагаа буюу зардал"
              body={operationExpense}
              sortable
            />
            <Column header="Нийт дүн" body={total} />
            <Column
              header="Компаниас гаргах зардал хуваалт"
              body={costOfCompany}
            />
            <Column
              header="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт"
              body={projectInvestment}
            />
            <Column
              header="Санхүүжилтийн эх үүсвэр болон нэмэлт тайлбар"
              body={description}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <InvestmentModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              summaryID={summaryID}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default investment;
