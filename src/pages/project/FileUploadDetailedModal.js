import { InboxOutlined } from '@ant-design/icons';
import { Col, Form, message, Modal, Row, Upload, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  postService,
  writeFileServer,
  putService,
  updateFileServer,
} from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import validateMessages from '../../tools/validateMessage';

const { Dragger } = Upload;
const { TextArea } = Input;

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function FileUploadDetailedModal(props) {
  const { isModalVisible, EditRow, isEditMode, projectID } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const defaultFileList =
    EditRow?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: EditRow.file.fileName,
            status: 'done',
            url: EditRow.file.path,
          },
        ]
      : [];

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
  }

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          if (fileList[0]) {
            const serverApi = EditRow.file
              ? updateFileServer(`file/update/${EditRow.file.id}`, fileList[0])
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.file = { id: response.data.id };
                values.project = { id: projectID };
                putService(`projectFiles/update/${EditRow.id}`, values)
                  .then(() => {
                    message.success('Амжилттай хадгаллаа');
                    props.close(true);
                  })
                  .catch(error => {
                    errorCatch(error);
                  });
              })
              .catch(error => {
                errorCatch(error);
              });
          } else {
            putService(`projectFiles/update/${EditRow.id}`, values)
              .then(() => {
                message.success('Амжилттай хадгаллаа');
                props.close(true);
              })
              .catch(error => {
                errorCatch(error);
              });
          }
        } else {
          writeFileServer(`file/upload`, fileList[0])
            .then(response => {
              values.file = { id: response.data.id };
              values.project = { id: projectID };
              postService('projectFiles/post', values)
                .then(() => {
                  message.success('Амжилттай хадгаллаа');
                  props.close(true);
                })
                .catch(error => {
                  errorCatch(error);
                });
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        errorCatch(info);
      });
  };

  return (
    <div>
      <Modal
        title="Файл хавсаргах"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <div>
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col span={24}>
                <Form.Item name="description" label="Тайлбар">
                  <TextArea />
                </Form.Item>
              </Col>
              <Col span={24} style={{ marginBottom: '30px' }}>
                <Dragger
                  accept="image/*,.pdf"
                  maxCount={1}
                  customRequest={dummyRequest}
                  onChange={handleUpload}
                  defaultFileList={[...defaultFileList]}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Файл хавсаргах</p>
                  <p className="ant-upload-hint" />
                </Dragger>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
