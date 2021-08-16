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
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../components/ModalComponent/produictiveProjectModal.style';

const { TabPane } = Tabs;

const Uploadprops = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
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
  const { Plancontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);

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

  useEffect(() => {
    // getService(`user/getTrainerListByOrgId/${orgID}`).then(result => {
    //   if (result) {
    //     setStateTrainers(result || []);
    //   }
    // });
    if (isEditMode) {
      form.setFieldsValue({
        ...Plancontroller,
      });
    }
  }, []);
  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`trainingTeam/update/${Plancontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('trainingTeam/post', values)
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
                    <Form.Item label="Төслийн нэр:" name="mission">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Төслийн санхүүжилт:" name="mission">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Төсөл хэрэгжүүлэх хугацаа:"
                      name="mission"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="TrainerID"
                      label="Төслийн үйл ажиллагааны чиглэл:"
                    >
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                    <Form.Item name="TrainerID" label="Байгууллага сонгох:">
                      <AutoCompleteSelect
                        valueField="id"
                        // data={stateTrainers}
                        // onChange={value => selectTrainer(value)}
                      />
                    </Form.Item>
                    <Form.Item name="TrainerID" label="Түншлэгч байгууллага:">
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Бусад мэдээлэл" key="2">
                <Row gutter={60}>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      name="TrainerID"
                      label="Төслийн үйл ажиллагааны чиглэл:"
                    >
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                    <Form.Item
                      name="TrainerID"
                      label="Төслийн үйл ажиллагааны чиглэл:"
                    >
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                    <Form.Item
                      name="TrainerID"
                      label="Өргөдөл гаргагчийн туршлага болон үйл ажиллагааны чиглэл:"
                    >
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                    <Form.Item
                      name="TrainerID"
                      label="Өргөдөл гаргагчийн санал болгож буй үйл ажиллагааны чиглэл:"
                    >
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                    <Form.Item
                      name="TrainerID"
                      label="Хамтран ажиллах түншлэгч байгууллагатай бол үйл ажиллагааны төрөл болон бусад дэлгэрэнгүй мэдээлэл:"
                    >
                      <AutoCompleteSelect valueField="id" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={12}>
                    <Form.Item
                      label="Улс:"
                      name="CountryID"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <AutoCompleteSelect
                        valueField="id"
                        data={stateCountry}
                        onChange={value => selectCountry(value)}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Аймаг, хот:"
                      name="AimagID"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
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
                      rules={[
                        {
                          required: true,
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <AutoCompleteSelect valueField="id" data={stateBag} />
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
