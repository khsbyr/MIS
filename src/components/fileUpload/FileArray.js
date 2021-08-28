import React from 'react';
import { Button, Table, Input, message, Spin } from 'antd';
import { LoadingOutlined, PlusSquareFilled } from '@ant-design/icons';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import FileUpload from './FileUpload';
import { deleteService, getGenerateUuid } from '../../service/Service';
import { errorCatch } from '../../tools/Tools';
import axios from '../../service/axios';

const url = '/gap-file-service/files';

export default function FileArray(props) {
  const { fileArrayState, setFileArrayState, generateUuid, isView, elementId } =
    props;

  const setKeyFileArray = () => {
    fileArrayState.forEach((row, index) => {
      row.key = index;
    });
    setFileArrayState([...fileArrayState]);
  };

  const adder = () => {
    fileArrayState.push({});
    setKeyFileArray();
  };

  const writeFileServer = (selectedFile, uuid) => {
    const data = new FormData();
    data.append('file', selectedFile.fileUpload);
    axios
      .post(
        `${url}?parentUuid=${uuid}&description=${selectedFile.description}`,
        data,
        {
          onUploadProgress: progressEvent => {
            selectedFile.percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setFileArrayState([...fileArrayState]);
          },
        }
      )
      .then(result => {
        if (result) {
          selectedFile.id = result.data.id;
          selectedFile.uuid = result.data.uuid;
          setFileArrayState([...fileArrayState]);
        }
      })
      .catch(error => {
        errorCatch(error);
        throw error;
      });
  };

  const removeRow = row => {
    const index = fileArrayState.indexOf(row);
    if (index > -1) {
      fileArrayState.splice(index, 1);
      setKeyFileArray();
    }
  };

  const deleteFile = row => {
    if (!row.id) {
      if (!row.percent) {
        removeRow(row);
      } else {
        message.warn('Файл хуулж байхад устгах боломжгүй');
      }
      return;
    }
    deleteService(`${url}/${row.id}`).then(result => {
      if (result) {
        removeRow(row);
      }
    });
  };

  const setFile = row => {
    if (!generateUuid) {
      getGenerateUuid()
        .then(res => {
          props.setGenerateUuid(res.data);
          writeFileServer(row, res.data);
        })
        .catch(err => {
          errorCatch(err);
        });
    } else if (row.id) {
      deleteService(`${url}/${row.id}`).then(result => {
        if (result) {
          row.id = null;
          row.percent = 0;
          setFileArrayState([...fileArrayState]);
          writeFileServer(row, generateUuid);
        }
      });
    } else {
      writeFileServer(row, generateUuid);
    }
  };

  const columns = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
      width: '3%',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Файлын тайлбар',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      render: (text, record, index) => (
        <Input
          key={index}
          value={text}
          disabled={isView}
          onChange={event => {
            record.description = event.target.value;
            setFileArrayState([...fileArrayState]);
          }}
        />
      ),
    },
    {
      title: 'Файл',
      dataIndex: 'file',
      key: 'file',
      width: '57%',
      render: (text, record, index) => (
        <FileUpload
          key={`${(elementId || '') + index}`}
          elementId={elementId}
          isViewMode={isView}
          file={record}
          inputIndex={index}
          isHideUpload={isView}
          setFile={() => setFile(record)}
          deleteFile={() => deleteFile(record)}
        />
      ),
    },
  ];

  return (
    <>
      {!isView && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 10,
          }}
        >
          <Button icon={<PlusSquareFilled />} onClick={() => adder()}>
            Нэмэх
          </Button>
        </div>
      )}
      <Table
        rowKey={record => record.key}
        columns={columns}
        dataSource={fileArrayState}
        bordered
        size="middle"
        pagination={false}
        locale={{
          emptyText: !fileArrayState ? (
            <Spin indicator={<LoadingOutlined />} />
          ) : (
            'Хавсаргасан файл байхгүй байна.'
          ),
        }}
      />
    </>
  );
}
