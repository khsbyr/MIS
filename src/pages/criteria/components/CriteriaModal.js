import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio, Space, InputNumber, Row, Col } from 'antd';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { criteriaFrequencyData } from '../../../constants/Constant';
import { useCriteriaStore } from '../../../context/CriteriaContext';

export default function CriteriaModal(props) {
  const { Criteriacontroller, isModalVisible, isEditMode } = props;
  const { criteriaReferenceList } = useCriteriaStore();
  const [form] = Form.useForm();
  const [stateIndicator, setStateIndicator] = React.useState(1);
  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...Criteriacontroller,
        referenceID: Criteriacontroller.criteriaReference
          ? Criteriacontroller.criteriaReference.id
          : '',
      });
    }
  }, []);

  const onChange = e => {
    setStateIndicator(e.target.value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.criteriaReference = {
          id: values.referenceID,
        };
        if (isEditMode) {
          putService(`criteria/update/${Criteriacontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('criteria/post', values)
            .then(() => {
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
        title="Шалгуур үзүүлэлт бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={800}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <Form
          form={form}
          labelAlign="left"
          layout="vertical"
          name="nest-messages"
          validateMessages={validateMessages}
        >
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                name="referenceID"
                layout="vertical"
                label="Бүрэлдэхүүн сонгох"
              >
                <AutoCompleteSelect
                  valueField="id"
                  data={criteriaReferenceList}
                  size="medium"
                />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                label="Шалгуур үзүүлэлтийн нэр"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Шалгуур үзүүлэлт..." />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item label="Код:" name="code">
                <Input placeholder="Код..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                name="resultTobeAchieved"
                label="Хүрэх үр дүн:"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                name="processResult"
                label="Үр дүнгийн биелэлт"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item name="frequency" layout="vertical" label="Давтамж">
                <AutoCompleteSelect
                  valueField="id"
                  data={criteriaFrequencyData}
                  size="medium"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                label="Мэдээллийн эх үүсвэр"
                name="sourceOfInformation"
              >
                <Input placeholder="Мэдээллийн эх үүсвэр..." />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                label="Мэдээлэл цуглуулах аргачлал"
                name="dataCollectionMethodology"
              >
                <Input placeholder="Мэдээлэл цуглуулах аргачлал..." />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item label="Хариуцах нэгж" name="unitOfResponsibility">
                <Input placeholder="Хариуцах нэгж..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                name="indicator"
                layout="vertical"
                label="Шалгуур үзүүлэлтийн төрөл"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Radio.Group onChange={onChange} value={stateIndicator}>
                  <Radio value={1} defaultChecked>
                    Тоо
                  </Radio>
                  <Radio value={2}>Хувь</Radio>
                  <Radio value={3}>Томъё</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={16}>
              <Form.Item label="Тайлбар" name="description">
                <Input.TextArea
                  placeholder="Тайлбар"
                  style={{
                    width: '100%',
                    height: '100px',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
