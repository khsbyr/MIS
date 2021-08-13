import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Space,
} from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { ToolsContext } from '../../../context/Tools';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from '../../training/tabs/components/cv.styled';

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

export default function FeedbackModal(props) {
  const { Trainerscontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const toolsStore = useContext(ToolsContext);
  const [valueCheck, setValueCheck] = useState(2);
  const loadLazyTimeout = null;
  const [BirthDatee] = useState();
  const onInit = () => {
    toolsStore.setIsShowLoader(false);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
  };

  const onChangeCheck = e => {
    setValueCheck(e.target.value);
  };
  useEffect(() => {
    onInit();
    if (isEditMode) {
      form.setFieldsValue({
        ...Trainerscontroller,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        if (isEditMode) {
          putService(`userasd/update/${Trainerscontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`personasd/post`, values)
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
        title="Санал гомдлын бүртгэл"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1000}
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
              <Col xs={24} md={24} lg={8}>
                <Form.Item>
                  <DatePicker
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="Огноо"
                    className="FormItem"
                    defaultValue={
                      isEditMode
                        ? Trainerscontroller &&
                          moment(Trainerscontroller.birthDate)
                        : BirthDatee
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input className="FormItem" placeholder="Хүлээн авагч" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {/* <OrgaStyle> */}
                  <AutoCompleteSelect
                    valueField="id"
                    placeholder="Санал, гомдлын төрөл"
                    //   data={stateOrg}
                    //   onChange={value => selectOrg(value)}
                  />
                  {/* </OrgaStyle> */}
                </Form.Item>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {/* <OrgaStyle> */}
                  <AutoCompleteSelect
                    valueField="id"
                    placeholder="Хэлбэр"
                    //   data={stateOrg}
                    //   onChange={value => selectOrg(value)}
                  />
                  {/* </OrgaStyle> */}
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    className="FormItem"
                    placeholder="Санал гомдол гаргагч"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[30, 30]}>
              <Col xs={24} md={24} lg={12}>
                <h2 className="title">Санал, гомдлын агуулга</h2>
                <Form.Item name="AddressDetail">
                  <Input.TextArea
                    placeholder="(Санал, гомдлын агуулга)"
                    style={{
                      width: '100%',
                      height: '150px',
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <h2 className="title">Авсан арга хэмжээ</h2>
                <Form.Item name="AddressDetail">
                  <Input.TextArea
                    placeholder="(Авсан арга хэмжээ)"
                    style={{
                      width: '100%',
                      height: '150px',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2 className="title">Шийдвэрлэсэн эсэх</h2>
                <Radio.Group value={valueCheck} onChange={onChangeCheck}>
                  <Space direction="vertical">
                    <Radio value={1}>Тийм</Radio>
                    <Radio value={2}>Үгүй</Radio>
                  </Space>
                </Radio.Group>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
