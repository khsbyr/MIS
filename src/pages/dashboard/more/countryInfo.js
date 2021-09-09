import { Modal } from 'antd';
import React from 'react';

function countryInfo(props) {
  const { isModalVisible } = props;

  return (
    <Modal
      title="Байгууллага бүртгэх"
      okText="Хадгалах"
      cancelText="Буцах"
      width={1100}
      alignItems="center"
      visible={isModalVisible}
      onCancel={() => props.close()}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default countryInfo;
