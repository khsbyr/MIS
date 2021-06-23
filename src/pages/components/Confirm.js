import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const Confirm = (handleOK, title = null) => {
    Modal.confirm({
        title: title || "Та устгахдаа итгэлтэй байна уу ?",
        icon: <ExclamationCircleOutlined />,
        okButtonProps: {},
        okText: "Тийм",
        cancelText: "Үгүй",
        onOk() {
            handleOK();
        },
    });
}
