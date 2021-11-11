import { Col, Form, Input, message, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  postService,
  putService,
  getService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './Modal.style';
import AutoCompleteSelect from '../../../../components/Autocomplete';

export default function projectInnovationModal(props) {
  const { EditRow, isModalVisible, isEditMode, summaryID } = props;
  const [stateScpe, setStateScope] = useState(false);
  const [scopeID, setScopeID] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    getService(`scope/get`).then(result => {
      if (result) {
        setStateScope(result.content || []);
      }
    });
    if (isEditMode) {
      setScopeID(EditRow.scope.id);
      form.setFieldsValue({
        ...EditRow,
        innovativeActivities: EditRow.innovativeActivities,
        scopeName: EditRow.scope.name,
      });
    }
  }, []);

  const selectScope = value => {
    setScopeID(value);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.scope = { id: scopeID };
        if (isEditMode) {
          putService(`proposedInnovations/update/${EditRow.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`proposedInnovations/post/${summaryID}`, values)
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
        title="Төслийн хүрээнд санал болгож буй инноваци"
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
              <Col span={24}>
                <Form.Item name="scopeName" label="Хамрах хүрээ">
                  <AutoCompleteSelect
                    valueField="id"
                    placeholder="Хамрах хүрээ сонгох"
                    data={stateScpe}
                    onChange={value => selectScope(value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Инноваци, шинэлэг үйл ажиллагаанууд:"
                  name="innovativeActivities"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
