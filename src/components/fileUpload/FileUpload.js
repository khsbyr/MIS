/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { message, Button, Modal, Space, Tooltip, Progress } from 'antd';
import { EyeFilled, DeleteFilled, PaperClipOutlined } from '@ant-design/icons';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { downloadBlob } from '../../service/Service';
import Loader from '../../loader/Loader';
import style from './style.module.scss';

export default function FileUpload(props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const inputIndex = props.inputIndex || '';
  const { isViewMode, file } = props;
  const [isVisibleFileViewer, setIsVisibleFileViewer] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);
  const elementId = props.elementId || 'upload';

  const fileUploader = event => {
    if (
      event.target !== null &&
      event.target.files !== null &&
      event.target.files.length > 0
    ) {
      const selectedFile = event.target.files[0];
      if (!file.description) {
        message.warning('Файлын тайлбар оруулна уу');
        return;
      }
      if (!selectedFile.type?.includes('pdf')) {
        message.warning('Зөвхөн PDF өргөтгөлтэй файл оруулна уу!');
        return;
      }
      if (selectedFile.size > 20971520) {
        message.warning('Файлын хэмжээ 20MB - с бага байх ёстой!');
        return;
      }
      file.fileUpload = selectedFile;
      file.name = selectedFile.name;
      props.setFile();
    }
  };

  const setFileView = selectedFile => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = e => {
      setViewPdf(e.target.result);
    };
  };

  const viewFile = () => {
    if (!file.fileUpload && !file.id) {
      message.warn('Сонгосон файл байхгүй байна.');
      return;
    }
    setViewPdf(null);
    setIsVisibleFileViewer(true);
    if (file.fileUpload) {
      setFileView(file.fileUpload);
    } else if (file.uuid) {
      downloadBlob(`/gap-file-service/files/download?uuid=${file.uuid}`)
        .then(blob => {
          file.fileUpload = blob;
          setFileView(blob);
        })
        .catch(() => {
          setViewPdf('error');
        });
    }
  };

  return (
    <div key={inputIndex} className={style.fileUpload}>
      <Space style={{ width: '100%', paddingRight: 16 }}>
        {!isViewMode && (
          <div className={style.uploadDiv}>
            <input
              style={{ display: 'none' }}
              id={`${elementId}${inputIndex}`}
              type="file"
              onChange={event => fileUploader(event)}
            />
            <Button>
              <label htmlFor={`${elementId}${inputIndex}`}>Файл сонгох</label>
            </Button>
          </div>
        )}
        {file.id ? (
          <>
            <PaperClipOutlined />
            <span>{file.name}</span>
          </>
        ) : (
          <Progress size="small" showInfo={false} percent={file.percent} />
        )}
      </Space>
      <Space>
        <Tooltip placement="left" title="Файл харах">
          <Button onClick={viewFile}>
            <EyeFilled />
          </Button>
        </Tooltip>
        <Button disabled={isViewMode} onClick={() => props.deleteFile()}>
          <DeleteFilled />
        </Button>
        {isVisibleFileViewer && (
          <Modal
            title="Файл харах"
            visible={isVisibleFileViewer}
            footer={false}
            onCancel={() => setIsVisibleFileViewer(false)}
            width={1100}
            centered
          >
            <div className={style.pdfViewContainer}>
              <PDFViewer />
            </div>
          </Modal>
        )}
      </Space>
    </div>
  );

  function PDFViewer() {
    if (!viewPdf) {
      return <Loader />;
    }
    if (viewPdf === 'error') {
      return null;
    }

    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
        <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    );
  }
}
