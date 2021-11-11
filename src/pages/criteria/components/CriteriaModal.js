import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  InputNumber,
  Row,
  Col,
  message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { criteriaFrequencyData } from '../../../constants/Constant';
import { useCriteriaStore } from '../../../context/CriteriaContext';

export default function CriteriaModal(props) {
  const { t } = useTranslation();
  const { Criteriacontroller, isModalVisible, isEditMode } = props;
  const { criteriaReferenceList, setCriteriaReferenceList } =
    useCriteriaStore();
  const [form] = Form.useForm();
  const [stateIndicator, setStateIndicator] = React.useState(1);

  useEffect(() => {
    getService(`criteriaReference/get`).then(result => {
      if (result) {
        setCriteriaReferenceList(result.content || []);
      }
    });

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
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('criteria/post', values)
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
        title={t('Indicator create')}
        okText={t('Save')}
        cancelText={t('Cancel')}
        width={1000}
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
                label={t('Select Indicator')}
              >
                <AutoCompleteSelect
                  placeholder={t('Select')}
                  valueField="id"
                  data={criteriaReferenceList}
                  size="medium"
                  mode="multiple"
                />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                label={t('Indicator name')}
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder={t('Indicator name')} />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item label={t('Code')} name="code">
                <Input placeholder={t('Code')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                name="resultTobeAchieved"
                label={t('Achieved result')}
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
                name="frequency"
                layout="vertical"
                label={t('Frequency')}
              >
                <AutoCompleteSelect
                  placeholder={t('Select')}
                  valueField="id"
                  data={criteriaFrequencyData}
                  size="medium"
                />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              {/* <Form.Item
                name="processResult"
                label={t('Execution of results')}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item> */}
              <Form.Item
                label={t('Responsible unit')}
                name="unitOfResponsibility"
              >
                <Input placeholder={t('Responsible unit')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                label={t('Source of information')}
                name="sourceOfInformation"
              >
                <Input placeholder={t('Source of information')} />
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                label={t('Data collection methodology')}
                name="dataCollectionMethodology"
              >
                <Input placeholder={t('Data collection methodology')} />
              </Form.Item>
            </Col>
            {/* <Col xs={16} md={16} lg={8}>
              <Form.Item
                label={t('Responsible unit')}
                name="unitOfResponsibility"
              >
                <Input placeholder={t('Responsible unit')} />
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={24}>
            <Col xs={16} md={16} lg={8}>
              <Form.Item
                name="indicator"
                layout="vertical"
                label={t('Indicator type')}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Radio.Group onChange={onChange} value={stateIndicator}>
                  <Radio value={2} defaultChecked>
                    {t('Number')}
                  </Radio>
                  <Radio value={1}>{t('Percent')}</Radio>
                  <Radio value={3}>{t('Formula')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={16} md={16} lg={16}>
              <Form.Item label={t('Description')} name="description">
                <Input.TextArea
                  placeholder={t('Description')}
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
