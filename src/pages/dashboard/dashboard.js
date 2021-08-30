import React, { useState } from 'react';
import OrganizationModal from '../training/tabs/components/OrganizationModal';
import { useToolsStore } from '../../context/Tools';

function dashboard() {
  const toolsStore = useToolsStore();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
  };
  return (
    <div>
      {localStorage.getItem('orgName') === '' ? (
        <OrganizationModal
          isModalVisible={isModalVisible}
          close={closeModal}
          isOrg
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default dashboard;