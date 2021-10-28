import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Tabs,
  TreeSelect,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input';
import AutoCompleteSelect from '../../../components/Autocomplete';
import MulticompleteSelect from '../../../components/MulticompleteSelect';
import { useToolsStore } from '../../../context/Tools';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../components/ModalComponent/produictiveProjectModal.style';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { TreeNode } = TreeSelect;

export default function productiveProjectModal(props) {
  const toolsStore = useToolsStore();
  const { ProductiveController, isModalVisible, isEditMode, type } = props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaListMulti, setCriteriaListMulti] = useState([]);
  const [, setSelectedOrg] = useState();
  const [valueAddress, setValueAddress] = useState(undefined);
  const [projectOrgs, setProjectOrgs] = useState([]);
  const [innovationProjectType, setInnovationProjectType] = useState();
  const [innovationProjectTypeId, setInnovationProjectTypeId] = useState();

  const ProjectChildrenAddress =
    ProductiveController &&
    ProductiveController.address.childrenAddress.map(item => item.soum.id);

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

  const selectOrg = value => {
    setSelectedOrg(value);
  };

  const selectCriteriaMulti = value => {
    setCriteriaListMulti(value);
  };

  useEffect(() => {
    type === 1
      ? getService('criteria/getForProject').then(result => {
          if (result) {
            setCriteriaList(result || []);
          }
        })
      : getService('criteria/getForProjectTwo').then(result => {
          if (result) {
            setCriteriaList(result || []);
          }
        });
    getService(`subProjectType/getByProjectTypeId/${type}`).then(result => {
      if (result) {
        setInnovationProjectType(result || []);
      }
    });
    if (isEditMode) {
      getService(
        `projectCriteria/getCriteriaListByProjectId/${ProductiveController?.id}`
      ).then(result => {
        if (result) {
          setCriteriaListMulti(result.map(z => criteriaListMulti.push(z.id)));
          setCriteriaListMulti([...criteriaListMulti]);
        }
      });
      getService(
        `projectOrganization/getOrganizationListByProjectId/${ProductiveController?.id}`
      ).then(result => {
        if (result) {
          setProjectOrgs(result.map(z => projectOrgs.push(z.id)));
          setProjectOrgs([...projectOrgs]);
        }
      });
    }
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });

    if (isEditMode) {
      setProjectOrgs(projectOrgs);
      setValueAddress(ProjectChildrenAddress);
      setCriteriaListMulti(criteriaListMulti);
      setInnovationProjectTypeId(
        ProductiveController.subProjectType
          ? ProductiveController.subProjectType.id
          : null
      );
      form.setFieldsValue({
        ...ProductiveController,
        AimagID: ProductiveController.address?.aimag?.id,
        SoumID: ProductiveController.address?.soum?.id,
        OrgID: ProductiveController.organization.id,
      });
    }
  }, []);

  const selectProjectOrg = value => {
    setProjectOrgs(value);
  };

  const selectType = value => {
    setInnovationProjectTypeId(value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.project = {
          projectName: values.projectName,
          nameOfAuthorizedPerson: values.nameOfAuthorizedPerson,
          period: values.period,
          expierenceActivity: values.expierenceActivity,
          proposedActivity: values.proposedActivity,
          partnerActivity: values.partnerActivity,
          organization: { id: values.OrgID },
          projectType: { id: type },
          projectBudget: values.projectBudget,
          subProjectType:
            type === 1 || type === 2 ? { id: innovationProjectTypeId } : null,
        };
        values.organizationIds = projectOrgs;
        values.criteriaIds = criteriaListMulti;
        values.soumList = valueAddress;
        if (isEditMode) {
          putService(`project/update/${ProductiveController.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('project/post', values)
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
        title="Төсөл бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={800}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
        maskClosable={false}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Төслийн мэдээлэл" key="1">
                <Row gutter={60}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Төслийн нэр:" name="projectName">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Төсөл хэрэгжүүлэх хугацаа:" name="period">
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      label="Шалгуур үзүүлэлт:"
                      name="CriteriaID"
                      valuePropName="option"
                    >
                      {isEditMode ? (
                        <MulticompleteSelect
                          data={criteriaList}
                          value={criteriaListMulti}
                          valueField="id"
                          size="medium"
                          onChange={value => selectCriteriaMulti(value)}
                        />
                      ) : (
                        <MulticompleteSelect
                          data={criteriaList}
                          valueField="id"
                          size="medium"
                          onChange={value => selectCriteriaMulti(value)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Төсөв:" name="projectBudget">
                      <CurrencyInput precision="0" suffix=" ₮" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Хариуцсан хүн:"
                      name="nameOfAuthorizedPerson"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name="OrgID" label="Байгууллага сонгох:">
                      <AutoCompleteSelect
                        valueField="id"
                        data={toolsStore.orgList}
                        onChange={value => selectOrg(value)}
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
                          // treeDefaultExpandAll
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
                          // treeDefaultExpandAll
                          maxTagCount="responsive"
                          onChange={onChangeAddress}
                        >
                          {getDynamicTreeNodes()}
                        </TreeSelect>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {type === 1 || type === 2 ? (
                  <Row>
                    <Col xs={24} md={24} lg={24}>
                      <Form.Item label="Төрөл:" valuePropName="option">
                        <AutoCompleteSelect
                          data={innovationProjectType}
                          defaultValue={
                            ProductiveController?.subProjectType?.id
                          }
                          valueField="id"
                          onChange={value => selectType(value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : (
                  ''
                )}
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Түншлэгч байгууллага:"
                      valuePropName="option"
                    >
                      <MulticompleteSelect
                        data={toolsStore.partnerList}
                        value={projectOrgs}
                        valueField="id"
                        size="medium"
                        onChange={value => selectProjectOrg(value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Бусад мэдээлэл" key="2">
                <Row gutter={40}>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      name="expierenceActivity"
                      label="Өргөдөл гаргагчийн туршлага болон үйл ажиллагааны чиглэл:"
                    >
                      <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item
                      name="proposedActivity"
                      label="Өргөдөл гаргагчийн санал болгож буй үйл ажиллагааны чиглэл:"
                    >
                      <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item
                      name="partnerActivity"
                      label="Хамтран ажиллах түншлэгч байгууллагатай бол үйл ажиллагааны төрөл болон бусад дэлгэрэнгүй мэдээлэл:"
                    >
                      <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
