import { Col, Form, Input, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { useProjectStore } from '../../../context/ProjectContext';
import { putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

function projectRationale() {
  const [form] = Form.useForm();
  const { ProjectList } = useProjectStore();

  useEffect(() => {
    form.setFieldsValue({
      ...ProjectList.summaryBallotForm,
      rationale: ProjectList.summaryBallotForm?.rationaleChallenges?.rationale,
      challenges:
        ProjectList.summaryBallotForm?.rationaleChallenges?.challenges,
    });
  }, []);

  const onBlurValueRationale = value => {
    form.validateFields().then(values => {
      values.rationale = value;
      putService(
        `rationaleChallenges/update/${ProjectList.summaryBallotForm.rationaleChallenges.id}`,
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

  const onBlurValueChallanges = value => {
    form.validateFields().then(values => {
      values.challenges = value;
      putService(
        `rationaleChallenges/update/${ProjectList.summaryBallotForm.rationaleChallenges.id}`,
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
      <h2 className="titleBrief">
        1. Төслийн үндэслэл болон тулгамдаж буй асуудал
      </h2>
      <Form
        form={form}
        labelAlign="left"
        layout="vertical"
        name="nest-messages"
        validateMessages={validateMessages}
      >
        <Row gutter={[40, 30]}>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="rationale" label="Төслийн үндэслэл">
              <TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                placeholder="Төслийн үндэслэл"
                onBlur={e => onBlurValueRationale(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="challenges" label="Тулгарч буй хүндрэл бэрхшээл">
              <TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                placeholder="Тулгарч буй хүндрэл бэрхшээл"
                onBlur={e => onBlurValueChallanges(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default projectRationale;
