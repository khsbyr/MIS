import { Col, Form, Input, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { useProjectStore } from '../../../context/ProjectContext';
import { putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

function projectPurpose() {
  const [form] = Form.useForm();
  const { ProjectList } = useProjectStore();

  useEffect(() => {
    form.setFieldsValue({
      ...ProjectList.summaryBallotForm,
      projectObj:
        ProjectList.summaryBallotForm.solutionsSignificance?.projectObjectives,
      solutionsStrategy:
        ProjectList.summaryBallotForm.solutionsSignificance?.solutionsStrategy,
      projectBeneficiaries:
        ProjectList.summaryBallotForm.solutionsSignificance
          ?.projectBeneficiaries,
      projectEfficiency:
        ProjectList.summaryBallotForm.solutionsSignificance?.projectEfficiency,
      marketAssociationsCooperation:
        ProjectList.summaryBallotForm.solutionsSignificance
          ?.marketAssociationsCooperation,
      timeAndStability:
        ProjectList.summaryBallotForm.solutionsSignificance?.timeAndStability,
    });
  }, []);

  const projectObj = value => {
    form.validateFields().then(values => {
      values.projectObjectives = value;
      putService(
        `solutionsSignificance/update/${ProjectList.summaryBallotForm.solutionsSignificance.id}`,
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

  const projectBeneficiaries = value => {
    form.validateFields().then(values => {
      values.projectBeneficiaries = value;
      putService(
        `solutionsSignificance/update/${ProjectList.summaryBallotForm.solutionsSignificance.id}`,
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

  const solutionsStrategy = value => {
    form.validateFields().then(values => {
      values.solutionsStrategy = value;
      putService(
        `solutionsSignificance/update/${ProjectList.summaryBallotForm.solutionsSignificance.id}`,
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

  const projectEfficiency = value => {
    form.validateFields().then(values => {
      values.projectEfficiency = value;
      putService(
        `solutionsSignificance/update/${ProjectList.summaryBallotForm.solutionsSignificance.id}`,
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

  const marketAssociationsCooperation = value => {
    form.validateFields().then(values => {
      values.marketAssociationsCooperation = value;
      putService(
        `solutionsSignificance/update/${ProjectList.summaryBallotForm.solutionsSignificance.id}`,
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

  const timeAndStability = value => {
    form.validateFields().then(values => {
      values.timeAndStability = value;
      putService(
        `solutionsSignificance/update/${ProjectList.summaryBallotForm.solutionsSignificance.id}`,
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
        2. Төслийн зорилго, санал болгож буй шийдэл, ашиг хүртэгчид болон ач
        холбогдол
      </h2>
      <Form
        form={form}
        labelAlign="left"
        layout="vertical"
        name="nest-messages"
        validateMessages={validateMessages}
      >
        <Row gutter={[40, 30]}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item name="projectObj" label="Төслийн зорилго">
              <TextArea
                rows={6}
                placeholder="Төслийн зорилго"
                onBlur={e => projectObj(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="projectBeneficiaries"
              label="Төслийн ашиг хүртэгчид"
            >
              <TextArea
                rows={6}
                placeholder="Төслийн ашиг хүртэгчид"
                onBlur={e => projectBeneficiaries(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              name="solutionsStrategy"
              label="Тулгамдаж буй хүндрэл, бэрхшээлүүдийг шийдвэрлэх"
            >
              <TextArea
                rows={6}
                placeholder="Тулгамдаж буй хүндрэл, бэрхшээлүүдийг шийдвэрлэх"
                onBlur={e => solutionsStrategy(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="projectEfficiency" label="Төслийн үр ашиг">
              <TextArea
                rows={6}
                placeholder="Төслийн үр ашиг"
                onBlur={e => projectEfficiency(e.target.value)}
              />
            </Form.Item>
          </Col>{' '}
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              name="marketAssociationsCooperation"
              label="Зах зээлийн холбоо, хамтын ажиллагаа"
            >
              <TextArea
                rows={6}
                placeholder="Зах зээлийн холбоо, хамтын ажиллагаа"
                onBlur={e => marketAssociationsCooperation(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="timeAndStability"
              label="Хугацаа болон тогтвортой байдал"
            >
              <TextArea
                rows={6}
                placeholder="Хугацаа болон тогтвортой байдал"
                onBlur={e => timeAndStability(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default projectPurpose;
