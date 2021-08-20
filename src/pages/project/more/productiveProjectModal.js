import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Tabs,
  Upload,
  InputNumber,
} from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import MulticompleteSelect from '../../../components/MulticompleteSelect';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../components/ModalComponent/produictiveProjectModal.style';

const { TextArea } = Input;
const { TabPane } = Tabs;

const Uploadprops = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading asd') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default function productiveProjectModal(props) {
  const { ProductiveController, isModalVisible, isEditMode, type } = props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaListMulti, setCriteriaListMulti] = useState([]);
  const [stateOrg, setStateOrg] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedProjectOrg, setSelectedProjectOrg] = useState([]);
  const [multiSum, setMultiSum] = useState();

  const getSum = aimagId => {
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
  };

  const selectAimag = value => {
    getSum(value);
  };

  const selectOrg = value => {
    setSelectedOrg(value);
  };

  const selectSumMulti = value => {
    setMultiSum(value);
  };

  const selectCriteriaMulti = value => {
    setCriteriaListMulti(value);
  };

  const ProjectOrgList =
    ProductiveController &&
    ProductiveController.projectOrganizations.map(item => item.organization.id);

  useEffect(() => {
    getService('criteria/getListByForWhatId/2').then(result => {
      if (result) {
        setCriteriaList(result || []);
      }
    });
    getService('organization/get').then(result => {
      if (result) {
        setStateOrg(result.content || []);
      }
    });
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (ProductiveController !== null) {
      getService(
        `soum/getList/${ProductiveController.address?.aimag?.id}`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
    }
    if (isEditMode) {
      setSelectedProjectOrg(ProjectOrgList);
      form.setFieldsValue({
        ...ProductiveController,
        AddressDetail:
          ProductiveController.address &&
          ProductiveController.address.addressDetail,
        // CountryID: ProductiveController.address
        //   ? ProductiveController.address.country.id
        //   : '',
        AimagID: ProductiveController.address?.aimag?.id,
        SoumID: ProductiveController.address?.soum?.id,
        // BagID: ProductiveController.address
        //   ? ProductiveController.address.bag.id
        //   : '',
        OrgID: ProductiveController.organization.id,
      });
    }
  }, []);

  const selectProjectOrg = value => {
    setSelectedProjectOrg(value);
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
        };
        values.organizationIds = selectedProjectOrg;
        values.criteriaIds = criteriaListMulti;
        values.soumList = multiSum;
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

  const ProjectChildrenAddress =
    ProductiveController &&
    ProductiveController.address.childrenAddress.map(item => item.soum.id);

  const ProjectCriteriaList =
    ProductiveController &&
    ProductiveController.projectCriterias.map(item => item.criteria.id);

  // console.log(ProjectCriteriaList);

  return (
    <div>
      <Modal
        title="Бүтээмжит төсөл бүртгэх"
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
                      <InputNumber type="number" />
                    </Form.Item>
                    <Form.Item label="Шалгуур үзүүлэлт:" valuePropName="option">
                      {ProjectCriteriaList === null ? (
                        <MulticompleteSelect
                          data={criteriaList}
                          valueField="id"
                          size="medium"
                          onChange={value => selectCriteriaMulti(value)}
                        />
                      ) : (
                        <MulticompleteSelect
                          data={criteriaList}
                          defaultValue={ProjectCriteriaList}
                          valueField="id"
                          size="medium"
                          onChange={value => selectCriteriaMulti(value)}
                        />
                      )}
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
                        data={stateOrg}
                        onChange={value => selectOrg(value)}
                      />
                    </Form.Item>
                    <Form.Item label="Аймаг, хот:" name="MultiAimagID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateAimag}
                        onChange={value => selectAimag(value)}
                      />
                    </Form.Item>
                    <Form.Item label="Сум, Дүүрэг:" valuePropName="option">
                      <MulticompleteSelect
                        data={stateSum}
                        defaultValue={ProjectChildrenAddress}
                        valueField="id"
                        size="medium"
                        onChange={value => selectSumMulti(value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item label="Дэлгэрэнгүй хаяг:" name="AddressDetail">
                      <Input.TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Бусад мэдээлэл" key="2">
                <Row gutter={40}>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Түншлэгч байгууллага:"
                      valuePropName="option"
                    >
                      {ProjectOrgList === null ? (
                        <MulticompleteSelect
                          data={stateOrg}
                          valueField="id"
                          size="medium"
                          onChange={value => selectProjectOrg(value)}
                        />
                      ) : (
                        <MulticompleteSelect
                          data={stateOrg}
                          defaultValue={ProjectOrgList}
                          valueField="id"
                          size="medium"
                          onChange={value => selectProjectOrg(value)}
                        />
                      )}
                    </Form.Item>
                  </Col>
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
              <TabPane tab="Хавсралт файл" key="3">
                <Row>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Албан тоот:" name="mission">
                      <Upload {...Uploadprops}>
                        <Button icon={<UploadOutlined />}>
                          Файл хавсаргах
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Улсын бүртгэлийн гэрчилгээ:"
                      name="mission"
                    >
                      <Upload {...Uploadprops}>
                        <Button icon={<UploadOutlined />}>
                          Файл хавсаргах
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Төсөл /монгол:" name="mission">
                      <Upload {...Uploadprops}>
                        <Button icon={<UploadOutlined />}>
                          Файл хавсаргах
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Төсөл /Англи:" name="mission">
                      <Upload {...Uploadprops}>
                        <Button icon={<UploadOutlined />}>
                          Файл хавсаргах
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Санхүүгийн тайлан /Аудитын тайлан:"
                      name="mission"
                    >
                      <Upload {...Uploadprops}>
                        <Button icon={<UploadOutlined />}>
                          Файл хавсаргах
                        </Button>
                      </Upload>
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
