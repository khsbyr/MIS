import React, { useState } from 'react';
import OrganizationModal from '../training/tabs/components/OrganizationModal';

function dashboard() {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const closeModal = (isSuccess = false) => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <OrganizationModal isModalVisible={isModalVisible} close={closeModal} />
    </div>
  );
}

export default dashboard;
