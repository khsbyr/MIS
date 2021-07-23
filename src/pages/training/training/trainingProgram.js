import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  faFileExcel,
  faPen,
  faPlus,
  faPrint,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  DatePicker,
  Layout,
  message,
  Modal,
  Row,
  Form,
  Select,
  Input,
} from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './components/trainingProgram.style';
import TrainingProgramModal from './components/trainingProgramModal';

function onChange(date, dateString) {
  console.log(date, dateString);
}
const { Content } = Layout;

let editRow;
let isEditMode;
const TrainingProgram = () => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lazyParams, setLazyParams] = useState({
    page: 0,
  });
  const [loading, setLoading] = useState(false);
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);
  const { Option } = Select;
  const toolsStore = useContext(ToolsContext);

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('trainingProgram/get/1', list)
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
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`trainingProgram/delete/${row.id}`)
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

  const activityBodyTemplate = row => (
    <>
      <span className="p-column-title">Үйл ажиллагаа</span>
      {row.test}
    </>
  );

  const timeBodyTemplate = row => (
    <>
      <span className="p-column-title">Хэрэгжих хугацаа</span>
      {row.test}
    </>
  );

  const ownerBodyTemplate = row => (
    <>
      <span className="p-column-title">Хариуцах эзэн</span>
      {row.test}
    </>
  );

  const materialsBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын материал</span>
      {row.test}
    </>
  );

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={14}>
                <p className="title">Сургалтын хөтөлбөр</p>
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
                    <Input
                      className="FormItem"
                      placeholder="Малын эрүүл мэнд"
                    />
                  </Form.Item>
                </Form>
                <Form>
                  <Form.Item>
                    <DatePicker
                      bordered={false}
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
                    <Select placeholder="Аймаг, хот" allowClear>
                      <Option value="Ulaanbaatar">Улаанбаатар</Option>
                      <Option value="Arkhangai">Архангай</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Select placeholder="Сургууль, цэцэрлэг" allowClear>
                      <Option value="Surguuli">Сургууль</Option>
                      <Option value="Tsetserleg">Цэцэрлэг</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={24} lg={8} />
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
            <Column field="index" header="№" body={indexBodyTemplate} />
            <Column
              field=""
              header="Үйл ажиллагаа"
              body={activityBodyTemplate}
            />
            <Column
              field=""
              header="Хэрэгжих хугацаа"
              body={timeBodyTemplate}
            />
            <Column field="" header="Хариуцах эзэн" body={ownerBodyTemplate} />
            <Column
              field=""
              header="Сургалтын материал"
              body={materialsBodyTemplate}
            />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <TrainingProgramModal
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
export default TrainingProgram;
