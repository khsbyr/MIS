import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect } from 'react';
// import AutoCompleteSelect from '../../../components/Autocomplete';
import { postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/guidelines.style';
import validateMessages from '../../../tools/validateMessage';

export default function CustomerSideModal(props) {
  const { Customersidecontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  // const [stateGender, setStateGender] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...Customersidecontroller,
      });
    }
  }, []);

  // const onChange = e => {
  //   setStateGender(e.target.value);
  // };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.isTrue = true;
        if (isEditMode) {
          putService(`customerSide/update/${Customersidecontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          console.log(values);
          postService('customerSide/post', values)
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
        title="Харилцах тал бүртгэх"
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
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              {/* <Col xs={24} md={24} lg={6}>
                <Form.Item name="isParent" layout="vertical" label="isparent:">
                  <Radio.Group onChange={onChange} value={stateGender}>
                    <Radio value={0}>false</Radio>
                    <Radio value={1}>true</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={22}>
                <Form.Item
                  label="Харилцах тал:"
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
              <Col xs={24} md={24} lg={12} />
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
