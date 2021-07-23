import {
  DownOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import SaveIcon from '@material-ui/icons/Save';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Layout,
  Menu,
  message,
  Modal,
  Row,
  DatePicker,
  Select,
  Input,
  InputNumber,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { PAGESIZE } from '../../../constants/Constant';
import { errorCatch } from '../../../tools/Tools';
import TrainingReportModal from './components/trainingReportModal';
import ContentWrapper from './components/attendance.style';

const { Option } = Select;

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

let editRow;
let isEditMode;
const TrainingReport = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainers/get', list)
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
  }, [lazyParams]);

  const add = () => {
    setIsModalVisible(true);
    isEditMode = false;
  };

  const edit = row => {
    editRow = row.data;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainers/delete/${selectedRows[0].id}`)
      .then(result => {
        message.success('Амжилттай устлаа');
        onInit();
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  function confirm() {
    Modal.confirm({
      title: 'Та устгахдаа итгэлтэй байна уу ?',
      icon: <ExclamationCircleOutlined />,
      okButtonProps: {},
      okText: 'Устгах',
      cancelText: 'Буцах',
      onOk() {
        handleDeleted();
        onInit();
      },
      onCancel() {},
    });
  }

  const pop = () => {
    if (selectedRows.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm();
    }
  };

  const action = row => (
    <>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={edit}
      />
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={pop}
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

  const trainingnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.trainerFor}
    </>
  );

  const teacherBodyTemplate = row => (
    <>
      <span className="p-column-title">Огноо</span>
      {row.registerNumber}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Сургалтын тайлан</p>
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
                        width: '120px',
                        color: 'black',
                        cursor: 'pointer',
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
                      Хэвлэх{' '}
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
            <Row>
              <Col xs={24} md={24} lg={8}>
                <Form>
                  <Form.Item>
                    <Input className="FormItem" placeholder="Сургалтын нэр" />
                  </Form.Item>
                </Form>
                <Form>
                  <Form.Item>
                    <DatePicker
                      bordered={false}
                      placeholder="Огноо"
                      suffixIcon={<DownOutlined />}
                      className="DatePicker"
                      style={{
                        width: '60%',
                        color: 'black',
                        cursor: 'pointer',
                      }}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form>
                  <Form.Item>
                    <Select placeholder="Аймаг:" allowClear>
                      <Option value="Ulaanbaatar">Улаанбаатар</Option>
                      <Option value="Arkhangai">Архангай</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Select placeholder="Сум:" allowClear>
                      <Option value="Darkhan">Дархан</Option>
                      <Option value="Erdenet">Эрдэнэт</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={4}>
                <Form>
                  <Form.Item>
                    <InputNumber placeholder="Эр" />
                  </Form.Item>
                  <Form.Item>
                    <InputNumber placeholder="Эм" />
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={4}>
                <Form>
                  <Form.Item>
                    <InputNumber placeholder="Нийт" />
                  </Form.Item>
                </Form>
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
            // selectionMode="checkbox"
            selection={selectedRows}
            // onRowClick={edit}
            // editMode="row"
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            {/* <Column selectionMode="multiple" headerStyle={{ width: '3em', padding: "0px" }}  ></Column> */}
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              sortable
            />
            <Column
              field="trainerFor"
              header="Сургалтын нэр"
              body={trainingnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="registerNumber"
              header="Огноо"
              body={teacherBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column field="" header="Сургалт явагдсан газар" />
            <Column field="" header="Сургалт явуулсан байгууллага, хүний нэр" />
            <Column field="" header="Сургагч багшийн нэр" />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TrainingReportModal
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

export default TrainingReport;
