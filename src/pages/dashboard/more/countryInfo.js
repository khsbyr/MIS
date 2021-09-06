import React, { useState } from 'react';
import { Modal, Button } from 'antd';

function countryInfo() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Modal title="Basic Modal" visible={isModalVisible}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default countryInfo;
