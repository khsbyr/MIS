import { ExclamationCircleOutlined, DownOutlined } from "@ant-design/icons";
import { faFileExcel, faPen, faPlus, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Layout, message, Modal, Row, DatePicker } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { isShowLoading } from "../../../context/Tools";
import { getService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
import ContentWrapper from "../../criteria/criteria.style";
import GuidelinesModal from "../training/components/GuidelinesModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AutoCompleteSelect from "../../../components/Autocomplete";
import OrgaStyle   from "./components/orga.style";

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

var editRow
var isEditMode;
const Guidelines = () => {

  let loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [loading, setLoading] = useState(false);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const [stateOrga, setStateOrga] = useState([]);


  useEffect(() => {
    onInit();
    getService("organization/get").then((result) => {
      if (result) {
        setStateOrga(result.content || []);
      }
    });
  }, [lazyParams])

  const onInit = () => {
    setLoading(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService("trainingGuidelines/get", list)
      .then((result) => {
        let list = result.content || [];
        list.map(
          (item, index) =>
            (item.index = lazyParams.page * PAGESIZE + index + 1)
        );
        setList(list);
        setSelectedRows([]);

      })
      .catch((error) => {
        errorCatch(error);
        isShowLoading(false);
      })
  };

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const action = (row) => {
    return (
      <React.Fragment>
        <Button type="text" icon={<FontAwesomeIcon icon={faPen} />} onClick={() => edit(row)} />
        <Button type="text" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => pop(row)} />
      </React.Fragment>
    );
  }

  const edit = (row) => {
    editRow = row
    isEditMode = true
    setIsModalVisible(true)
  }

  const handleDeleted = (row) => {
    if (row.length === 0) {
      message.warning("Устгах өгөгдлөө сонгоно уу");
      return;
    }

    putService("trainingGuidelines/delete/" + row.id)
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
  }

  const subjectBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Сургалтын сэдэв</span>
        {row.subject}
      </React.Fragment>
    );
  }

  const reasonBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Сургалт зохион байгуулах үндэслэл</span>
        {row.reason}
      </React.Fragment>
    );
  }

  const aimBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Сургалтын зорилго</span>
        {row.aim}
      </React.Fragment>
    );
  }

  const operationBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Хэрэгжүүлэх үйл ажиллагаа</span>
        {row.operation}
      </React.Fragment>
    );
  }

  const resultBodyTemplate = (row) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Хүлэгдэж буй үр дүн 1</span>
        {row.result}
      </React.Fragment>
    );
  }

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сургалтын удирдамж</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row gutter={[0, 15]}>
                  
                  <Col xs={8} md={8} lg={6}>
                  <OrgaStyle>
                      <AutoCompleteSelect                  
                          valueField="id"
                          placeholder="Байгууллага сонгох"
                          data={stateOrga}
                      />
                      </OrgaStyle>
                  </Col>
                  
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
                  <Col xs={8} md={8} lg={4}>
                    <Button type="text" icon={<FontAwesomeIcon icon={faPrint} />} >Хэвлэх </Button>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
                    <Button type="text" className="export" icon={<FontAwesomeIcon icon={faFileExcel} />} >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={4}>
                    <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={add}>
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
            onSelectionChange={(e) => {
              setSelectedRows(e.value);
            }}
            dataKey="id">
            <Column field="index" header="№" body={indexBodyTemplate} />
            <Column field="subject" header="Сургалтын сэдэв" filter body={subjectBodyTemplate} />
            <Column
              field="reason"
              header="Сургалт зохион байгуулах үндэслэл"
              filter
              body={reasonBodyTemplate}
            />
            <Column field="aim" header="Сургалтын зорилго" filter body={aimBodyTemplate} />
            <Column
              field="operation"
              header="Хэрэгжүүлэх үйл ажиллагаа"
              filter
              body={operationBodyTemplate}
            />
            <Column field="result" header="Хүлэгдэж буй үр дүн 1" filter body={resultBodyTemplate} />
            <Column headerStyle={{ width: '7rem' }} body={action} />


          </DataTable>
          {isModalVisible && (
            <GuidelinesModal
              Guidelinescontroller={editRow}
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
}

export default Guidelines;




