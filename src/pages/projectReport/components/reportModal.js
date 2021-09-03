import { Col, Form, message, Modal, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
// eslint-disable-next-line import/no-named-as-default
import ContentWrapper from './plan.style';

const { Option } = Select;

export default function ReportModal(props) {
  const { EditRow, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [planList, setPlanList] = useState();
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [, setProcessValue] = useState();

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

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.plan = { id: selectedPlan };
        if (isEditMode) {
          putService(`planReport/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
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
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
