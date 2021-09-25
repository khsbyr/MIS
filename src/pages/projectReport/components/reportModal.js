import {
  Col,
  Form,
  message,
  Modal,
  Row,
  Upload,
  Button,
  DatePicker,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/mn_MN';
import AutoCompleteSelect from '../../../components/Autocomplete';
import {
  getService,
  postService,
  putService,
  writeFileServer,
  updateFileServer,
} from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from './report.style';
import 'moment/locale/mn';

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function ReportModal(props) {
  const { EditRow, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [planList, setPlanList] = useState();
  const [selectedPlan, setSelectedPlan] = useState([]);
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

  useEffect(() => {
    getService('plan/get').then(result => {
      if (result) {
        setPlanList(result.content || []);
      }
    });
    if (isEditMode) {
      setSelectedPlan(EditRow.plan.id);
      form.setFieldsValue({
        ...EditRow,
      });
    }
  }, []);

  function SelectedPlan(value) {
    setSelectedPlan(value);
  }

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
  }

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.planReport = {
          name: values.name,
          performance: values.performance,
          plan: { id: selectedPlan },
        };
        if (isEditMode) {
          if (fileList[0]) {
            const serverApi = EditRow.file
              ? updateFileServer(`file/update/${EditRow.file.id}`, fileList[0])
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.fileId = response.data.id;
                putService(`planReport/update/${EditRow.id}`, values)
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
            putService(`planReport/update/${EditRow.id}`, values)
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
              postService('planReport/post', values)
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
          postService('planReport/post', values)
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

  function dateChange(date, dateString) {}

  return (
    <div>
      <Modal
        title="Тайлан бүртгэх"
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
              <Col xs={24} md={24} lg={24}>
                <Form.Item
                  label="Төлөвлөгөөний нэр:"
                  name="name"
                  className="planName"
                >
                  {isEditMode ? (
                    <AutoCompleteSelect
                      defaultValue={EditRow.plan.id}
                      data={planList}
                      valueField="id"
                      onChange={value => SelectedPlan(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      data={planList}
                      valueField="id"
                      onChange={value => SelectedPlan(value)}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Гүйцэтгэл:" name="performance">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={6}>
                <Form.Item label="Он, сар:" name="date">
                  <DatePicker
                    onChange={dateChange}
                    picker="month"
                    placeholder="Он, сар сонгох"
                    locale={locale}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Upload
                  accept="image/*,.pdf"
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
