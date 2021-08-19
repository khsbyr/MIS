import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import InvestmentModal from './components/ModalComponent/investmentModal';

const { Content } = Layout;

let isEditMode;
let editRow;
const investment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = row => {
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    // if (isSuccess) onInit();
  };
  const action = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => edit(row)}
      />
      {/* <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => pop(row)}
      /> */}
    </>
  );
  return (
    <div style={{ marginRight: '45px', marginLeft: '45px' }}>
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
          // value={listEducation}
          removableSort
          rows={10}
          className="p-datatable-responsive-demo"
          dataKey="id"
        >
          <Column field="index" header="№" style={{ width: '50px' }} />
          <Column field="#" header="Үйл ажиллагаа буюу зардал " />
          <Column field="#" header="Нийт  дүн" />
          <Column field="#" header="Компаниас гаргах зардал хуваалт" />
          <Column field="#" header="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт" />
          <Column field="#" header="Компаниас гаргах %" />
          <Column field="#" header="МАА-н ЭЗЭН төслийн хөрөнгө оруулалт %" />
          <Column
            field="#"
            header="Санхүүжилтийн эх үүсвэр болон нэмэлт тайлбар"
          />

          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
      </div>
      {isModalVisible && (
        <InvestmentModal
          ActivityController={editRow}
          isModalVisible={isModalVisible}
          close={closeModal}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default investment;
