import {
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  DatePicker,
  Upload,
  Button,
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/mn_MN';
import {
  postService,
  putService,
  writeFileServer,
  updateFileServer,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from '../style/ProjectInfoModal.style';
import 'moment/locale/mn';

const { TextArea } = Input;

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function ImplementationModal(props) {
  const { EditRow, isModalVisible, isEditMode, projectId } = props;
  const [form] = Form.useForm();
  const [startDateValue, setStartDateValue] = useState();
  const [endDateValue, setEndDateValue] = useState();
  const [fileList, setFileList] = useState([]);

  const defaultFileList =
    EditRow?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: EditRow?.file?.fileName,
            status: 'done',
            url: EditRow?.file?.path,
          },
        ]
      : [];

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
  }

  function startDate(date, value) {
    setStartDateValue(value);
  }

  function endDate(date, value) {
    setEndDateValue(value);
  }

  useEffect(() => {
    if (isEditMode) {
      setStartDateValue(EditRow.startDate);
      setEndDateValue(EditRow.endDate);
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.implementationOfSemp = {
          startDate: startDateValue,
          endDate: endDateValue,
          plannedWork: values.plannedWork,
          description: values.description,
        };
        values.projectId = projectId;
        if (isEditMode) {
          if (fileList[0]) {
            const serverApi = EditRow.file
              ? updateFileServer(`file/update/${EditRow.file.id}`, fileList[0])
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.fileId = response.data.id;
                putService(`implementationOfSemp/update/${EditRow.id}`, values)
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
            putService(`implementationOfSemp/update/${EditRow.id}`, values)
              .then(() => {
                message.success('Амжилттай хадгаллаа');
                props.close(true);
              })
              .catch(error => {
                errorCatch(error);
              });
          }
        } else if (fileList[0]) {
          writeFileServer(`file/upload`, fileList[0])
            .then(response => {
              values.fileId = response.data.id;
              postService('implementationOfSemp/post', values)
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
          postService('implementationOfSemp/post', values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
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
        title="Байгаль орчин нийгмийн менежментийн төлөвлөгөөний биелэлт бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1100}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Эхлэх хугацаа:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    locale={locale}
                    onChange={startDate}
                    defaultValue={
                      isEditMode ? moment(EditRow.startDate).zone(0) : ''
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Дуусах хугацаа:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    locale={locale}
                    onChange={endDate}
                    defaultValue={
                      isEditMode ? moment(EditRow.endDate).zone(0) : ''
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={30}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Тайлбар:" name="description">
                  <TextArea rows={6} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} md={24} lg={6}>
                <Upload
                  maxCount={1}
                  defaultFileList={[...defaultFileList]}
                  customRequest={dummyRequest}
                  onChange={handleUpload}
                >
                  <Button icon={<UploadOutlined />}>Файл хавсаргах</Button>
                </Upload>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
