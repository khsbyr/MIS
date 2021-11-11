import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, message, Modal, Row, Tooltip, Rate } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { useProjectStore } from '../../../context/ProjectContext';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../more/file.style';
import RatingModal from './components/RatingModal';
// import FileUploadDetailedModal from './FileUploadDetailedModal';

const { Content } = Layout;

let editRow;
let isEditMode;
const Rating = props => {
  let loadLazyTimeout = null;
  const { ProjectList } = useProjectStore();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const PAGESIZE = 20;
  const [lazyParams] = useState({
    page: 0,
  });

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`rating/getByProjectId/${ProjectList.id}`, obj)
        .then(result => {
          const listResult = result || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(result.totalElements);
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

  const edit = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    editRow = row;
    isEditMode = true;
    setIsModalVisible(true);
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`rating/delete/${row.id}`)
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

  const pop = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
    } else {
      confirm(row);
    }
  };

  const action = row => (
    <>
      {toolsStore.user.role.id === 21 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faPen} />}
          onClick={event => edit(event, row)}
        />
      )}
      {toolsStore.user.role.id === 21 ? (
        ''
      ) : (
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faTrash} />}
          onClick={event => pop(event, row)}
        />
      )}
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

  const fileName = row => (
    <>
      <span className="p-column-title">Байгууллагийн нэр</span>
      <Tooltip placement="topLeft" title={row.organization.name}>
        {row.organization.name}
      </Tooltip>
    </>
  );

  const rating = row => (
    <>
      <span className="p-column-title">Үнэлгээ</span>
      <Tooltip placement="topLeft" title={row.rating}>
        <Rate disabled defaultValue={row.rating} />
      </Tooltip>
    </>
  );

  const description = row => (
    <>
      <span className="p-column-title">Тайлбар</span>
      <Tooltip placement="topLeft" title={row.description}>
        {row.description}
      </Tooltip>
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
                    {toolsStore.user.role.id === 21 ? (
                      ''
                    ) : (
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
                    )}
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
            totalRecords={totalRecords}
          >
            <Column header="№" body={indexBodyTemplate} style={{ width: 40 }} />
            <Column header="Байгууллагийн нэр" body={fileName} />
            <Column header="Үнэлгээ" body={rating} />
            <Column header="Тайлбар" body={description} />
            <Column headerStyle={{ width: '7rem' }} body={action} />
          </DataTable>
          {isModalVisible && (
            <RatingModal
              EditRow={editRow}
              isModalVisible={isModalVisible}
              close={closeModal}
              isEditMode={isEditMode}
              projectID={props.projectId}
            />
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Rating;
