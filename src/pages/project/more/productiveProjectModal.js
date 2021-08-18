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
  const { ProductiveController, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [stateOrg, setStateOrg] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedProjectOrg, setSelectedProjectOrg] = useState([]);
  const [multiSum, setMultiSum] = useState();

  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  };

  const selectCountry = value => {
    getAimag(value);
  };

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

  const getBag = sumID => {
    getService(`bag/getList/${sumID}`, {}).then(result => {
      if (result) {
        setStateBag(result || []);
      }
    });
  };

  const selectSum = value => {
    getBag(value);
  };

  const selectOrg = value => {
    setSelectedOrg(value);
  };

  const selectSumMulti = value => {
    setMultiSum(value);
  };

  const ProjectOrgList =
    ProductiveController &&
    ProductiveController.projectOrganizations.map(item => item.organization.id);

  const ProjectChildrenAddress =
    ProductiveController &&
    ProductiveController.address.childrenAddress.map(item => item.soum.id);
  useEffect(() => {
    getService('organization/get').then(result => {
      if (result) {
        setStateOrg(result.content || []);
      }
    });
    getService('country/get').then(result => {
      if (result) {
        setStateCountry(result || []);
      }
    });
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (ProductiveController !== null) {
      getService(
        `soum/getList/${
          ProductiveController.address && ProductiveController.address.aimag.id
        }`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${
          ProductiveController.address && ProductiveController.address.soum.id
        }`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
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
        CountryID: ProductiveController.address
          ? ProductiveController.address.country.id
          : '',
        AimagID: ProductiveController.address
          ? ProductiveController.address.aimag.id
          : '',
        SoumID: ProductiveController.address
          ? ProductiveController.address.soum.id
          : '',
        BagID: ProductiveController.address
          ? ProductiveController.address.bag.id
          : '',
        OrgID: ProductiveController.organization.id,
        MultiAimagID: ProductiveController.address
          ? ProductiveController.address.aimag.id
          : '',
        MultiSoumID: ProductiveController.address
          ? ProductiveController.address.soum.id
          : '',
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
          projectType: { id: 1 },
          address: {
            addressDetail: values.AddressDetail,
            country: {
              id: values.CountryID,
            },
            aimag: {
              id: values.AimagID,
            },
            soum: {
              id: values.SoumID,
            },
            bag: {
              id: values.BagID,
            },
          },
        };
        values.organizationIds = selectedProjectOrg;
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
                    <Form.Item
                      label="Хариуцсан хүн:"
                      name="nameOfAuthorizedPerson"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item label="Төсөл хэрэгжүүлэх хугацаа:" name="period">
                      <Input />
                    </Form.Item>
                    <Form.Item name="OrgID" label="Байгууллага сонгох:">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateOrg}
                        onChange={value => selectOrg(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Улс:" name="CountryID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateCountry}
                        onChange={value => selectCountry(value)}
                      />
                    </Form.Item>
                    <Form.Item label="Аймаг, хот:" name="AimagID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateAimag}
                        onChange={value => selectAimag(value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="SoumID"
                      layout="vertical"
                      label="Сум, Дүүрэг:"
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateSum}
                        onChange={value => selectSum(value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="BagID"
                      layout="vertical"
                      label="Баг, Хороо:"
                    >
                      <AutoCompleteSelect valueField="id" data={stateBag} />
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
                <Row gutter={[40]}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item label="Аймаг, хот:" name="MultiAimagID">
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateAimag}
                        onChange={value => selectAimag(value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
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
              </TabPane>
              <TabPane tab="Бусад мэдээлэл" key="2">
                <Row gutter={40}>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Түншлэгч байгууллага:"
                      valuePropName="option"
                    >
                      <MulticompleteSelect
                        data={stateOrg}
                        defaultValue={ProjectOrgList}
                        valueField="id"
                        size="medium"
                        onChange={value => selectProjectOrg(value)}
                      />
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
