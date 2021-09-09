import { Col, Form, message, Modal, Row, Select, Upload, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
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
// eslint-disable-next-line import/no-named-as-default
import ContentWrapper from './plan.style';

const { Option } = Select;

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
  const [processValue, setProcessValue] = useState();

  const defaultFileList =
    EditRow.file && isEditMode
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

  function handleChange(value) {
    setProcessValue(value);
  }

  function handleUpload(info) {
    // console.log(info.file.originFileObj);
    setFileList([info.file.originFileObj]);
  }

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.planReport = {
          name: values.name,
          performance: values.performance,
          result: values.result,
          processResult: values.processResult,
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
        } else {
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
        }
      })
      .catch(info => {
        errorCatch(info);
      });
  };
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
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Үр дүн:" name="result">
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Үр дүн:" name="processResult">
                  <Select
                    defaultValue="0"
                    style={{ width: 120 }}
                    onChange={handleChange}
                  >
                    <Option value={0}>0</Option>
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={61}>6</Option>
                    <Option value={7}>7</Option>
                    <Option value={8}>8</Option>
                    <Option value={9}>9</Option>
                    <Option value={10}>10</Option>
                  </Select>
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
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
