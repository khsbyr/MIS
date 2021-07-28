import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { MSG } from '../constants/Constant';

export const Confirm = (handleOK, title = null) => {
  Modal.confirm({
    title: title || 'Та устгахдаа итгэлтэй байна уу ?',
    icon: <ExclamationCircleOutlined />,
    okButtonProps: {},
    okText: 'Тийм',
    cancelText: 'Үгүй',
    onOk() {
      handleOK();
    },
  });
};

export const Success = (action, title = null, content = null) => {
  Modal.success({
    title: title || 'Амжилттай',
    content,
    afterClose: () => {
      action();
    },
  });
};

export const Warning = (handleOK = null, title = null) => {
  Modal.warning({
    title: title || MSG.NOT_AUTHORIZED,
    okText: 'Хаах',
    onOk() {
      handleOK && handleOK();
    },
  });
};
