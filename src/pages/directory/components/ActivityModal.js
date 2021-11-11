import { Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { postService, putService, getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from '../../training/tabs/components/CvModal.style';
import validateMessages from '../../../tools/validateMessage';
import AutoCompleteSelect from '../../../components/Autocomplete';

const { TextArea } = Input;

export default function ActivityModal(props) {
  const { Activitycontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateActivityType, setStateActivityType] = useState([]);
  const [stateProjectType, setStateProjectType] = useState([]);

  useEffect(() => {
    getService('activityType/get').then(result => {
      if (result) {
        setStateActivityType(result || []);
      }
    });
    getService('projectType/get').then(result => {
      if (result) {
        setStateProjectType(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...Activitycontroller,
        activitytypeID: Activitycontroller.activityType
          ? Activitycontroller.activityType.id
          : '',
        projecttypeID: Activitycontroller.projectType
          ? Activitycontroller.projectType.id
          : '',
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.activityType = {
          id: values.activitytypeID,
        };
        values.projectType = {
          id: values.projecttypeID,
        };
        if (isEditMode) {
          putService(`activity/update/${Activitycontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('activity/post', values)
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
        title="Үйл ажиллагаа бүртгэх"
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
            <Form.Item
              label="Үйл ажиллагаа:"
              name="activities"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea style={{ width: '100%', height: '100px' }} />
            </Form.Item>
            <Form.Item
              name="activitytypeID"
              label="Үйл ажиллагааны төрөл:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <AutoCompleteSelect
                valueField="id"
                placeholder="Үйл ажиллагааны төрөл сонгох"
                data={stateActivityType}
              />
            </Form.Item>
            <Form.Item
              name="projecttypeID"
              label="Төсөлийн төрөл:"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <AutoCompleteSelect
                valueField="id"
                placeholder="Төсөлийн төрөл сонгох"
                data={stateProjectType}
              />
            </Form.Item>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
