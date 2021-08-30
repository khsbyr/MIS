import { UploadOutlined } from '@ant-design/icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  TreeSelect,
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from './feedback.style';
import AutoCompleteSelect from '../../../components/Autocomplete';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

const { TreeNode } = TreeSelect;

export default function IndicatorsReportModal(props) {
  const { IndicatorsReportcontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [valueAddress, setValueAddress] = useState(undefined);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateCriteria, setStateCriteria] = useState([]);
  const [stateCriteriaID, setStateCriteriaID] = useState([]);
  const [Date, setDate] = useState([]);

  const ProjectChildrenAddress =
    IndicatorsReportcontroller &&
    IndicatorsReportcontroller.address.childrenAddress.map(
      item => item.soum.id
    );

  function onDateChange(date, value) {
    setDate(value);
  }

  useEffect(() => {
    getService('criteria/get').then(result => {
      if (result) {
        setStateCriteria(result.content || []);
      }
    });
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (isEditMode) {
      setDate(IndicatorsReportcontroller.date);
      setStateCriteriaID(
        IndicatorsReportcontroller.criteria &&
          IndicatorsReportcontroller.criteria.id
      );
      form.setFieldsValue({
        ...IndicatorsReportcontroller,
        CriteriaID: IndicatorsReportcontroller.criteria
          ? IndicatorsReportcontroller.criteria.name
          : '',
        date: IndicatorsReportcontroller ? IndicatorsReportcontroller.date : '',
      });
    }
  }, []);

  const onChangeAddress = value => {
    setValueAddress(value);
  };

  const getDynamicChildNodes = child => {
    const childs = [];
    for (let c = 0; c < child.length; c++) {
      childs.push(
        <TreeNode value={child[c].id} title={child[c].name} key={child[c].id} />
      );
    }
    return childs;
  };

  const getDynamicTreeNodes = () => {
    const results = [];
    for (let i = 0; i < stateAimag.length; i++) {
      results.push(
        <TreeNode
          value={stateAimag[i].id + 400}
          title={stateAimag[i].name}
          key={stateAimag[i].id + 400}
          disabled
        >
          {getDynamicChildNodes(stateAimag[i].soums)}
        </TreeNode>
      );
    }
    return results;
  };
  const selectCriteria = value => {
    setStateCriteriaID(value);
  };
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.date = Date;
        values.soumList = valueAddress;
        values.criteria = { id: stateCriteriaID };
        if (isEditMode) {
          putService(
            `criteriaResults/update/${IndicatorsReportcontroller.id}`,
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
          postService(`criteriaResults/post`, values)
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
        title="Шалгуур үзүүлэлтийн үр дүн бүртгэх"
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
                <Form.Item
                  name="CriteriaID"
                  label="Шалгуур үзүүлэлтийн нэр:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="Шалгуур үзүүлэлтийн нэр сонгох..."
                    valueField="id"
                    defaultValue={
                      isEditMode
                        ? IndicatorsReportcontroller.stateCriteria &&
                          IndicatorsReportcontroller.stateCriteria[23].name
                        : null
                    }
                    data={stateCriteria}
                    size="medium"
                    onChange={value => selectCriteria(value)}
                  />
                </Form.Item>
                <Form.Item label="Хаяг:">
                  {ProjectChildrenAddress === null ? (
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      value={valueAddress}
                      dropdownStyle={{ maxHeight: 450, overflow: 'auto' }}
                      placeholder="Сонгох"
                      allowClear
                      multiple
                      maxTagCount="responsive"
                      onChange={onChangeAddress}
                    >
                      {getDynamicTreeNodes()}
                    </TreeSelect>
                  ) : (
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      defaultValue={ProjectChildrenAddress}
                      value={valueAddress}
                      dropdownStyle={{ maxHeight: 450, overflow: 'auto' }}
                      placeholder="Сонгох"
                      allowClear
                      multiple
                      maxTagCount="responsive"
                      onChange={onChangeAddress}
                    >
                      {getDynamicTreeNodes()}
                    </TreeSelect>
                  )}
                </Form.Item>
                <Form.Item
                  label="Үр дүн:"
                  name="processResult"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Огноо:"
                  name="date"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%', height: '40px' }}
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="Огноо"
                    onChange={onDateChange}
                    defaultValue={
                      isEditMode
                        ? IndicatorsReportcontroller &&
                          moment(IndicatorsReportcontroller.date).zone(0)
                        : null
                    }
                  />
                </Form.Item>
                <Form.Item label="Файл:" name="mission">
                  <Upload style={{ width: '100%', height: '40px' }}>
                    <Button
                      icon={<UploadOutlined />}
                      style={{ width: '100%', height: '40px' }}
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
