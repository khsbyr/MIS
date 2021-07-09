import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, DatePicker, Layout, message, Modal, Row } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { isShowLoading } from "../../context/Tools";
import { getService, putService } from "../../service/service";
import { errorCatch } from "../../tools/Tools";
import CriteriaModal from "../criteria/components/CriteriaModal";
import "./criteria.style";
import ContentWrapper from "./criteria.style";
import { ColumnGroup } from 'primereact/columngroup';

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

var editRow;
var isEditMode;
const Criteria = () => {
  let loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [loading, setLoading] = useState(false);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const onInit = () => {
    setLoading(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService("criteria/get", list)
      .then((result) => {
        let list = result.content || [];
        list.map(
          (item, index) => (item.index = lazyParams.page * PAGESIZE + index + 1)
        );
        setList(list);
        setSelectedRows([]);
      })
      .catch((error) => {
        errorCatch(error);
        isShowLoading(false);
      });
  };

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const action = (row) => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const edit = (row) => {
    console.log(row)
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    }
    putService("criteria/delete/" + row.id)
      .then((result) => {
        message.success("Амжилттай устлаа");
        onInit();
      })
      .catch((error) => {
        errorCatch(error);
      });
  };
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };
  const pop = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    } else {
      confirm(row);
    }
  };

  const indexBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">№</span>
        {row.index}
      </React.Fragment>
    );
  };

  const nameBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Шалгуур үзүүлэлтийн нэр</span>
        {row.name}
      </React.Fragment>
    );
  };

  const indicatorProcessBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Хүрэх үр дүн</span>
        {row.upIndicator}
      </React.Fragment>
    );
  };

  const upIndicatorBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Үр дүнгийн биелэлт</span>
        {row.indicatorProcess}
      </React.Fragment>
    );
  };

  const indicatorTypeBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Шалгуур үзүүлэлтийн төрөл</span>
        {row.indicatorProcess}
      </React.Fragment>
    );
  };


  let headerGroup = <ColumnGroup>
  <Row>
      <Column header="№" rowSpan={2}/>
      <Column header="Шалгуур үзүүлэлтийн нэр" rowSpan={2} /> 
      <Column header="Хүрэх үр дүн" rowSpan={2} />
      <Column header="Үр дүнгийн биелэлт" rowSpan={2} />
      <Column header="Шалгуур үзүүлэлтийн төрөл" body={indicatorTypeBodyTemplate} colSpan={3}/>
      <Column headerStyle={{ width: "7rem" }} body={action} rowSpan={2}></Column>


  </Row>
  <Row>
      <Column header="Хувь /%/"/>
      <Column header="Тоо"/>
      <Column header="Томъёо"/>
  </Row>
  </ColumnGroup>;

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Шалгуур үзүүлэлтийн бүртгэл</p>
              </Col>
              <Col xs={24} md={24} lg={10}>
                <Row gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={6}>
                    <DatePicker
                      onChange={onChange}
                      bordered={false}
                      suffixIcon={<DownOutlined />}
                      placeholder="Select year"
                      picker="year"
                      className="DatePicker"
                      style={{
                        width: "120px",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </Col>
                  {/* <Col xs={8} md={8} lg={6}>
                                        <Input
                                            placeholder="Хайлт хийх"
                                            allowClear
                                            prefix={<SearchOutlined />}
                                            bordered={false}
                                            onSearch={onSearch}
                                            style={{
                                                width: 150,
                                                borderBottom: "1px solid #103154",
                                            }}
                                        />
                                    </Col> */}
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{" "}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={6}>
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
            headerColumnGroup={headerGroup}
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            // onRowClick={edit}
            onSelectionChange={(e) => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column field="index" header="№" body={indexBodyTemplate} />
            <Column field="name" header="Шалгуур үзүүлэлтийн нэр" body={nameBodyTemplate} />
            <Column field="indicatorProcess" header="Хүрэх үр дүн" body={indicatorProcessBodyTemplate} />
            <Column field="upIndicator" header="Үр дүнгийн биелэлт" body={upIndicatorBodyTemplate}  />
            <Column field="criteriaIndicator.percentIndicator.value" header="Хувь /%/"/>
            <Column field="criteriaIndicator.quantityIndicator.value" header="Тоо"/>
            <Column field="criteriaIndicator.formulaIndicator.value" header="Томъёо"/>
            <Column headerStyle={{ width: "7rem" }} body={action}></Column>
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
  function confirm(row) {
    Modal.confirm({
      title: "Та устгахдаа итгэлтэй байна уу ?",
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: "Устгах",
      cancelText: "Буцах",
      onOk() {
        handleDeleted(row);
        onInit();
      },
      onCancel() { },
    });
  }
};

export default Criteria;
