import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Tooltip, message } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import VeterinarianEducationModal from './veterinarianEducationModal';

let isEditMode;
let editRow;
function veterinarianEducation(props) {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const PAGESIZE = 20;
  const [lazyParams] = useState({
    page: 0,
  });

  const enrolledDate = row => (
    <>
      {moment(row && row.enrolledDate)
        .zone(0)
        .format('YYYY-M-D')}
    </>
  );

  const graduatedDate = row => (
    <>
      {moment(row && row.graduatedDate)
        .zone(0)
        .format('YYYY-M-D')}
    </>
  );

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService(`/education/getByYoungDoctorId/${props.youngDoctorID}`)
      .then(result => {
        const listResult = result;
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
    if (isSuccess) onInit();
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`education/delete/${row.id}`)
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
        onClick={() => confirm(row)}
      />
    </>
  );
  return (
    <div>
      <h2 className="title">
        4. Боловсрол
        <Tooltip title="Нэмэх" arrowPointAtCenter>
          <Button
            type="text"
            className="export"
            icon={<FontAwesomeIcon icon={faPlus} />}
            style={{ float: 'right' }}
            onClick={add}
          >
            {' '}
          </Button>
        </Tooltip>
      </h2>
      <div className="datatable-responsive-demo">
        <DataTable
          value={list}
          removableSort
          rows={10}
          className="p-datatable-responsive-demo"
          dataKey="id"
        >
          <Column field="index" header="№" style={{ width: '50px' }} />
          <Column field="degree" header="Зэрэг, цол" />
          <Column field="universityName" header="Их дээд сургуулийн нэр" />
          <Column
            field="enrolledDate"
            header="Элссэн огноо"
            body={enrolledDate}
          />
          <Column
            field="graduatedDate"
            header="Төгссөн огноо"
            body={graduatedDate}
          />
          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
        {isModalVisible && (
          <VeterinarianEducationModal
            CvEducationController={editRow}
            isModalVisibleEducation={isModalVisible}
            close={closeModal}
            isEditMode={isEditMode}
            trainerID={props.youngDoctorID}
          />
        )}
      </div>
    </div>
  );
}

export default veterinarianEducation;
