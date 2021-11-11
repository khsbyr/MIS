import { InboxOutlined } from '@ant-design/icons';
import { Col, Form, message, Modal, Row, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  postService,
  writeFileServer,
  putService,
  updateFileServer,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';

const { Option } = Select;
const { Dragger } = Upload;

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function fileUploadModal(props) {
  const { isModalVisible, summaryID, EditRow, isEditMode } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [descValue, setDescValue] = useState();

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

  function handleChange(value) {
    setDescValue(value);
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
                values.fileId = response.data.id;
                putService(`budgetCostEstimates/update/${EditRow.id}`, values)
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
            putService(`budgetCostEstimates/update/${EditRow.id}`, values)
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
              values.fileId = response.data.id;
              values.sbfId = summaryID;
              values.description = descValue;
              postService('budgetCostEstimates/post', values)
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
                <Form.Item name="description" label="Төрөл">
                  <Select
                    placeholder="Сонгох"
                    style={{ width: 300 }}
                    onChange={handleChange}
                  >
                    <Option value="Албан тоот">Албан тоот</Option>
                    <Option value="Улсын бүртгэлийн гэрчилгээ">
                      Улсын бүртгэлийн гэрчилгээ
                    </Option>
                    <Option value="Төсөл /монгол">Төсөл /монгол</Option>
                    <Option value="Төсөл /Англи">Төсөл /Англи</Option>
                    <Option value="Санхүүгийн тайлан Аудитын тайлан">
                      Санхүүгийн тайлан Аудитын тайлан
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} style={{ marginBottom: '30px' }}>
                {/* <Upload
                  accept="image/*,.pdf"
                  maxCount={1}
                  customRequest={dummyRequest}
                  onChange={handleUpload}
                >
                  <Button icon={<UploadOutlined />}>Файл хавсаргах</Button>
                </Upload> */}
                <Dragger
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
