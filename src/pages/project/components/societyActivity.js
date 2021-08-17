import { Button, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SocietyActivityModal from './ModalComponent/societyActivityModal';

let isEditMode;
let editRow;
function societyActivity() {
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
    <div>
      <h2 className="title">
        4. МУ-ын Засгийн газар болон МАА ЭЗЭН төслийн бодлогод нийцүүлж
        хэрэгжүүлэх нийгэм, байгаль орчны үйл ажиллагааны жагсаалт
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
          // value={listEducation}
          removableSort
          rows={10}
          className="p-datatable-responsive-demo"
          dataKey="id"
        >
          <Column field="index" header="№" style={{ width: '50px' }} />
          <Column field="#" header="Үндсэн үйл ажиллагаанууд " />
          <Column
            field="#"
            header="МУ-ын Засгийн газар болон МАА ЭЗЭН төслийн бодлогыг дагаж мөрдөх"
          />
          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
      </div>
      {isModalVisible && (
        <SocietyActivityModal
          ActivityController={editRow}
          isModalVisible={isModalVisible}
          close={closeModal}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}

export default societyActivity;
