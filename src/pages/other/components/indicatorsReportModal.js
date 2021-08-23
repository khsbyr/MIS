import { UploadOutlined } from '@ant-design/icons';
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Button,
  Upload,
} from 'antd';
import React, { useContext, useEffect } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/plan.styled';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function IndicatorsReportModal(props) {
  const { IndicatorsReportcontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const toolsStore = useContext(ToolsContext);
  const loadLazyTimeout = null;
  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };
  useEffect(() => {
    onInit();
    if (isEditMode) {
      form.setFieldsValue({
        ...IndicatorsReportcontroller,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(
            `feedbackCriteria/update/${IndicatorsReportcontroller.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`feedbackCriteria/post`, values)
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
        title="Шалгуур үзүүлэлтийн үр дүн бүртгэл"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            {...layout}
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 30]}>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Шалгуур үзүүлэлт:" name="mission">
                  <Input />
                </Form.Item>
                <Form.Item label="Байршил:" name="mission">
                  <Input />
                </Form.Item>
                <Form.Item label="Хүрэх үр дүн:" name="mission">
                  <Input />
                </Form.Item>
                <Form.Item label="Үр дүнгийн биелэлт:" name="mission">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="mission">
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="mission">
                  <Upload>
                    <Button
                      icon={<UploadOutlined />}
                      style={{ height: '48px' }}
                    >
                      Файл хавсаргах
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
