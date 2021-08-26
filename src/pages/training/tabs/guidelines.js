import { Col, message, Row, Form, Input } from 'antd';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { ToolsContext } from '../../../context/Tools';
import { getService, putService } from '../../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

let loadLazyTimeout = null;

const Guidelines = props => {
  const { Guidelinescontroller } = props;
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
          console.log(dataList);
          setTrainingID(data.id);
          setOrgID(data.organization.id);
          // dataList.forEach((item, index) => {
          //   item.index = lazyParams.page * PAGESIZE + index + 1;
          // });
          setTotalRecords(data.totalElements);
          setList(dataList);
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
      ...Guidelinescontroller,
      subject: Guidelinescontroller?.training_guidelines?.subject,
      reason: Guidelinescontroller?.training_guidelines?.reason,
      aim: Guidelinescontroller?.training_guidelines?.aim,
      operation: Guidelinescontroller?.training_guidelines?.operation,
      result: Guidelinescontroller?.training_guidelines?.result,
    });
  }, [lazyParams]);

  const subject = value => {
    form.validateFields().then(values => {
      values.training = { id: trainingID };
      values.subject = value;
      putService(`trainingGuidelines/update/${list.id}`, values)
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
      values.training = { id: trainingID };
      values.reason = value;
      putService(`trainingGuidelines/update/${list.id}`, values)
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
      values.training = { id: trainingID };
      values.aim = value;
      putService(`trainingGuidelines/update/${list.id}`, values)
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
      values.training = { id: trainingID };
      values.operation = value;
      putService(`trainingGuidelines/update/${list.id}`, values)
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
      values.training = { id: trainingID };
      values.result = value;
      putService(`trainingGuidelines/update/${list.id}`, values)
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
                onBlur={e => subject(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="reason" label="Сургалт зохион байгуулах үндэслэл">
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
    </div>
  );
};
export default Guidelines;
