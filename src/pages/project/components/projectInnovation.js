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
import ProjectInnovationModal from './ModalComponent/projectInnovationModal';

let isEditMode;
let editRow;
function projectInnovation(props) {
  const loadLazyTimeout = null;
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
    getService(`/project/get/${props.projectId}`, list)
      .then(result => {
        const listResult = result.summaryBallotForm.sbf_proposeds;
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

  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
    if (isSuccess) onInit();
  };

  const handleDeleted = row => {
    if (row.length === 0) {
      message.warning('Устгах өгөгдлөө сонгоно уу');
      return;
    }
    putService(`proposedInnovations/delete/${row.proposedInnovations.id}`)
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
        6. Төслийн хүрээнд санал болгож буй инноваци
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
          <Column
            field="proposedInnovations.scope.name"
            header="Хамрах хүрээ"
          />
          <Column
            field="proposedInnovations.innovativeActivities"
            header="Инноваци, шинэлэг үйл ажиллагаанууд"
          />
          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
      </div>
      {isModalVisible && (
        <ProjectInnovationModal
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

export default projectInnovation;
