import { Button, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectPurposeModal from './ModalComponent/projectPurposeModal';

let isEditMode;
let editRow;
function projectPurpose() {
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
        2. Төслийн зорилго, санал болгож буй шийдэл, ашиг хүртэгчид болон ач
        холбогдол
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
          <Column field="#" header="Төслийн зорилго" />
          <Column
            field="#"
            header="Тулгамдаж буй хүндрэл, бэрхшээлүүдийг шийдвэрлэх"
          />
          <Column field="#" header="Төслийн ашиг хүртэгчид" />
          <Column field="#" header="Төслийн үр ашиг" />
          <Column field="#" header="Зах зээлийн холбоо, хамтын ажиллагаа" />
          <Column field="#" header="Хугацаа болон тогтвортой байдал" />

          <Column headerStyle={{ width: '7rem' }} body={action} />
        </DataTable>
      </div>
      {isModalVisible && (
        <ProjectPurposeModal
          ProjectPurposeModalController={editRow}
          isModalVisible={isModalVisible}
          close={closeModal}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}

export default projectPurpose;
