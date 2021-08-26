import { Col, message, Row, Form, Input } from 'antd';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

let loadLazyTimeout = null;

const Guidelines = props => {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [orgID, setOrgID] = useState([]);
  const toolsStore = useContext(ToolsContext);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`training/get/${props.id}`, obj)
        .then(data => {
          const dataList = data.training_guidelines;
          setTrainingID(data.id);
          setOrgID(data.organization.id);
          // dataList.forEach((item, index) => {
          //   item.index = lazyParams.page * PAGESIZE + index + 1;
          // });
          setTotalRecords(data.totalElements);
          setList([dataList]);
          toolsStore.setIsShowLoader(false);
        })
        .catch(error => {
          message.error(error.toString());
          toolsStore.setIsShowLoader(false);
        });
    }, 500);
  };

  useEffect(() => {
    onInit();
    form.setFieldsValue({
      // ...ProjectList.summaryBallotForm,
      // projectObj:
      //   ProjectList.summaryBallotForm.solutionsSignificance?.projectObjectives,
      // solutionsStrategy:
      //   ProjectList.summaryBallotForm.solutionsSignificance?.solutionsStrategy,
      // projectBeneficiaries:
      //   ProjectList.summaryBallotForm.solutionsSignificance
      //     ?.projectBeneficiaries,
      // projectEfficiency:
      //   ProjectList.summaryBallotForm.solutionsSignificance?.projectEfficiency,
      // marketAssociationsCooperation:
      //   ProjectList.summaryBallotForm.solutionsSignificance
      //     ?.marketAssociationsCooperation,
      // timeAndStability:
      //   ProjectList.summaryBallotForm.solutionsSignificance?.timeAndStability,
    });
  }, [lazyParams]);

  const projectObj = value => {
    form.validateFields().then(values => {
      values.projectObjectives = value;
      putService(
        // `solutionsSignificance/update/${summaryBallotForm.solutionsSignificance.id}`,
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
                // onBlur={e => projectObj(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="reason" label="Сургалт зохион байгуулах үндэслэл">
              <TextArea
                rows={6}
                placeholder="Сургалт зохион байгуулах үндэслэл"
                // onBlur={e => projectBeneficiaries(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="aim" label="Сургалтын зорилго">
              <TextArea
                rows={6}
                placeholder="Сургалтын зорилго"
                // onBlur={e => projectBeneficiaries(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="operation" label="Хэрэгжүүлэх үйл ажиллагаа">
              <TextArea
                rows={6}
                placeholder="Хэрэгжүүлэх үйл ажиллагаа"
                // onBlur={e => solutionsStrategy(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="result" label="Хүлээгдэж буй үр дүн">
              <TextArea
                rows={6}
                placeholder="Хүлээгдэж буй үр дүн"
                // onBlur={e => projectEfficiency(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Guidelines;
