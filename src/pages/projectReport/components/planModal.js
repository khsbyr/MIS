import { Col, DatePicker, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../components/Autocomplete';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
// eslint-disable-next-line import/no-named-as-default
import ContentWrapper from '../../training/tabs/components/CvModal.style';
import { useCriteriaStore } from '../../../context/CriteriaContext';
import MulticompleteSelect from '../../../components/MulticompleteSelect';

export default function PlanModal(props) {
  const { Plancontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const { criteriaReferenceList } = useCriteriaStore();
  const [userList, setUserList] = useState();

  useEffect(() => {
    getService('user/get').then(result => {
      if (result) {
        setUserList(result.content || []);
      }
    });
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
        title="Төлөвлөгөө бүртгэх"
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
            <Row gutter={30}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  label="Төлөвлөгөөний нэр:"
                  name="mission"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Эхлэх огноо:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    // onChange={onChangeDate}
                    // defaultValue={
                    //   isEditMode ? moment(LicenseController.licensedDate) : ''
                    // }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item name="TrainerID" label="Бүрэлдэхүүн хэсэг:">
                  <AutoCompleteSelect
                    placeholder="Бүрэлдэхүүн хэсэг сонгох"
                    valueField="id"
                    data={criteriaReferenceList}
                    mode="multiple"
                  />
                </Form.Item>
                <Form.Item label="Дуусах огноо:">
                  <DatePicker
                    placeholder="Огноо сонгох"
                    // onChange={onChangeDate}
                    // defaultValue={
                    //   isEditMode ? moment(LicenseController.licensedDate) : ''
                    // }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Гүйцэтгэгчид:">
                  <MulticompleteSelect
                    data={userList}
                    valueField="id"
                    // onChange={value => SelectCriteria(value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Төслийн хөгжлийн зорилт, дунд хугацааны шалгуур үзүүлэлтэд хамаарах үр дүн:">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label="Тайлбар:">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
