import { ExclamationCircleOutlined } from '@ant-design/icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Tooltip, message } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ResultModal from './ModalComponent/resultModal';
import { useProjectStore } from '../../../context/ProjectContext';

let isEditMode;
let editRow;
function result() {
  const loadLazyTimeout = null;
  const { ProjectList } = useProjectStore();
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [summaryID, setSummaryID] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const PAGESIZE = 20;
  const [lazyParams] = useState({
    page: 0,
  });
  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService(
      `summaryBallotForm/getProjectResultBySbfId/${ProjectList.summaryBallotForm.id}`
    )
      .then(resultt => {
        const listResult = resultt;
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
        setSummaryID(ProjectList.summaryBallotForm.id);
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
    putService(`projectResult/delete/${row.id}`)
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
      <h2 className="titleBrief">
        9. Төслийн хүрээнд гарах үр дүн
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
          <Column field="areasOfActivity" header="Үйл ажиллагааны чиглэл  " />
          <Column field="result" header="Үр дүн " />
          <Column field="yield" header="Гарц " />
          <Column field="effect" header="Нөлөө " />
          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
      </div>
      {isModalVisible && (
        <ResultModal
          EditRow={editRow}
          isModalVisible={isModalVisible}
          close={closeModal}
          isEditMode={isEditMode}
          summaryID={summaryID}
        />
      )}
    </div>
  );
}

export default result;
