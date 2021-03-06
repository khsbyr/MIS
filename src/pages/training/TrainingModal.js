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
import locale from 'antd/es/date-picker/locale/mn_MN';
import moment from 'moment';
import 'moment/locale/mn';
import React, { useEffect, useState } from 'react';
// import CurrencyInput from 'react-currency-input';
import AutoCompleteSelect from '../../components/Autocomplete';
import MulticompleteSelect from '../../components/MulticompleteSelect';
import { useToolsStore } from '../../context/Tools';
import { getService, postService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import validateMessages from '../../tools/validateMessage';
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
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [valueAddress, setValueAddress] = useState(undefined);
  const [stateAimag, setStateAimag] = useState([]);

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
    if (isEditMode) {
      getService(`training/getCriteriaList/${trainingID}`).then(result => {
        if (result) {
          setSelectedCriteria(result?.map(z => selectedCriteria.push(z.id)));
          setSelectedCriteria([...selectedCriteria]);
        }
      });

      setStartDate(Trainingcontroller.trainingStartDate);
      setEndDate(Trainingcontroller.trainingEndDate);
      setValueAddress(ProjectChildrenAddress);
      setSelectedCriteria(selectedCriteria);
      form.setFieldsValue({
        ...Trainingcontroller,
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
            criteriaIds: selectedCriteria,
            // totalBudget: `${values.totalBudget}00`,
            soumList: valueAddress,
          };
          putService(`training/update/${Trainingcontroller.id}`, saveData)
            .then(() => {
              message.success('?????????????????? ??????????????????');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          const saveData = {
            training: values,
            criteriaIds: selectedCriteria,
            // totalBudget: values.totalBudget,
            soumList: valueAddress,
          };

          postService('training/post', saveData)
            .then(() => {
              message.success('?????????????????? ??????????????????');
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
        title="?????????????? ??????????????"
        okText="????????????????"
        cancelText="??????????"
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
                      label="?????????????? ????????????????:"
                      name="CriteriaID"
                      valuePropName="option"
                    >
                      {isEditMode ? (
                        <MulticompleteSelect
                          data={stateCriteria}
                          value={selectedCriteria}
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
                      label="?????????????????? ??????????:"
                      name="name"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input placeholder="?????????????????? ??????????" />
                    </Form.Item>
                  </Col>
                  {/* <Col xs={24} md={24} lg={8}>
                    <Form.Item label="??????????:" name="totalBudget">
                      <CurrencyInput precision="0" suffix=" ???" />
                    </Form.Item>
                  </Col> */}
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item
                      name="orgID"
                      layout="vertical"
                      label="??????????????????????:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={toolsStore.orgList}
                        size="medium"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="?????????? ??????????:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%' }}
                        placeholder="?????????? ??????????:"
                        className="FormItem"
                        onChange={onStartDateChange}
                        locale={locale}
                        defaultValue={
                          Trainingcontroller &&
                          moment(Trainingcontroller.trainingStartDate).zone(0)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="???????????? ??????????:">
                      <DatePicker
                        prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                        style={{ width: '100%' }}
                        placeholder="???????????? ??????????:"
                        className="FormItem"
                        onChange={onEndDateChange}
                        locale={locale}
                        defaultValue={
                          Trainingcontroller &&
                          moment(Trainingcontroller.trainingEndDate).zone(0)
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={24} lg={8}>
                    <Form.Item label="????????:">
                      {ProjectChildrenAddress === null ? (
                        <TreeSelect
                          showSearch
                          style={{ width: '100%' }}
                          value={valueAddress}
                          dropdownStyle={{ maxHeight: 450, overflow: 'auto' }}
                          placeholder="????????????"
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
                          placeholder="????????????"
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
