import { Col, Form, Input, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import { useTrainingStore } from '../../../context/TrainingContext';
import ContentWrapper from './components/guidelines.style';

const { TextArea } = Input;

function Guidelines() {
  const { TrainingList } = useTrainingStore();
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(TrainingList.training_guidelines);
    form.setFieldsValue({
      ...(TrainingList && TrainingList.training_guidelines),
      subject: TrainingList?.training_guidelines?.subject,
      reason: TrainingList?.training_guidelines?.reason,
      aim: TrainingList?.training_guidelines?.aim,
      operation: TrainingList?.training_guidelines?.operation,
      result: TrainingList?.training_guidelines?.result,
    });
  }, []);

  const subject = value => {
    form.validateFields().then(values => {
      values.subject = value;
      putService(
        `trainingGuidelines/update/${TrainingList.training_guidelines.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const reason = value => {
    form.validateFields().then(values => {
      values.reason = value;
      putService(
        `trainingGuidelines/update/${TrainingList.training_guidelines.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const aim = value => {
    form.validateFields().then(values => {
      values.aim = value;
      putService(
        `trainingGuidelines/update/${TrainingList.training_guidelines.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const operation = value => {
    form.validateFields().then(values => {
      values.operation = value;
      putService(
        `trainingGuidelines/update/${TrainingList.training_guidelines.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const result = value => {
    form.validateFields().then(values => {
      values.result = value;
      putService(
        `trainingGuidelines/update/${TrainingList.training_guidelines.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };
  return (
    <div>
      <ContentWrapper>
        <Form
          form={form}
          labelAlign="left"
          layout="vertical"
          name="nest-messages"
          validateMessages={validateMessages}
        >
          <Row gutter={[40, 30]}>
            <Col xs={24} md={24} lg={24}>
              <Form.Item name="subject" label="Сургалтын сэдэв">
                <TextArea
                  rows={6}
                  placeholder="Сургалтын сэдэв"
                  onBlur={e => subject(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Сургалт зохион байгуулах үндэслэл"
              >
                <TextArea
                  rows={6}
                  placeholder="Сургалт зохион байгуулах үндэслэл"
                  onBlur={e => reason(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="aim" label="Сургалтын зорилго">
                <TextArea
                  rows={6}
                  placeholder="Сургалтын зорилго"
                  onBlur={e => aim(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="operation" label="Хэрэгжүүлэх үйл ажиллагаа">
                <TextArea
                  rows={6}
                  placeholder="Хэрэгжүүлэх үйл ажиллагаа"
                  onBlur={e => operation(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="result" label="Хүлээгдэж буй үр дүн">
                <TextArea
                  rows={6}
                  placeholder="Хүлээгдэж буй үр дүн"
                  onBlur={e => result(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ContentWrapper>
    </div>
  );
}
export default Guidelines;
