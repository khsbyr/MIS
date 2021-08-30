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
  TreeSelect,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input';
import AutoCompleteSelect from '../../components/Autocomplete';
import MulticompleteSelect from '../../components/MulticompleteSelect';
import { getService, postService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import validateMessages from '../../tools/validateMessage';
import { useToolsStore } from '../../context/Tools';
import ContentWrapper from './tabs/components/training.style';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};
const { TreeNode } = TreeSelect;

export default function TrainingModal(props) {
  const { Trainingcontroller, isModalVisible, isEditMode, trainingID } = props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [stateCriteria, setStateCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [valueAddress, setValueAddress] = useState(undefined);
  const [stateAimag, setStateAimag] = useState([]);
  const selectedCriterias = Trainingcontroller?.trainingCriteria.map(
    z => z.criteriasId
  );

  const ProjectChildrenAddress =
    Trainingcontroller &&
    Trainingcontroller.address.childrenAddress.map(item => item.soum.id);

  function onStartDateChange(date, value) {
    setStartDate(value);
  }

  function onEndDateChange(date, value) {
    setEndDate(value);
  }

  useEffect(() => {
    if (trainingID) {
      getService(`training/getCriteriaList/${trainingID}`).then(result => {
        if (result) {
          const list = result || [];
          setSelectedCriteria(list);
          if (isEditMode) {
            setStartDate(Trainingcontroller.trainingStartDate);
            setEndDate(Trainingcontroller.trainingEndDate);
            setValueAddress(ProjectChildrenAddress);
            form.setFieldsValue({
              ...Trainingcontroller,
              CriteriaID: list.map(item => item.id),
              orgID: Trainingcontroller.organization
                ? Trainingcontroller.organization.id
                : '',
              AimagID: Trainingcontroller.address?.aimag?.id,
              SoumID: Trainingcontroller.address?.soum?.id,
              totalBudget: Trainingcontroller.trainingBudget
                ? Trainingcontroller.trainingBudget.totalBudget
                : '',
              performanceBudget: Trainingcontroller.trainingBudget
                ? Trainingcontroller.trainingBudget.performanceBudget
                : '',
              trainingStartDate: Trainingcontroller
                ? Trainingcontroller.trainingStartDate
                : '',
              trainingEndDate: Trainingcontroller
                ? Trainingcontroller.trainingEndDate
                : '',
            });
          }
        }
      });
    } else {
      setSelectedCriteria([]);
    }
    getService('criteria/getListByForWhatId/1').then(result => {
      if (result) {
        setStateCriteria(result || []);
      }
    });
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  }, [Trainingcontroller, form, isEditMode]);

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
  const SelectCriteria = value => {
    setSelectedCriteria(value);
  };
  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.organization = { id: values.orgID };
        values.trainingStartDate = startDate;
        values.trainingEndDate = endDate;
        values.soumList = valueAddress;
        values.isTrue = true;
        if (isEditMode) {
          const saveData = {
            training: values,
            criteriaIds: values.CriteriaID,
            totalBudget: values.totalBudget,
            soumList: valueAddress,
          };
          putService(`training/update/${Trainingcontroller.id}`, saveData)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          const saveData = {
            training: values,
            criteriaIds: values.CriteriaID,
            totalBudget: values.totalBudget,
            soumList: valueAddress,
          };

          postService('training/post', saveData)
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
        title="Сургалт бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1200}
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
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      label="Шалгуур үзүүлэлт:"
                      name="CriteriaID"
                      valuePropName="option"
                    >
                      {selectedCriterias ? (
                        <MulticompleteSelect
                          data={stateCriteria}
                          defaultValue={selectedCriterias}
                          valueField="id"
                          size="medium"
                          onChange={value => SelectCriteria(value)}
                        />
                      ) : (
                        <MulticompleteSelect
                          data={stateCriteria}
                          valueField="id"
                          size="medium"
                          onChange={value => SelectCriteria(value)}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      label="Сургалтын сэдэв:"
                      name="name"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      label="Төсөв:"
                      name="totalBudget"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <CurrencyInput precision="0" suffix=" ₮" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Эхэлсэн огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%' }}
                        placeholder="Эхэлсэн огноо:"
                        className="FormItem"
                        onChange={onStartDateChange}
                        defaultValue={
                          Trainingcontroller &&
                          moment(Trainingcontroller.trainingStartDate).zone(0)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="Дууссан огноо:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%' }}
                        placeholder="Дууссан огноо:"
                        className="FormItem"
                        onChange={onEndDateChange}
                        defaultValue={
                          Trainingcontroller &&
                          moment(Trainingcontroller.trainingEndDate).zone(0)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      name="orgID"
                      layout="vertical"
                      label="Байгууллага:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={toolsStore.orgList}
                        size="medium"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
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
                          treeDefaultExpandAll
                          maxTagCount="responsive"
                          onChange={onChangeAddress}
                        >
                          {getDynamicTreeNodes()}
                        </TreeSelect>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
